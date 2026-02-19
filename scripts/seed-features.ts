import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import Feature from '../lib/models/Feature';
import SubscriptionFeature from '../lib/models/SubscriptionFeature';

const FEATURES = [
  { key: 'ad_free', name: 'Sin Publicidad', description: 'Navegación sin anuncios intrusivos' },
  { key: 'dark_mode', name: 'Modo Oscuro', description: 'Interfaz con colores oscuros para descansar la vista' },
  { key: 'match_center', name: 'Match Center', description: 'Estadísticas en vivo y detalles de partidos' },
  { key: 'squad_details', name: 'Detalle de Plantel', description: 'Información completa de todos los jugadores' },
  { key: 'multi_team', name: 'Multi-Equipo', description: 'Seguir a más de un equipo a la vez' },
  { key: 'rival_mode', name: 'Modo Rival', description: 'Ver noticias desde la perspectiva del rival' },
  { key: 'advanced_stats', name: 'Estadísticas Avanzadas', description: 'Métricas detalladas de rendimiento' },
  { key: 'early_access', name: 'Acceso Anticipado', description: 'Ver noticias antes que nadie' }
];

const SUBSCRIPTION_PLANS = {
  free: ['match_center', 'squad_details'],
  standard: ['match_center', 'squad_details', 'ad_free', 'dark_mode'],
  plus: ['match_center', 'squad_details', 'ad_free', 'dark_mode', 'multi_team', 'rival_mode'],
  premium: ['match_center', 'squad_details', 'ad_free', 'dark_mode', 'multi_team', 'rival_mode', 'advanced_stats', 'early_access'],
  trial: ['match_center', 'squad_details', 'ad_free', 'dark_mode', 'multi_team', 'rival_mode', 'advanced_stats', 'early_access']
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
