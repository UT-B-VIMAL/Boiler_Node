const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode'); // Import QR code library
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { generateJwtSecret } = require('../utils/randomGenerator');

const JWT_SECRET = process.env.JWT_SECRET || generateJwtSecret();

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, employeeId, email, role, password, createdBy } = req.body;

        // Check if email or employee ID already exists
        const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
        if (existingUser) {
            return errorResponse(res, 'Email or Employee ID already exists', null, 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            employeeId,
            email,
            role,
            password: hashedPassword,
            createdBy,
        });

        await user.save();
        successResponse(res, user, 'User registered successfully', 'success', 201);
    } catch (error) {
        errorResponse(res, 'Error registering user', error);
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return errorResponse(res, 'Invalid email or password', null, 401);
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid email or password', null, 401);
        }

        // Generate MFA secret and QR code if not already set (first login)
        if (!user.mfaSecret) {
            const mfaSecret = speakeasy.generateSecret({ length: 20 });
            user.mfaSecret = mfaSecret.base32;

            // Generate QR code URL
            const otpauthUrl = mfaSecret.otpauth_url;
            const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

            await user.save();
            return successResponse(
                res,
                { qrCodeUrl, otpauthUrl },
                'MFA setup required. Scan the QR code with your authenticator app.',
                'success'
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role.name },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        successResponse(res, { token, user }, 'Login successful. Proceed to MFA verification.', 'success');
    } catch (error) {
        errorResponse(res, 'Error logging in', error);
    }
};

// Verify MFA token
exports.verifyMfa = async (req, res) => {
    try {
        const { userId, token } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user || !user.mfaSecret) {
            return errorResponse(res, 'MFA not set up for this user', null, 400);
        }

        // Verify MFA token
        const isVerified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
        });

        if (!isVerified) {
            return errorResponse(res, 'Invalid MFA token', null, 401);
        }

        successResponse(res, null, 'MFA verification successful', 'success');
    } catch (error) {
        errorResponse(res, 'Error verifying MFA token', error);
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role');
        successResponse(res, users, 'Users fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching users', error);
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (!user) {
            return errorResponse(res, 'User not found', null, 404);
        }
        successResponse(res, user, 'User fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching user', error);
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, role },
            { new: true }
        ).populate('role');
        if (!user) {
            return errorResponse(res, 'User not found', null, 404);
        }
        successResponse(res, user, 'User updated successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error updating user', error);
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return errorResponse(res, 'User not found', null, 404);
        }
        successResponse(res, null, 'User deleted successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error deleting user', error);
    }
};
