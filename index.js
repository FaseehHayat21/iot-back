const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = 'mongodb+srv://faseeh:faseeh%40210663@handsanitizer.p1w5a.mongodb.net/';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mmongoose
.connect(MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Device Schema and Model
const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  deviceLocation: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive', 'maintenance'] },
});

const Device = mongoose.model('Device', deviceSchema);

// Alert Schema and Model
const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', alertSchema);

// Routes

// Get number of devices
app.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching devices' });
  }
});

// Add or Update device
app.post('/devices', async (req, res) => {
  try {
    const { deviceId, deviceLocation, status } = req.body;
    if (!deviceId || !deviceLocation || !status) {
      return res.status(400).json({ error: 'Device ID, location, and status are required' });
    }

    let device = await Device.findOne({ deviceId });
    if (device) {
      // If device exists, update its status
      device.deviceLocation = deviceLocation;
      device.status = status;
      await device.save();
      res.status(200).json({ message: 'Device updated successfully', device });
    } else {
      // If device doesn't exist, create new
      device = new Device({ deviceId, deviceLocation, status });
      await device.save();
      res.status(201).json({ message: 'Device added successfully', device });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Device ID must be unique' });
    } else {
      res.status(500).json({ error: 'Error adding or updating device' });
    }
  }
});

// Get alerts
app.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching alerts' });
  }
});

// Add a new alert (For refill alert)
app.post('/alerts', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const alert = new Alert({ message });
    await alert.save();
    res.status(201).json({ message: 'Alert added successfully', alert });
  } catch (error) {
    res.status(500).json({ error: 'Error adding alert' });
  }
});

// Refill Alert - Endpoint for when PIR detects more than 4 activations
app.post('/alerts/refill', async (req, res) => {
  try {
    const { deviceId, message } = req.body;
    if (!deviceId || !message) {
      return res.status(400).json({ error: 'Device ID and message are required' });
    }

    const alertMessage = `Device ${deviceId} needs refill: ${message}`;
    const alert = new Alert({ message: alertMessage });
    await alert.save();
    res.status(201).json({ message: 'Refill alert added successfully', alert });
  } catch (error) {
    res.status(500).json({ error: 'Error adding refill alert' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
