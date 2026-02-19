import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRivalry extends Document {
  teamId: mongoose.Types.ObjectId;
  rivalTeamId: mongoose.Types.ObjectId;
  rank: number;
}

const RivalrySchema: Schema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  rivalTeamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  rank: { type: Number, required: true },
}, { collection: 'Rivalries' });

RivalrySchema.index({ teamId: 1, rivalTeamId: 1 }, { unique: true });

const Rivalry: Model<IRivalry> = mongoose.models.Rivalry || mongoose.model<IRivalry>('Rivalry', RivalrySchema);

export default Rivalry;
