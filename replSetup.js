const repl = require('repl');
const fs = require('fs');
const WebSocket = require('ws');
const sharedEmitter = require('./shared');
const manipulateData = require('./manipulateData');

// Start the REPL
const replServer = repl.start({ prompt: 'mongo-repl> ' });

// Add all manipulateData functions to REPL context
Object.assign(replServer.context, manipulateData);

// Listen for document updates via the shared emitter
sharedEmitter.on('documentsFetched', (documents) => {
    replServer.context.documents = documents;
    console.log('Documents updated in REPL context. Try these commands:');
    console.log('- documents (view all documents)');
    console.log('- logDocumentKeys(documents[0]) (view first document keys)');
    console.log('- saveDocuments() (save to file)');
    console.log('- readOutput() (read from file)');
});

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});

wss.on('connection', (ws) => {
    console.log('Server connected to REPL via WebSocket');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'documentsFetched') {
                replServer.context.documents = data.documents;
                sharedEmitter.emit('documentsFetched', data.documents);
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
});

// Handle REPL exit
replServer.on('exit', () => {
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});