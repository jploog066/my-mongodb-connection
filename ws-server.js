// ws-server.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs');
const WebSocket = require('ws');
const sharedEmitter = require('./shared'); // Import the shared emitter

// Load environment variables from .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(express.json());

// Function to connect to the REPL's WebSocket server
let ws;

function connectToREPL() {
    ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
        console.log('Server connected to REPL WebSocket server');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed. Reconnecting...');
        setTimeout(connectToREPL, 1000);
    });
}

// **Define routes before starting the server**

app.get("/find/:database/:collection", async (req, res) => {
    try {
        const { database, collection } = req.params;
        const db = client.db(database);
        const documents = await db.collection(collection).find({}).toArray();

        // Emit the documents through the shared emitter
        sharedEmitter.emit('documentsFetched', documents);

        // Also still send via WebSocket if connected
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'documentsFetched', documents }));
        }

        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/insert/:database/:collection", async (req, res) => {
    try {
        const { database, collection } = req.params;
        const db = client.db(database);

        // check if single or multiple documents
        if (req.body.document) {
            // single document insert
            const result = await db.collection(collection).insertOne(req.body.document);
            res.status(201).json({
                message: "Document inserted successfully",
                insertedId: result.insertedId
            })
        }
        else if (req.body.documents && Array.isArray(req.body.documents)) {
            // multiple documents insert
            const result = await db.collection(collection).insertMany(req.body.documents);
            res.status(201).json({
                message: `${result.insertedCount} documents inserted`,
                insertedIds: result.insertedIds
            })
        }
        else {
            res.status(400).json({
                error: "Request body must contain either 'document' or 'documents' as array"
            })
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Connect to the REPL's WebSocket server
        connectToREPL();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if the connection fails
    }
}

startServer();