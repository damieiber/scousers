import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOriginalLink {
  url: string;
  sourceName: string;
  title: string;
}

export interface IArticle extends Document {
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  shortSummary: string;
  shortSummaryEn: string;
  imageUrl?: string;
  teamId: mongoose.Types.ObjectId;
  publishedAt: Date;
  embedding: number[];
  rivalSentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  originalLinks: IOriginalLink[];
  createdAt: Date;
  updatedAt: Date;
}

const OriginalLinkSchema = new Schema({
  url: { type: String, required: true },
  sourceName: { type: String, required: true },
  title: { type: String, required: true },
}, { _id: false });

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  titleEn: { type: String, default: '' },
  summary: { type: String, required: true },
  summaryEn: { type: String, default: '' },
  shortSummary: { type: String, required: true },
  shortSummaryEn: { type: String, default: '' },
  imageUrl: { type: String },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  publishedAt: { type: Date, default: Date.now },
  embedding: { type: [Number], required: true },
  rivalSentiment: { type: String, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] },
  originalLinks: [OriginalLinkSchema],
}, { 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'Articles'
});

// Indexes for performance
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ teamId: 1, publishedAt: -1 });

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
