// Generate a random string of specified length
const generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Generate a random number within a range
const generateRandomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random alphanumeric ID
const generateRandomId = (prefix = '', length = 8) => {
    const randomString = generateRandomString(length);
    return `${prefix}${randomString}`;
};

// Generate a secure random string for JWT_SECRET
const generateJwtSecret = () => {
    return require('crypto').randomBytes(64).toString('hex');
};

module.exports = {
    generateRandomString,
    generateRandomNumber,
    generateRandomId,
    generateJwtSecret,
};
