const express = require('express')
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();

router.post('/addtocart',user_session_checker("add_cart"),async(req,res)=>{
    manualLog("entered in add cart method")
    try {
        console.log(req.body)
        const Cart = req.db.model("Cart");
        const res_data = await Cart.create(req.body) 
        manualLog("cart added successfully",res_data)
        res.status(200).send({
            message:"cart added successfully",
            success:true,
            cart:res_data
        })
    }catch(error){
        manualLog("something broke in cart add",error)
        console.log(error,"something broke in the add cart");
        res.status(500).send({message:"something went wronge",error});
    }
})

router.get("/getcart",user_session_checker("get_cart"),async(req,res)=>{
    manualLog("entered in get cart method")
    try {
        const salesman = req.session.user.tenant_user_id;
        const Cart = req.db.model("Cart");
        const res_data = await Cart.find({salesman_data:salesman}).populate('salesman_data').populate('clients.seller_data').populate("clients.items.product_data");
        manualLog("cart fetched successfully",res_data)
        res.status(200).send({
            message:"cart fetched successfully",
            success:true,
            cart:res_data || null
        })
    }catch(error){
        manualLog("something broke in get cart",error)
        console.log(error,"something broke in the get cart");
        res.status(500).send({message:"something went wronge",error});
    }
})

// UNIFIED UPDATE CART - Handles all cart operations in one endpoint
router.put("/updatecart/:cartId", user_session_checker("update_cart"), async(req, res) => {
    manualLog("entered in unified update cart method")
    try {
        const { cartId } = req.params;
        const Cart = req.db.model("Cart");
        
        // Find the cart
        let cart = await Cart.findById(cartId);
        
        if (!cart) {
            manualLog("cart not found")
            return res.status(404).send({
                message: "cart not found",
                success: false
            });
        }
        
        // Update the entire cart with the new data
        // This completely replaces the clients array with the new data
        if (req.body.clients) {
            cart.clients = req.body.clients;
        }
        
        // Update salesman if provided
        if (req.body.salesman_data) {
            cart.salesman_data = req.body.salesman_data;
        }
        
        // Save the updated cart
        await cart.save();
        
        // Fetch the updated cart with populated fields
        const res_data = await Cart.findById(cartId)
            .populate('salesman_data')
            .populate('clients.seller_data')
            .populate("clients.items.product_data");
        
        manualLog("cart updated successfully",res_data)
        res.status(200).send({
            message: "cart updated successfully",
            success: true,
            cart: res_data
        })
    } catch(error) {
        manualLog("something broke in update cart", error)
        console.log(error, "something broke in the update cart");
        res.status(500).send({message: "something went wrong", error});
    }
})

// Delete entire cart
router.delete("/deletecart/:cartId", user_session_checker("delete_cart"), async(req, res) => {
    manualLog("entered in delete cart method")
    try {
        const { cartId } = req.params;
        const Cart = req.db.model("Cart");
        
        const res_data = await Cart.findByIdAndDelete(cartId);
        
        if (!res_data) {
            manualLog("cart not found")
            return res.status(404).send({
                message: "cart not found",
                success: false
            });
        }
        
        manualLog("cart deleted successfully",res_data)
        res.status(200).send({
            message: "cart deleted successfully",
            success: true,
            cart: res_data
        })
    } catch(error) {
        manualLog("something broke in delete cart", error)
        console.log(error, "something broke in the delete cart");
        res.status(500).send({message: "something went wrong", error});
    }
})

module.exports = router