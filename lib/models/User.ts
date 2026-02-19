import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  primaryTeamId?: mongoose.Types.ObjectId;
  secondaryTeamIds: mongoose.Types.ObjectId[];
  preferences: Record<string, any>;
  subscriptionStatus: 'free' | 'standard' | 'plus' | 'premium' | 'trial';
  subscriptionExpiresAt?: Date;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  emailVerified: { type: Date },
  image: { type: String },
  primaryTeamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  secondaryTeamIds: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  preferences: { type: Schema.Types.Mixed, default: {} },
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'standard', 'plus', 'premium', 'trial'], 
    default: 'free' 
  },
  subscriptionExpiresAt: { type: Date },
  roles: { type: [String], default: ['user'] },
}, { 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'Users' 
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
