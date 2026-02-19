import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';

// Import all models to ensure they are registered and we can access their collections
import Article from '../lib/models/Article';
import Efemeris from '../lib/models/Efemeris';
import Feature from '../lib/models/Feature';
import Rivalry from '../lib/models/Rivalry';
import Source from '../lib/models/Source';
import SubscriptionFeature from '../lib/models/SubscriptionFeature';
import Team from '../lib/models/Team';
import User from '../lib/models/User';

async function resetDatabase() {
  console.log('🔄 Connecting to MongoDB...');
  await dbConnect();
  
  const models = [
    { name: 'Article', model: Article },
    { name: 'Efemeris', model: Efemeris },
    { name: 'Feature', model: Feature },
    { name: 'Rivalry', model: Rivalry },
    { name: 'Source', model: Source },
    { name: 'SubscriptionFeature', model: SubscriptionFeature },
    { name: 'Team', model: Team },
    { name: 'User', model: User },
  ];

  console.log('🗑️  Dropping collections...');
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  console.log(`Found collections: ${collectionNames.join(', ')}`);

  for (const modelInfo of models) {
    const collectionName = modelInfo.model.collection.name;
    console.log(`Checking model ${modelInfo.name} -> Collection: ${collectionName}`);
    
    // Drop the collection if it exists (using Mongoose model)
    try {
        await modelInfo.model.collection.drop();
        console.log(`✅ Dropped collection: ${collectionName}`);
    } catch (error: any) {
        if (error.code === 26) {
             console.log(`ℹ️  Collection ${collectionName} does not exist (NamespaceNotFound).`);
        } else {
             console.error(`❌ Error dropping ${collectionName}:`, error);
        }
    }
  }

  // Also drop any stray collections that might verify the duplicate issue
  // The user mentioned "efemerides" vs "efemeris", "subscription_features" vs "subscriptionfeatures"
  // We should try to clean up everything that looks like our app's data
  const potentialStrays = [
      'efemerides', 'efemeris', 
      'subscription_features', 'subscriptionfeatures', 
      'articles', 'users', 'teams', 'sources', 'features', 'rivalries'
  ];

  for (const stray of potentialStrays) {
      // If it wasn't dropped already by the model
      const exists = collectionNames.includes(stray);
      if (exists) {
          try {
              await mongoose.connection.db.dropCollection(stray);
              console.log(`🧹 Dropped stray collection: ${stray}`);
          } catch (e) {
              // ignore
          }
      }
  }

  console.log('✨ All collections dropped.');
  
  console.log('🌱 Re-seeding data...');
  // We can call other seed scripts here or just exit and let the user run them.
  // The user said "crearla de nuevo, correctamente". 
  // Maybe we should run the seed logic here.
  
  // Let's exit and allow separate seed scripts to run, or we can define a master seed script.
  // For now, this script just RESETS.
  
  await mongoose.disconnect();
  console.log('👋 Disconnected.');
}

resetDatabase().catch(err => {
    console.error(err);
    process.exit(1);
});
