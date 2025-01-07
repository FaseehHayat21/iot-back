// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// // Replace this with your actual MongoDB URI
// const mongoURI = "mongodb+srv://faseeh:faseeh%40210663@handsanitizer.p1w5a.mongodb.net/";

// // Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log("Connected to MongoDB"))
// .catch(err => console.error("MongoDB connection error:", err));


// // Create a model for the schema
// const Location = mongoose.model("Location", LocationSchema);

// // Initialize Express
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// // Device Schema and Model
// const deviceSchema = new mongoose.Schema({
//   deviceId: { type: String, required: true, unique: true },
//   deviceLocation: { type: String, required: true },
//   status: { type: String, required: true, enum: ['active', 'inactive', 'maintenance'] },
// });

// const Device = mongoose.model('Device', deviceSchema);

// // Alert Schema and Model
// const alertSchema = new mongoose.Schema({
//   message: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// const Alert = mongoose.model('Alert', alertSchema);

// // Routes

// // Get number of devices
// app.get('/devices', async (req, res) => {
//   try {
//     const devices = await Device.find();
//     res.json(devices);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching devices' });
//   }
// });

// // Add or Update device
// app.post('/devices', async (req, res) => {
//   try {
//     const { deviceId, deviceLocation, status } = req.body;
//     if (!deviceId || !deviceLocation || !status) {
//       return res.status(400).json({ error: 'Device ID, location, and status are required' });
//     }

//     let device = await Device.findOne({ deviceId });
//     if (device) {
//       // If device exists, update its status
//       device.deviceLocation = deviceLocation;
//       device.status = status;
//       await device.save();
//       res.status(200).json({ message: 'Device updated successfully', device });
//     } else {
//       // If device doesn't exist, create new
//       device = new Device({ deviceId, deviceLocation, status });
//       await device.save();
//       res.status(201).json({ message: 'Device added successfully', device });
//     }
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ error: 'Device ID must be unique' });
//     } else {
//       res.status(500).json({ error: 'Error adding or updating device' });
//     }
//   }
// });

// // Get alerts
// app.get('/alerts', async (req, res) => {
//   try {
//     const alerts = await Alert.find();
//     res.json(alerts);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching alerts' });
//   }
// });

// // Add a new alert (For refill alert)
// app.post('/alerts', async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ error: 'Message is required' });
//     }
//     const alert = new Alert({ message });
//     await alert.save();
//     res.status(201).json({ message: 'Alert added successfully', alert });
//   } catch (error) {
//     res.status(500).json({ error: 'Error adding alert' });
//   }
// });

// // Refill Alert - Endpoint for when PIR detects more than 4 activations
// app.post('/alerts/refill', async (req, res) => {
//   try {
//     const { deviceId, message } = req.body;
//     if (!deviceId || !message) {
//       return res.status(400).json({ error: 'Device ID and message are required' });
//     }

//     const alertMessage = `Device ${deviceId} needs refill: ${message}`;
//     const alert = new Alert({ message: alertMessage });
//     await alert.save();
//     res.status(201).json({ message: 'Refill alert added successfully', alert });
//   } catch (error) {
//     res.status(500).json({ error: 'Error adding refill alert' });
//   }
// });

// // Start the server
// const PORT = 3000; // You can change this port if needed
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Replace this with your actual MongoDB URI
const mongoURI = "mongodb+srv://211920:tehseen@ubt.lm2my.mongodb.net/";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Define a schema for storing GPS data
const LocationSchema = new mongoose.Schema({
latitude: String,
longitude: String,
timestamp: { type: Date, default: Date.now },
});

// Create a model for the schema
const Location = mongoose.model("Location", LocationSchema);

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoint to handle incoming GPS data
app.post("/api/location", async (req, res) => {
try {
const { latitude, longitude } = req.body;
if (!latitude || !longitude) {
return res.status(400).send("Latitude and longitude are required");
}

const location = new Location({ latitude, longitude });
await location.save();
res.status(200).send("Location saved successfully");
} catch (error) {
console.error("Error saving location:", error);
res.status(500).send("Internal server error");
}
});

// API endpoint to retrieve all GPS data
app.get("/api/location", async (req, res) => {
try {
const locations = await Location.find();
res.status(200).json(locations);
} catch (error) {
console.error("Error retrieving locations:", error);
res.status(500).send("Internal server error");
}
});

// Start the server
const PORT = 3000; // You can change this port if needed
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));