const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();

//add product category
router.post('/addcategory', user_session_checker('add_category'), async (req, res) => {
  manualLog("enter in add category routte")
  console.log(req.body)
  try {
    const { name,lgst,sgst,cgst,other } = req.body;
    console.log('Adding category with name:', name);
    const ProductCategory = req.db.model('ProductCategory');

    const newCategory = new ProductCategory({
      name,lgst,sgst,cgst,other
    });

    await newCategory.save();

    res.status(200).send({
      message: 'Product category added successfully',
      category: newCategory,
    });
  } catch (error) {
    console.log('Error in add category:', error);
    manualLog(`error in add category :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Error adding product category', error });
  }
});

//update product category
router.post('/updatecategory/:id', user_session_checker('update_category'), async (req, res) => {
  try {
    const {id} = req.params;
    const data_to_update = req.body;
    console.log('update category:', data_to_update);
    const ProductCategory = req.db.model('ProductCategory');

    const newCategory = await ProductCategory.findOneAndUpdate({_id:id}, data_to_update, {new: true});

    res.send(200).json({
      message: 'Product category updated successfully',
      category: newCategory,
    });
  } catch (error) {
    console.log('Error in update category:', error);
    manualLog(`error in update category :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Error updating product category', error });
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
    res.send({message:"all category fetched",category:category})
    
  } catch (error) {
    manualLog("some error accured in get category");
    console.log("some error accured in get all category ",error)
    res.send({
      message:"some error accurred in get all category",
      error:error
    })
  }
})

//delete product category
router.delete('/deletecategory/:id', user_session_checker('delete_category'), async (req, res) => {
  try {
    const {id} = req.params;
    console.log('delete category with id:', id);
    const ProductCategory = req.db.model('ProductCategory');

    await ProductCategory.findOneAndDelete({_id:id});

    res.send(200).json({
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