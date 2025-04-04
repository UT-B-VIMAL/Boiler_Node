require("dotenv").config({ path: __dirname + "/../.env" });
const cron = require("node-cron");

// Function to get database size
async function checkDatabaseSize() {
    try {
        console.log("cron job working");
        
    } catch (error) {
        console.error("Error running cron:", error);
    }
}

cron.schedule("* * * * *", () => {
    console.log("Running scheduled job check for everyminute...");
    checkDatabaseSize();
});


console.log("Running every minute!");
