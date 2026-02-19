import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Efemeris from '../lib/models/Efemeris';
import { Efemeride } from '../lib/types';

async function seedEfemerides() {
  await dbConnect();
  
  const jsonPath = path.join(process.cwd(), 'public', 'efemerides.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found at ${jsonPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const efemerides: Efemeride[] = JSON.parse(fileContent);
  
  try {
      // transform data if necessary to match schema
      // Assuming Efemeride type matches Schema roughly or extra fields are ignored
      // We might need to map 'id' to '_id' or let mongo generate it?
      // Supabase 'id' might be UUID, Mongo uses ObjectId. 
      // Let's drop existing and re-seed or upsert? 
      // For simplicity, let's delete all and insert (seed usually implies fresh start or strict sync)
      
      console.log(`Clearing existing efemerides...`);
      await Efemeris.deleteMany({});
      
      console.log(`Inserting ${efemerides.length} efemerides...`);
      // Mongoose insertMany is efficient
      await Efemeris.insertMany(efemerides);
      
      console.log(`✅ Successfully seeded efemerides.`);
  } catch (error) {
      console.error(`❌ Error seeding efemerides:`, error);
  } finally {
      await mongoose.disconnect();
  }
}

seedEfemerides().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
