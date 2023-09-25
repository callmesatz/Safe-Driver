# Driver Monitoring Service

The **Driver Monitoring Service** is a Node.js-based backend application designed to monitor driving events and generate alerts for unsafe driving behavior. It's built using the Express.js framework and utilizes the node-cron library for scheduling rule evaluations.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Rule Engine](#rule-engine)
- [Testing](#testing)

## Features

- Receive driving events from IoT devices and store them.
- Evaluate driving events based on a predefined rule to generate alerts.
- Store and retrieve alerts by unique ID.
- Dynamic alert thresholds based on the location type.
- Schedule rule evaluations every 5 minutes using node-cron.
- Easily extensible for future rule enhancements.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- Knowledge of Node.js, Express.js, and basic API development.
- Postman or a similar tool for testing API endpoints.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   cd driver-monitoring-service
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
## Usage

To start the **Driver Monitoring Service**, run the following command:

```bash
npm start
```

The service will start and listen for incoming requests on the specified port (default is 3000).

## API Endpoints

### POST /event

This endpoint is used to send driving events from IoT devices to the service.

Example request body:

```json
{
  "timestamp": "2023-05-24T05:55:00+00:00",
  "is_driving_safe": true,
  "vehicle_id": "1234",
  "location_type": "highway"
}
```
### GET /alert/{alert_id}

This endpoint retrieves an alert by its unique ID.

Example request:

```bash
Get /alert/{alert_id}
```
## Rule Engine

The rule engine evaluates driving events to generate alerts based on the following criteria:

1. There are at least X events in the past 5 minutes where `is_driving_safe` is `false`. X varies based on the `location_type`.
2. No alert has already been generated in the past 5 minutes for the same `location_type`.

## Testing

To test the service, you can use Postman to send POST requests to `/event` and GET requests to `/alert/{alert_id}`. Verify that the service correctly receives events and generates alerts based on the rule engine.
