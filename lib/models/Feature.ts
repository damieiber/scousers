import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeature extends Document {
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
}

const FeatureSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { collection: 'Features' });

const Feature: Model<IFeature> = mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);

export default Feature;
