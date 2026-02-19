import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Feature from '../lib/models/Feature';
import SubscriptionFeature from '../lib/models/SubscriptionFeature';

const FEATURES = [
  { key: 'AdFree', name: 'Sin Publicidad', description: 'Navegación sin anuncios intrusivos' },
  { key: 'DarkMode', name: 'Modo Oscuro', description: 'Interfaz con colores oscuros para descansar la vista' },
  { key: 'MatchCenter', name: 'Match Center', description: 'Estadísticas en vivo y detalles de partidos' },
  { key: 'SquadDetails', name: 'Detalle de Plantel', description: 'Información completa de todos los jugadores' },
  { key: 'MultiTeam', name: 'Multi-Equipo', description: 'Seguir a más de un equipo a la vez' },
  { key: 'RivalMode', name: 'Modo Rival', description: 'Ver noticias desde la perspectiva del rival' },
  { key: 'AdvancedStats', name: 'Estadísticas Avanzadas', description: 'Métricas detalladas de rendimiento' },
  { key: 'EarlyAccess', name: 'Acceso Anticipado', description: 'Ver noticias antes que nadie' }
];

const SUBSCRIPTION_PLANS = {
  free: ['MatchCenter', 'SquadDetails'],
  standard: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode'],
  plus: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode'],
  premium: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode', 'AdvancedStats', 'EarlyAccess'],
  trial: ['MatchCenter', 'SquadDetails', 'AdFree', 'DarkMode', 'MultiTeam', 'RivalMode', 'AdvancedStats', 'EarlyAccess']
};

async function seedFeatures() {
  await dbConnect();
  console.log('🌱 Seeding Features and Subscription Plans...');

  // 1. Seed Features
  console.log('Inserting Features...');
  for (const feat of FEATURES) {
    await Feature.findOneAndUpdate(
      { key: feat.key },
      { ...feat, is_active: true },
      { upsert: true, new: true }
    );
  }

  // 2. Seed SubscriptionFeatures
  console.log('Inserting Subscription Features...');
  // Clear existing to avoid duplicates logic complexity
  await SubscriptionFeature.deleteMany({});

  const subscriptionFeaturesToInsert = [];
  
  for (const [plan, features] of Object.entries(SUBSCRIPTION_PLANS)) {
    for (const featureKey of features) {
      subscriptionFeaturesToInsert.push({
        subscription_status: plan,
        feature_key: featureKey
      });
    }
  }

  if (subscriptionFeaturesToInsert.length > 0) {
      await SubscriptionFeature.insertMany(subscriptionFeaturesToInsert);
  }

  console.log('✅ Features and Subscription Plans seeded.');
  await mongoose.disconnect();
}

seedFeatures().catch(console.error);
