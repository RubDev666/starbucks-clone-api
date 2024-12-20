// api/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/category';
import Subcategory from './src/models/subcategory';
import Product from './src/models/product';
import connectToDatabase from './src/utils/db';

dotenv.config();

const categoriesData = require('./categories.json');
const subcategoriesData = require('./subcategories.json');
const productsData = require('./products.json');

const seedDatabase = async () => {
    try {
        await connectToDatabase();

        // Limpiar las colecciones existentes
        await Promise.all([
            Category.deleteMany({}),
            Subcategory.deleteMany({}),
            Product.deleteMany({})
        ]);

        console.log('Colecciones limpiadas');

        // Crear categorías
        const createdCategories: any[] = [];
         for(const cat of categoriesData){
          const category = new Category({
                 name: cat.name
          });
         try{
             const savedCategory =  await category.save();
            console.log("Categoría guardada: ", savedCategory)
             createdCategories.push(savedCategory);

          } catch (error) {
             console.error("Error al guardar categoría:", error)
         }
        }

        console.log('Categorías creadas');

        // Crear subcategorías
         const createdSubcategories: any[] = [];
          for(const subcat of subcategoriesData){
          const category = createdCategories.find((cat: any) => String(cat.name) === subcat.category_id);
            if(category){
                   const subcategory = new Subcategory({
                       name: subcat.name,
                       category_id: category._id
                       });
               try {
                   const savedSubcategory = await subcategory.save();
                    console.log('Subcategoría guardada:',savedSubcategory)
                    createdSubcategories.push(savedSubcategory);
                   } catch(error){
                      console.error('Error al guardar subcategoría:', error);
                  }
          }else{
           console.log(`No se encontró la categoría con ID: ${subcat.category_id} para la subcategoría: ${subcat.name}`);
             }
          }

       console.log('Subcategorías creadas');

        // Crear productos

      for(const prod of productsData){
          const subcategory = createdSubcategories.find((subcat: any) => String(subcat.name) === prod.subcategory_id);
            if(subcategory){
                   const product = new Product({
                        name: prod.name,
                        subcategory_id: subcategory._id,
                       imageUrl: prod.imageUrl
                     });
                 try{
                    const savedProduct = await product.save()
                    console.log('Producto guardado:', savedProduct);
                    } catch(error){
                       console.error('Error al guardar producto:',error);
                     }
            }else{
               console.log(`No se encontró la subcategoría con ID: ${prod.subcategory_id} para el producto: ${prod.name}`)
            }

        }
        console.log('Productos creados');
        console.log('Datos semilla cargados correctamente');
    } catch (error) {
        console.error('Error al cargar los datos semilla:', error);
    }
      //Si quieres interactuar con la base de datos después del seed, retira la siguiente linea
   //  finally {
   //    await mongoose.disconnect();
   // }
};

seedDatabase();