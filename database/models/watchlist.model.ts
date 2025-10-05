import { models, Schema, Document, Model, model } from "mongoose";

export interface IWatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index to prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// Use existing model if it exists, otherwise create a new one
export const Watchlist: Model<IWatchlistItem> =
  (models?.Watchlist as Model<IWatchlistItem>) ||
  model<IWatchlistItem>("Watchlist", WatchlistSchema);
