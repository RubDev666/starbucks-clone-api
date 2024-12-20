// src/interfaces/category.ts
import { Document } from 'mongoose';

export interface CategoryInterface {
    _id: string;
    name: string;
}


export interface CategoryDocument extends Document<any, {}>, Omit<CategoryInterface, '_id'> {
  _id: any
}