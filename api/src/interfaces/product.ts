// src/interfaces/product.ts
import { Document } from 'mongoose';

export interface ProductInterface {
  _id: string;
  name: string;
  imageUrl: string;
  subcategory_id?: string; // subcategory_id ahora es opcional
}