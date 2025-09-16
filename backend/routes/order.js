const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();

// Add new order
router.post('/addorder', user_session_checker("add_order"), async (req, res) => {
    manualLog("entered in add order method");
    try {
        const { 
            order_id, 
            order_seller, 
            order_date, 
            order_items, 
            order_cartoons, 
            order_total_amount, 
            order_status, 
            order_firm 
        } = req.body;
        
        const Order = req.db.model("Order");
        const new_order = await Order.create({
            order_id,
            order_seller,
            order_date,
            order_salesman: req.session.user.user_id,
            order_items,
            order_cartoons,
            order_total_amount,
            order_status,
            order_firm
        });
        manualLog("order added successfully");
        res.status(200).send({
            message: "order added successfully",
            success: true,
            order: new_order
        });
    } catch (error) {
        manualLog("something broke in order add", error);
        console.log(error, "something broke in the add order");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Update order
router.put('/updateorder/:id', user_session_checker("update_order"), async (req, res) => {
    manualLog("entered in update order method");
    try {
        const { 
            order_id, 
            order_seller, 
            order_date, 
            order_items, 
            order_cartoons, 
            order_total_amount, 
            order_status, 
            order_firm 
        } = req.body;
        
        const Order = req.db.model("Order");
        const updated_order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                order_id,
                order_seller,
                order_date,
                order_items,
                order_cartoons,
                order_total_amount,
                order_status,
                order_firm
            },
            { new: true }
        );
        if (!updated_order) {
            return res.status(404).send({
                message: "order not found",
                success: false
            });
        }
        manualLog("order updated successfully");
        res.status(200).send({
            message: "order updated successfully",
            success: true,
            order: updated_order
        });
    } catch (error) {
        manualLog("something broke in order update", error);
        console.log(error, "something broke in the update order");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Delete order
router.delete('/deleteorder/:id', user_session_checker("delete_order"), async (req, res) => {
    manualLog("entered in delete order method");
    try {
        const Order = req.db.model("Order");
        const deleted_order = await Order.findByIdAndDelete(req.params.id);
        if (!deleted_order) {
            return res.status(404).send({
                message: "order not found",
                success: false
            });
        }
        manualLog("order deleted successfully");
        res.status(200).send({
            message: "order deleted successfully",
            success: true,
            order: deleted_order
        });
    } catch (error) {
        manualLog("something broke in order delete", error);
        console.log(error, "something broke in the delete order");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get order by ID
router.get('/getorder/:id', user_session_checker("get_order"), async (req, res) => {
    manualLog("entered in get order by id method");
    try {
        const Order = req.db.model("Order");
        const order = await Order.findById(req.params.id)
            .populate('order_seller')
            .populate('order_salesman')
            .populate('order_items.product_details');
        if (!order) {
            return res.status(404).send({
                message: "order not found",
                success: false
            });
        }
        manualLog("order retrieved successfully");
        res.status(200).send({
            message: "order retrieved successfully",
            success: true,
            order: order
        });
    } catch (error) {
        manualLog("something broke in get order by id", error);
        console.log(error, "something broke in the get order by id");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get all orders
router.get('/getallorders', user_session_checker("get_all_orders"), async (req, res) => {
    manualLog("entered in get all orders method");
    try {
        const Order = req.db.model("Order");
        const orders = await Order.find()
            .populate('order_seller')
            .populate('order_salesman')
            .populate('order_items.product_details')
            .sort({ createdAt: -1 });
        manualLog("all orders retrieved successfully");
        res.status(200).send({
            message: "all orders retrieved successfully",
            success: true,
            orders: orders,
            count: orders.length
        });
    } catch (error) {
        manualLog("something broke in get all orders", error);
        console.log(error, "something broke in the get all orders");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get orders by salesman (current user)
router.get('/getmyorders', user_session_checker("get_my_orders"), async (req, res) => {
    manualLog("entered in get my orders method");
    try {
        const Order = req.db.model("Order");
        const orders = await Order.find({ order_salesman: req.session.user.user_id })
            .populate('order_seller')
            .populate('order_salesman')
            .populate('order_items.product_details')
            .sort({ createdAt: -1 });
        manualLog("salesman orders retrieved successfully");
        res.status(200).send({
            message: "salesman orders retrieved successfully",
            success: true,
            orders: orders,
            count: orders.length
        });
    } catch (error) {
        manualLog("something broke in get my orders", error);
        console.log(error, "something broke in the get my orders");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get orders by status
router.get('/getordersbystatus/:status', user_session_checker("get_orders_by_status"), async (req, res) => {
    manualLog("entered in get orders by status method");
    try {
        const Order = req.db.model("Order");
        const orders = await Order.find({ order_status: req.params.status })
            .populate('order_seller')
            .populate('order_salesman')
            .populate('order_items.product_details')
            .sort({ createdAt: -1 });
        manualLog("orders by status retrieved successfully");
        res.status(200).send({
            message: "orders by status retrieved successfully",
            success: true,
            orders: orders,
            count: orders.length,
            status: req.params.status
        });
    } catch (error) {
        manualLog("something broke in get orders by status", error);
        console.log(error, "something broke in the get orders by status");
        res.status(500).send({ message: "something went wrong", error });
    }
});

module.exports = router;