import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEfemeris extends Document {
  date: string; // "MM-DD"
  year: number;
  title: string;
  description?: string;
  type: 'match' | 'birth' | 'debut' | 'other';
  teamId: mongoose.Types.ObjectId;
  importance: number;
}

const EfemerisSchema: Schema = new Schema({
  date: { type: String, required: true },
  year: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['match', 'birth', 'debut', 'other'], required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  importance: { type: Number, default: 1 },
}, { collection: 'Efemerides' });

EfemerisSchema.index({ teamId: 1, date: 1 });

const Efemeris: Model<IEfemeris> = mongoose.models.Efemeris || mongoose.model<IEfemeris>('Efemeris', EfemerisSchema);

export default Efemeris;
