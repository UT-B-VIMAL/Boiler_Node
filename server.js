require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const connectDB = require('./config/db');
const sampleRoutes = require('./routes/sampleRoute');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Initialize Express
const app = express();

// CORS Handling
const corsOptions = {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect Database
connectDB();

// if deploy in live
const isProduction = fs.existsSync(process.env.PRIVATE_KEY_LINK);

const DOMAIN = isProduction ? process.env.LIVE_URL : process.env.LOCAL_URL;
const PORT = isProduction ? 8090 : 9000;


let server;

if (isProduction) {
  const options = {
    key: fs.readFileSync(process.env.PRIVATE_KEY_LINK),
    cert: fs.readFileSync(process.env.PRIVATE_CERTIFICATE_LINK),
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const apiRouter = express.Router();

// Routes
apiRouter.use('/sample', sampleRoutes);
apiRouter.use('/roles', roleRoutes); // Secured in roleRoutes.js
apiRouter.use('/users', userRoutes); // Secured in userRoutes.js
apiRouter.use('/permissions', permissionRoutes); // Add permission routes

// Health Check
apiRouter.get("/", (req, res) => res.send("API is running..."));
app.use("/api", apiRouter);


// Start Server
server.listen(PORT, () => {
    console.log(
      `Server running on ${
        isProduction ? "https" : "http"
      }://${DOMAIN}:${PORT}`
    );
  });
