import express from 'express';
import { getCategories, getTypesByCategory, getSubcategoriesByType, getItemsByCategory, getProductByName, getAllItemsFromCategory } from '../controllers/menuController';


const router = express.Router();

// Define un middleware asincrono
const asyncMiddleware = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/categories', asyncMiddleware(getCategories));
router.get('/categories/:categoryName/types', asyncMiddleware(getTypesByCategory));
router.get('/categories/:categoryName/types/:typeName/categories', asyncMiddleware(getSubcategoriesByType));
router.get('/categories/:categoryName/types/:typeName/categories/:categoryTitle/items', asyncMiddleware(getItemsByCategory));
router.get('/products/:productName', asyncMiddleware(getProductByName));
router.get('/categories/:categoryName/items', asyncMiddleware(getAllItemsFromCategory));


export default router;