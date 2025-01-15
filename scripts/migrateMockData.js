// scripts/migrateMockData.js

console.log("Migration script started.");

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

(async () => {
  try {
    // Check if service account key exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account key not found at path: ${serviceAccountPath}`);
    }

    // Initialize Firebase Admin SDK
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized.");

    const db = admin.firestore();

    // Import mockData
    const mockData = require('../src/data/mockData');
    if (!Array.isArray(mockData)) {
      throw new Error('mockData is not an array.');
    }
    console.log(`Loaded ${mockData.length} athletes from mockData.js`);

    if (mockData.length === 0) {
      console.log("No athletes to migrate.");
      process.exit(0);
    }

    for (const [index, athlete] of mockData.entries()) {
      console.log(`Migrating athlete ${index + 1}/${mockData.length}: ${athlete.metadata.name}`);
      
      // Reference to the athletes collection with a specified document ID (optional)
      // If you want to use a specific ID, replace `.doc()` with `.doc(athlete.id.toString())`
      const athleteRef = db.collection('athletes').doc(); // Auto-generated ID

      // Set athlete data
      await athleteRef.set({
        metadata: athlete.metadata,
        growth_targets: athlete.growth_targets,
        skills: athlete.skills,
      });

      console.log(`Migrated athlete: ${athlete.metadata.name} with ID: ${athleteRef.id}`);
    }

    console.log('Data migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error migrating data:', error);
    process.exit(1);
  }
})();
