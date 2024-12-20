// En src/controllers/menuController.ts
import { Request, Response } from 'express';
import connectToDatabase from '../utils/db';
import Category from '../models/category';
import Subcategory from '../models/subcategory';
import Product from '../models/product';
const categoriesData = require('../../categories.json');
const subcategoriesData = require('../../subcategories.json');
const productsData = require('../../products.json');


const getCategories = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    await connectToDatabase();
    const categories = process.env.USE_DATABASE === 'true' ? await Category.find() : categoriesData;
    return res.json(categories);

  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

const findCategory = async (categoryName: string) => {
  if (process.env.USE_DATABASE === 'true') {
    return await Category.findOne({ name: categoryName });
  }
  return categoriesData.find((cat: any) => cat.name === categoryName);
};

const findSubcategory = async (categoryName: string, typeName: string) => {
  const category = await findCategory(categoryName);
  if (!category) {
    return undefined;
  }
  if (process.env.USE_DATABASE === 'true') {
    return await Subcategory.findOne({ category_id: category._id, name: typeName });
  }
  return subcategoriesData.find((subcat: any) => subcat.category_id === category.name && subcat.name === typeName);
};


const getTypesByCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    await connectToDatabase();
    const { categoryName } = req.params;
    const category = await findCategory(categoryName);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const subcategories = process.env.USE_DATABASE === 'true'
    ? await Subcategory.find({ category_id: category._id })
    : subcategoriesData.filter((subcat: any) => subcat.category_id === category.name);

     return res.json(subcategories.map((subcat: any) => ({
        _id: subcat._id,
        name: subcat.name,
        category: {
           _id: category._id,
           name: category.name
        }
      })));
  } catch (error) {
    console.error(`Error al obtener los tipos para la categoría ${req.params.categoryName}:`, error);
    return res.status(500).json({ message: 'Error al obtener los tipos' });
  }
};

const getSubcategoriesByType = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
      await connectToDatabase();
    const { categoryName, typeName } = req.params;
    const category = await findCategory(categoryName);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const subcategories = process.env.USE_DATABASE === 'true'
      ? await Subcategory.find({ category_id: category._id, name: typeName })
      : subcategoriesData.filter((subcat: any) => subcat.category_id === category.name && subcat.name === typeName);

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    return res.json(subcategories.map((subcat: any) => ({ _id: subcat._id, name: subcat.name })));
  } catch (error) {
      console.error(`Error al obtener subcategorías para el tipo ${req.params.typeName} de la categoría ${req.params.categoryName}:`, error);
    return res.status(500).json({ message: 'Error al obtener las subcategorías' });
  }
};

const getItemsByCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
        await connectToDatabase();
    const { categoryName, typeName } = req.params;
    const subcategory = await findSubcategory(categoryName, typeName);
    if (!subcategory) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    const products = process.env.USE_DATABASE === 'true'
      ? await Product.find({ subcategory_id: subcategory._id })
      : productsData.filter((prod: any) => prod.subcategory_id === subcategory.name);

      const category = await findCategory(categoryName);

      return res.json(products.map((prod: any) => ({
        _id: prod._id,
        name: prod.name,
        imageUrl: prod.imageUrl,
        subcategory: {
          _id: subcategory._id,
          name: subcategory.name,
          category: {
            _id: category._id,
            name: category.name
          }
        }
      })));
  } catch (error) {
      console.error(`Error al obtener productos de la subcategoría del tipo ${req.params.typeName} de la categoría ${req.params.categoryName}:`, error);
   return res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

const getProductByName = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    await connectToDatabase();
    const { productName } = req.params;
    const product = process.env.USE_DATABASE === 'true'
      ? await Product.findOne({ name: productName }).populate('subcategory_id')
      : productsData.find((prod: any) => prod.name === productName);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const subcategory = process.env.USE_DATABASE === 'true'
    ? await Subcategory.findById(product.subcategory_id)
    : subcategoriesData.find((subcat: any) => subcat._id === product.subcategory_id);

     if (!subcategory) {
        return res.status(404).json({ message: 'Subcategoría no encontrada' });
     }
      const category = process.env.USE_DATABASE === 'true'
    ? await Category.findById(subcategory.category_id)
    : categoriesData.find((cat: any) => cat.name === subcategory.category_id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const grandCategory = process.env.USE_DATABASE === 'true' && category.category_id
      ? await Category.findById(category.category_id)
      : null;

    const categoryData = process.env.USE_DATABASE === 'true'
    ? { _id: category._id, name: category.name }
    : { _id: category?._id, name: category?.name };


     return res.json({
        _id: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        subcategory: {
           _id: subcategory._id,
          name: subcategory.name,
          category: {
          ...categoryData,
          ...(grandCategory && { grandCategory: { _id: grandCategory._id, name: grandCategory.name } })
          }
        }
      });
  } catch (error) {
      console.error(`Error al obtener el producto ${req.params.productName}:`, error);
    return res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

const getAllItemsFromCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    await connectToDatabase();
     const { categoryName } = req.params;
    const category = await findCategory(categoryName);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
      const subcategories = process.env.USE_DATABASE === 'true'
      ? await Subcategory.find({ category_id: category._id })
      : subcategoriesData.filter((subcat: any) => subcat.category_id === category.name);


     let allItems = [];
    for (const subcategory of subcategories) {
      const products = process.env.USE_DATABASE === 'true'
        ? await Product.find({ subcategory_id: subcategory._id })
        : productsData.filter((prod: any) => prod.subcategory_id === subcategory.name);

      for (const prod of products) {
        const category = process.env.USE_DATABASE === 'true'
        ? await Category.findById(subcategory.category_id)
        : categoriesData.find((cat: any) => cat.name === subcategory.category_id);

        const categoryData = process.env.USE_DATABASE === 'true'
        ? { _id: category?._id, name: category?.name }
        : { _id: category?._id, name: category?.name };

        allItems.push({
          _id: prod._id,
          name: prod.name,
          imageUrl: prod.imageUrl,
          subcategory: {
            _id: subcategory._id,
            name: subcategory.name,
              category: { ...categoryData }
          }
        });
      }
    }
    return res.json(allItems);
  } catch (error) {
       console.error(`Error al obtener todos los elementos de la categoría ${req.params.categoryName}:`, error);
     return res.status(500).json({ message: 'Error al obtener los elementos de la categoría' });
  }
};


export {
  getCategories,
  getTypesByCategory,
  getSubcategoriesByType,
  getItemsByCategory,
  getProductByName,
  getAllItemsFromCategory,
};