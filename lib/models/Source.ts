import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISource extends Document {
  name: string;
  url: string;
  logoUrl?: string;
  teamId: mongoose.Types.ObjectId;
  status: 'active' | 'quarantined' | 'inactive';
  consecutiveFailures: number;
  quarantineThreshold: number;
}

const SourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  status: { type: String, enum: ['active', 'quarantined', 'inactive'], default: 'active' },
  consecutiveFailures: { type: Number, default: 0 },
  quarantineThreshold: { type: Number, default: 5 },
}, { collection: 'Sources' });

const Source: Model<ISource> = mongoose.models.Source || mongoose.model<ISource>('Source', SourceSchema);

export default Source;
