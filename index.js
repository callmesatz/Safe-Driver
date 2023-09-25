const express = require('express');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Local Memory Storage For Events And Alerts
const events = [];
const alerts = [];
const lThresholds = {
    highway: 4,
    city_center: 3,
    commercial: 2,
    residential: 1,
};

// Helper function to evaluate the rule and generate alerts
function evaluateRule() {
    const cTime = new Date();
    const fma = new Date(cTime - 5 * 60 * 1000);

    // Filter events within the last 5 minutes
    const recentEvents = events.filter(
        (event) => new Date(event.timestamp) >= fma
    );

    // Check for location-specific thresholds and generate alerts
    for (const lType in lThresholds) {
        const threshold = lThresholds[lType];
        const uEvents = recentEvents.filter(
            (event) =>
                event.location_type === lType && event.is_driving_safe === false
        );

        if (uEvents.length >= threshold) {
            // Check if an alert for this location type has already been generated in the last 5 minutes
            const existingAlert = alerts.find(
                (alert) =>
                    alert.location_type === lType &&
                    new Date(alert.timestamp) >= fma
            );

            if (!existingAlert) {
                // Generate a new alert
                const alert = {
                    id: uuidv4(), // Generate a unique ID (you need to import 'uuid')
                    timestamp: cTime.toISOString(),
                    location_type: lType,
                };
                alerts.push(alert);
            }
        }
    }
}


// Endpoint to receive driving events
app.post('/event', (req, res) => {
    const event = req.body;
    events.push(event);
    res.status(200).json({ message: 'Event received' });
});

// Endpoint to retrieve alerts by ID
app.get('/alert/:id', (req, res) => {
    const alertId = req.params.id;
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
    }
    res.status(200).json(alert);
});
// Endpoint to retrieve all alerts
app.get('/alert', (req, res) => {
    if (alerts.length === 0) {
        return res.status(404)
        .json({ message: 'Alerts not found' });
    }
    res.status(200)
    .json(alerts);
});

let task = cron.schedule('*/5 * * * *', () => {
    console.log('Running the rule...');

    // Call the evaluateRule function
    evaluateRule();
});
task.start();
// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
