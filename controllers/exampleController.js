const { sendNotification } = require('../utils/notification');

exports.exampleAction = async (req, res) => {
    try {
        // Perform some action
        const data = { message: "This is a test notification" };

        // Send a notification
        sendNotification('test-event', data);

        res.status(200).json({ success: true, message: "Notification sent" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred", error });
    }
};
