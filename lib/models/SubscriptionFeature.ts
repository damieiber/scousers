import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriptionFeature extends Document {
  subscriptionStatus: 'free' | 'standard' | 'plus' | 'premium' | 'trial';
  featureKey: string;
}

const SubscriptionFeatureSchema: Schema = new Schema({
  subscriptionStatus: { 
    type: String, 
    required: true,
    enum: ['free', 'standard', 'plus', 'premium', 'trial'] 
  },
  featureKey: { type: String, required: true },
}, { collection: 'SubscriptionFeatures' });

SubscriptionFeatureSchema.index({ subscriptionStatus: 1, featureKey: 1 }, { unique: true });

const SubscriptionFeature: Model<ISubscriptionFeature> = mongoose.models.SubscriptionFeature || mongoose.model<ISubscriptionFeature>('SubscriptionFeature', SubscriptionFeatureSchema);

export default SubscriptionFeature;
