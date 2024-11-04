// manipulateData.js
const fs = require('fs');
const path = require('path');
const sharedEmitter = require('./shared');

// Define the path to the JSON file
const jsonFilePath = path.join(__dirname, 'foundDocuments.json');

// Initialize the documents variable
let documents = [];
// Listen for document updates
sharedEmitter.on('documentsFetched', (newDocuments) => {
    documents = newDocuments;
    // Automatically save to file when documents are updated
    saveDocuments();
});

function getDocuments() {
    return documents;
}

// Function to save documents back to the JSON file
function saveDocuments() {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(documents, null, 2), 'utf8');
        console.log('Documents successfully saved to JSON file.');
        sharedEmitter.emit('documentsSaved', documents);
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

// Export the functions
module.exports = { getDocuments, saveDocuments, documents };