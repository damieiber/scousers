
// ==================================================================================
// MONGODB SHELL SCRIPT (mongosh) - PASCALCASE COLLECTIONS
// ==================================================================================
// Usage:
// 1. Open your terminal
// 2. Connect to your MongoDB instance: `mongosh "your_connection_string"`
// 3. Switch to your database: `use scousers`
// 4. Copy and paste the content below into the shell, or run `load("path/to/mongo_shell_init.js")`
// ==================================================================================

db = db.getSiblingDB('Scousers');

// --- 1. TEAMS Collection (PascalCase) ---
print('Creating "Teams" collection...');
try {
    db.createCollection('Teams', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['key', 'name', 'isAvailable'],
                properties: {
                    key: { bsonType: 'string', description: 'Unique key (e.g., liverpool)' },
                    name: { bsonType: 'string', description: 'Display name' },
                    sport_id: { bsonType: 'string' },
                    isAvailable: { bsonType: 'bool' },
                    rivalTeamId: { bsonType: ['objectId', 'null'], description: 'ObjectId of the rival team' },
                    primaryColor: { bsonType: 'string' },
                    secondaryColor: { bsonType: 'string' },
                    logoUrl: { bsonType: 'string' },
                    createdAt: { bsonType: 'date' },
                    updatedAt: { bsonType: 'date' }
                }
            }
        }
    });
    db.Teams.createIndex({ key: 1 }, { unique: true });
} catch (e) {
    print('Teams collection might already exist: ' + e);
}


// --- 2. SOURCES Collection (PascalCase) ---
print('Creating "Sources" collection...');
try {
    db.createCollection('Sources', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['url', 'name', 'status', 'teamId'],
                properties: {
                    name: { bsonType: 'string' },
                    url: { bsonType: 'string' },
                    logoUrl: { bsonType: ['string', 'null'] },
                    teamId: { bsonType: 'objectId', description: 'Reference to Teams._id' },
                    status: { enum: ['active', 'quarantined', 'inactive'] },
                    consecutiveFailures: { bsonType: 'int' },
                    quarantineThreshold: { bsonType: 'int' }
                }
            }
        }
    });
    db.Sources.createIndex({ url: 1 }, { unique: true });
    db.Sources.createIndex({ teamId: 1 });
} catch (e) {
    print('Sources collection might already exist: ' + e);
}


// --- 3. ARTICLES Collection (PascalCase) ---
print('Creating "Articles" collection...');
try {
    db.createCollection('Articles', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['title', 'summary', 'publishedAt', 'embedding', 'teamId'],
                properties: {
                    title: { bsonType: 'string' },
                    titleEn: { bsonType: ['string', 'null'] },
                    summary: { bsonType: 'string' },
                    summaryEn: { bsonType: ['string', 'null'] },
                    shortSummary: { bsonType: 'string' },
                    shortSummaryEn: { bsonType: ['string', 'null'] },
                    imageUrl: { bsonType: ['string', 'null'] },
                    teamId: { bsonType: 'objectId', description: 'The team this article belongs to' },
                    publishedAt: { bsonType: 'date' },
                    embedding: { bsonType: 'array', items: { bsonType: 'double' } },
                    rivalSentiment: { enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', null] },
                    // originalLinks embedded
                    createdAt: { bsonType: 'date' },
                    updatedAt: { bsonType: 'date' }
                }
            }
        }
    });
    db.Articles.createIndex({ publishedAt: -1 });
    db.Articles.createIndex({ teamId: 1, publishedAt: -1 });
} catch (e) {
    print('Articles collection might already exist: ' + e);
}


// --- 4. USERS Collection (PascalCase) ---
print('Creating "Users" collection...');
try {
    db.createCollection('Users', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['email'],
                properties: {
                    name: { bsonType: 'string' },
                    email: { bsonType: 'string' },
                    emailVerified: { bsonType: ['date', 'null'] },
                    image: { bsonType: ['string', 'null'] },
                    language: { enum: ['es', 'en'], description: 'User preferred language, defaults to es' },
                    primaryTeamId: { bsonType: ['objectId', 'null'] },
                    secondaryTeamIds: { bsonType: 'array', items: { bsonType: 'objectId' } },
                    subscriptionStatus: { enum: ['free', 'standard', 'plus', 'premium', 'trial'] },
                    createdAt: { bsonType: 'date' },
                    updatedAt: { bsonType: 'date' }
                }
            }
        }
    });
    db.Users.createIndex({ email: 1 }, { unique: true });
} catch (e) {
    print('Users collection might already exist: ' + e);
}


// --- 5. RIVALRIES Collection (PascalCase) ---
print('Creating "Rivalries" collection...');
try {
    db.createCollection('Rivalries', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['teamId', 'rivalTeamId', 'rank'],
                properties: {
                    teamId: { bsonType: 'objectId' },
                    rivalTeamId: { bsonType: 'objectId' },
                    rank: { bsonType: 'int' }
                }
            }
        }
    });
    db.Rivalries.createIndex({ teamId: 1, rivalTeamId: 1 }, { unique: true });
} catch (e) {
    print('Rivalries collection might already exist: ' + e);
}


// --- 6. EFEMERIDES Collection (PascalCase) ---
print('Creating "Efemerides" collection...');
try {
    db.createCollection('Efemerides', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['date', 'title', 'type', 'teamId'],
                properties: {
                    date: { bsonType: 'string' },
                    year: { bsonType: 'int' },
                    title: { bsonType: 'string' },
                    description: { bsonType: 'string' },
                    type: { enum: ['match', 'birth', 'debut', 'other'] },
                    teamId: { bsonType: 'objectId' },
                    importance: { bsonType: 'int' }
                }
            }
        }
    });
    db.Efemerides.createIndex({ teamId: 1, date: 1 });
} catch (e) {
    print('Efemerides collection might already exist: ' + e);
}


// --- 7. FEATURES Collection (PascalCase) ---
print('Creating "Features" collection...');
try {
    db.createCollection('Features', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['key', 'name'],
                properties: {
                    key: { bsonType: 'string' },
                    name: { bsonType: 'string' },
                    description: { bsonType: 'string' },
                    isActive: { bsonType: 'bool' }
                }
            }
        }
    });
    db.Features.createIndex({ key: 1 }, { unique: true });
} catch (e) {
    print('Features collection might already exist: ' + e);
}


// --- 8. SUBSCRIPTIONFEATURES Collection (PascalCase) ---
print('Creating "SubscriptionFeatures" collection...');
try {
    db.createCollection('SubscriptionFeatures', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['subscriptionStatus', 'featureKey'],
                properties: {
                    subscriptionStatus: { enum: ['free', 'standard', 'plus', 'premium', 'trial'] },
                    featureKey: { bsonType: 'string' }
                }
            }
        }
    });
    db.SubscriptionFeatures.createIndex({ subscriptionStatus: 1, featureKey: 1 }, { unique: true });
} catch (e) {
    print('SubscriptionFeatures collection might already exist: ' + e);
}


// ==================================================================================
// SEED DATA
// ==================================================================================

// 1. Seed Teams
print('Seeding Teams...');
const teamsData = [
    {
        key: 'liverpool',
        name: 'Liverpool FC',
        sportId: 'football',
        isAvailable: true,
        primaryColor: '#C8102E',
        secondaryColor: '#F6EB61',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        key: 'everton',
        name: 'Everton FC',
        sportId: 'football',
        isAvailable: true,
        primaryColor: '#003399',
        secondaryColor: '#FFFFFF',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

teamsData.forEach(t => {
    try {
        // Insert only if key doesn't exist
        db.Teams.updateOne(
            { key: t.key },
            { $setOnInsert: t },
            { upsert: true }
        );
    } catch (e) {
        print('Error inserting team ' + t.name + ': ' + e);
    }
});

// Get IDs for relationships
const liverpool = db.Teams.findOne({ key: 'liverpool' });
const everton = db.Teams.findOne({ key: 'everton' });

if (liverpool && everton) {
    // 2. Link Rivals
    print('Linking Rivals...');
    db.Teams.updateOne({ _id: liverpool._id }, { $set: { rivalTeamId: everton._id } });
    db.Teams.updateOne({ _id: everton._id }, { $set: { rivalTeamId: liverpool._id } });

    // 3. Seed Sources
    print('Seeding Sources...');
    const liverpoolSources = [
        { name: 'Liverpool FC Official', url: 'https://www.liverpoolfc.com/news' },
        { name: 'Liverpool Echo', url: 'https://www.liverpoolecho.co.uk/all-about/liverpool-fc' },
        { name: 'This Is Anfield', url: 'https://www.thisisanfield.com/' },
        { name: 'Empire of the Kop', url: 'https://www.empireofthekop.com/' }
    ];

    const evertonSources = [
        { name: 'Everton FC Official', url: 'https://www.evertonfc.com/news' },
        { name: 'Liverpool Echo (Everton)', url: 'https://www.liverpoolecho.co.uk/all-about/everton-fc' },
        { name: 'ToffeeWeb', url: 'https://www.toffeeweb.com/' },
        { name: 'GrandOldTeam', url: 'https://www.grandoldteam.com/news/' }
    ];

    const seedSource = (s, tid) => {
        db.Sources.updateOne(
            { url: s.url },
            { 
               $set: { 
                   name: s.name, 
                   teamId: tid, 
                   status: 'active',
                   quarantineThreshold: 5 
               },
               $setOnInsert: { consecutiveFailures: 0 }
            },
            { upsert: true }
        );
    };

    liverpoolSources.forEach(s => seedSource(s, liverpool._id));
    evertonSources.forEach(s => seedSource(s, everton._id));
}

// 4. Seed Features
print('Seeding Features...');
const features   = [
  { key: 'MatchCenter', name: 'Match Center', is_active: true },
  { key: 'SquadDetails', name: 'Detalle de Plantel', is_active: true },
  { key: 'MultiTeam', name: 'Multi-Equipo', is_active: true },
  { key: 'RivalMode', name: 'Modo Rival', is_active: true },
  { key: 'AdFree', name: 'Sin Publicidad', is_active: true },
  { key: 'DarkMode', name: 'Modo Oscuro', is_active: true },
  { key: 'AdvancedStats', name: 'Estadísticas Avanzadas', is_active: true },
  { key: 'EarlyAccess', name: 'Acceso Anticipado', is_active: true }
];

features.forEach(f => {
    db.Features.updateOne({ key: f.key }, { $set: f }, { upsert: true });
});

// 5. Seed SubscriptionFeatures
print('Seeding SubscriptionFeatures...');
const subPlans = [
    { status: 'free', keys: ['MatchCenter', 'SquadDetails'] },
    { status: 'standard', keys: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode'] },
    { status: 'plus', keys: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode'] },
    { status: 'premium', keys: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode', 'AdvancedStats', 'EarlyAccess'] },
    { status: 'trial', keys: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode', 'AdvancedStats', 'EarlyAccess'] }
];

// Clear logic for simplicity on seed
db.SubscriptionFeatures.deleteMany({});
subPlans.forEach(plan => {
    plan.keys.forEach(k => {
        db.SubscriptionFeatures.insertOne({
            subscriptionStatus: plan.status,
            featureKey: k
        });
    });
});

print('✅ DB Reset and Seed Completed Successfully!');
