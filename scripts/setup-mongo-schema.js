
const { MongoClient } = require('mongodb');

// Configuration
// NOTE: Set MONGODB_URI in your .env.local file
// Example: mongodb://localhost:27017/scousers_app
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scousers_app';
const dbName = uri.split('/').pop().split('?')[0];

async function setupSchema() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // --- TEAMS Collection ---
    console.log('Creating "teams" collection...');
    await db.createCollection('teams', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['key', 'is_available'],
          properties: {
            key: { bsonType: 'string', description: 'Unique key for the team (e.g., liverpool)' },
            name: { bsonType: 'string', description: 'Display name of the team' },
            sport_id: { bsonType: 'string', description: 'ID of the sport' },
            is_available: { bsonType: 'bool', description: 'Is the team active in the app?' },
            created_at: { bsonType: 'date' },
            updated_at: { bsonType: 'date' }
          }
        }
      }
    });
    // Unique index on team key
    await db.collection('teams').createIndex({ key: 1 }, { unique: true });


    // --- SOURCES Collection ---
    console.log('Creating "sources" collection...');
    await db.createCollection('sources', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['url', 'name', 'status'],
          properties: {
            name: { bsonType: 'string' },
            url: { bsonType: 'string' },
            logo_url: { bsonType: ['string', 'null'] },
            team_id: { bsonType: 'objectId' }, // Reference to teams._id
            status: { enum: ['active', 'quarantined', 'inactive'] },
            consecutive_failures: { bsonType: 'int' },
            quarantine_threshold: { bsonType: 'int' }
          }
        }
      }
    });
    await db.collection('sources').createIndex({ url: 1 }, { unique: true });
    await db.collection('sources').createIndex({ team_id: 1 });


    // --- THEMED ARTICLES (Main News) Collection ---
    console.log('Creating "articles" collection...');
    // Note: Renamed from themed_articles to articles for simplicity in MongoDB
    await db.createCollection('articles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'summary', 'published_at', 'embedding'],
          properties: {
            title: { bsonType: 'string' },
            summary: { bsonType: 'string' }, // Full summary
            short_summary: { bsonType: 'string' }, // One-liner
            image_url: { bsonType: ['string', 'null'] },
            team_id: { bsonType: 'objectId' },
            published_at: { bsonType: 'date' },
            embedding: { 
              bsonType: 'array',
              items: { bsonType: 'double' } // Embedding vector
            },
            rival_sentiment: { enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', null] },
            // Denormalized links to original sources
            original_links: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['url', 'title', 'source_name'],
                properties: {
                  url: { bsonType: 'string' },
                  title: { bsonType: 'string' },
                  source_name: { bsonType: 'string' }
                }
              }
            }
          }
        }
      }
    });
    await db.collection('articles').createIndex({ published_at: -1 });
    await db.collection('articles').createIndex({ team_id: 1 });
    // IMPORTANT: Vector search index usually created in Atlas UI, but we can verify field existence here.


    // --- USERS Collection (NextAuth) ---
    console.log('Creating "users" collection...');
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email'],
          properties: {
            name: { bsonType: 'string' },
            email: { bsonType: 'string' },
            emailVerified: { bsonType: ['date', 'null'] },
            image: { bsonType: ['string', 'null'] },
            // Custom fields
            primary_team_id: { bsonType: ['objectId', 'null'] },
            subscription_status: { enum: ['free', 'standard', 'plus', 'premium', 'trial'] },
            subscription_expires_at: { bsonType: ['date', 'null'] },
            roles: { bsonType: 'array', items: { bsonType: 'string' } }
          }
        }
      }
    });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });


    // --- ACCOUNTS Collection (NextAuth) ---
    console.log('Creating "accounts" collection...');
    await db.createCollection('accounts', {
        // Standard NextAuth schema
    });
    await db.collection('accounts').createIndex({ provider: 1, providerAccountId: 1 }, { unique: true });


    // --- RIVALRIES Collection ---
    console.log('Creating "rivalries" collection...');
    await db.createCollection('rivalries', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['team_id', 'rival_team_id', 'rank'],
          properties: {
            team_id: { bsonType: 'objectId' },
            rival_team_id: { bsonType: 'objectId' },
            rank: { bsonType: 'int' }
          }
        }
      }
    });
    await db.collection('rivalries').createIndex({ team_id: 1, rival_team_id: 1 }, { unique: true });

    
    // --- EFEMERIDES Collection ---
    console.log('Creating "efemerides" collection...');
    await db.createCollection('efemerides', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['date', 'title', 'type'],
                properties: {
                    date: { bsonType: 'string' }, // "MM-DD" format usually
                    year: { bsonType: 'int' },
                    title: { bsonType: 'string' },
                    description: { bsonType: 'string' },
                    type: { enum: ['match', 'birth', 'debut', 'other'] },
                    team_id: { bsonType: 'objectId' },
                    importance: { bsonType: 'int' }
                }
            }
        }
    });
    await db.collection('efemerides').createIndex({ date: 1 });


    console.log('\n✅ All collections created successfully!');

  } catch (error) {
    if (error.codeName === 'NamespaceExists') {
        console.warn('⚠️ Collection already exists. Skipping...');
    } else {
        console.error('❌ Error creating schema:', error);
    }
  } finally {
    await client.close();
  }
}

setupSchema().catch(console.error);
