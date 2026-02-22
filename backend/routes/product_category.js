const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();

//add product category
router.post('/addcategory', user_session_checker('add_category'), async (req, res) => {
  manualLog("enter in add category routte")
  try {
    const { name,lgst,sgst,cgst,other } = req.body;
    console.log('Adding category with name:', name);
    const ProductCategory = req.db.model('ProductCategory');

    const newCategory = new ProductCategory({
      name,lgst,sgst,cgst,other
    });

    await newCategory.save();
    manualLog("added new category",newCategory)
    res.status(200).send({
      message: 'Product category added successfully',
      category: newCategory,
    });
  } catch (error) {
    console.log('Error in add category:', error);
    manualLog(`error in add category :: ${error}`);
    res.status(500).json({ message: 'Error adding product category', error });
  }
});

//update product category
router.post('/updatecategory/:id', user_session_checker('update_category'), async (req, res) => {
  manualLog("enter in update category")
  try {
    const {id} = req.params;
    const data_to_update = req.body;
    console.log('update category:', data_to_update);
    const ProductCategory = req.db.model('ProductCategory');

    const newCategory = await ProductCategory.findOneAndUpdate({_id:id}, data_to_update, {new: true});
    manualLog(`category udapted successfully :: ${newCategory}`)
    res.status(200).send({
      message: 'Product category updated successfully',
      category: newCategory,
    });
  } catch (error) {
    console.log('Error in update category:', error);
    manualLog(`error in update category :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Error updating product category', error });
  }
});

//get all category with pagination
router.get('/getallcategorywithpages', user_session_checker('get_all_category'), async (req, res) => {
  manualLog("entered in get all category")
  try {
    const ProductCategory = req.db.model('ProductCategory');

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search
    const searchTerm = req.query.search || '';
    const searchQuery = searchTerm
      ? { name: { $regex: searchTerm, $options: 'i' } }
      : {};

    // Sort
    const sortField = req.query.sortField || 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
    const sortQuery = { [sortField]: sortDirection };

    const totalRecords = await ProductCategory.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limit);

    const category = await ProductCategory.find(searchQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    if (category.length === 0) {
      return res.send({
        message: "no category found",
        category: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          limit
        }
      });
    }

    manualLog("get all the category successfully", category);
    res.send({
      message: "all category fetched",
      category,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit
      }
    });

  } catch (error) {
    manualLog("some error accured in get category", error);
    console.log("some error accured in get all category ", error);
    res.send({
      message: "some error accurred in get all category",
      error: error
    });
  }
});

//get all category
router.get('/getallcategory', user_session_checker('get_all_category'), async (req, res) => {
  manualLog("entered in get all category")
  try {
    const ProductCategory = req.db.model('ProductCategory');
    const category = await ProductCategory.find();

    if(category.length == 0 ){
      res.send({message:"no category found",category:null})
    }
    manualLog("get all the category successfully",category)
    res.send({message:"all category fetched",category:category})
    
  } catch (error) {
    manualLog("some error accured in get category",error);
    console.log("some error accured in get all category ",error)
    res.send({
      message:"some error accurred in get all category",
      error:error
    })
  }
})

//delete product category
router.delete('/deletecategory/:id', user_session_checker('delete_category'), async (req, res) => {
  manualLog("entered in delete category by id")
  try {
    const {id} = req.params;
    console.log('delete category with id:', id);
    const ProductCategory = req.db.model('ProductCategory');

    await ProductCategory.findOneAndDelete({_id:id});
    manualLog("deleted category by id successfully")
    res.status(200).send({
      message: 'Product category deleted successfully',
      id: id,
    });
  } catch (error) {
    console.log('Error in delete category:', error);
    manualLog(`error in delete category :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Error deleting product category', error });
  }
});

module.exports = router;