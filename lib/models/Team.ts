import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeam extends Document {
  key: string;
  name: string;
  sportId: string;
  isAvailable: boolean;
  rivalTeamId?: mongoose.Types.ObjectId;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sportId: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  rivalTeamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  logoUrl: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, collection: 'Teams' });

TeamSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});
TeamSchema.set('toObject', { virtuals: true });
TeamSchema.set('collection', 'Teams');

// Prevent overwrite if model already exists
const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);

export default Team;
