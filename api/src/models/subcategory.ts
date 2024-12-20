import mongoose, { Schema, Document, Types } from 'mongoose';

interface Subcategory extends Document {
  name: string;
  category_id: Types.ObjectId;
}

const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

export default mongoose.model<Subcategory>('Subcategory', SubcategorySchema);