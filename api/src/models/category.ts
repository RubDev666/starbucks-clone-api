import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true }
});

export default mongoose.model<Category>('Category', CategorySchema);