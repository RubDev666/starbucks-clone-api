// src/interfaces/subcategory.ts
import { Document } from 'mongoose';

export interface SubcategoryInterface {
    _id: string;
    name: string;
    category_id: string;
}


export interface SubcategoryDocument extends Document<any, {}>, Omit<SubcategoryInterface, '_id'> {
    _id: any
}