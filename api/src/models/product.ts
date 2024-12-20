import mongoose, { Schema, Document, Types } from 'mongoose';

interface Product extends Document {
  name: string;
  subcategory_id: Types.ObjectId;
   imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  imageUrl: { type: String }
});

export default mongoose.model<Product>('Product', ProductSchema);