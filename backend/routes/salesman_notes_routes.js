const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const { default: mongoose } = require('mongoose');
const router = express.Router();

// Add new note
router.post('/addnotes', user_session_checker("add_notes"), async (req, res) => {
    manualLog("entered in add notes method");
    try {
        const { type, title, content, color, priority } = req.body;
        const Note = req.db.model("Salesman_notes");
        const new_note = await Note.create({
            salesman_id:req.session.user.tenant_user_id,
            type,
            title,
            content,
            color,
            priority
        });
        manualLog("note added successfully");
        res.status(200).send({
            message: "note added successfully",
            success: true,
            note: new_note
        });
    } catch (error) {
        manualLog("something broke in note add", error);
        console.log(error, "something broke in the add note");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Update note
router.post('/updatenotes/:id', user_session_checker("update_notes"), async (req, res) => {
    manualLog("entered in update notes method");
    console.log(req.body)
    try {
        const Note = req.db.model("Salesman_notes");
        const updated_note = await Note.findByIdAndUpdate(
            _id=req.params.id,
            {$set:req.body},
            { new: true }
        );
        if (!updated_note) {
            return res.status(404).send({
                message: "note not found",
                success: false
            });
        }
        manualLog("note updated successfully");
        res.status(200).send({
            message: "note updated successfully",
            success: true,
            note: updated_note
        });
    } catch (error) {
        manualLog("something broke in note update", error);
        console.log(error, "something broke in the update note");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Delete note
router.delete('/deletenotes/:id', user_session_checker("delete_notes"), async (req, res) => {
    manualLog("entered in delete notes method");
    try {
        const Note = req.db.model("Salesman_notes");
        const deleted_note = await Note.findByIdAndDelete(req.params.id);
        if (!deleted_note) {
            return res.status(404).send({
                message: "note not found",
                success: false
            });
        }
        manualLog("note deleted successfully");
        res.status(200).send({
            message: "note deleted successfully",
            success: true,
            note: deleted_note
        });
    } catch (error) {
        manualLog("something broke in note delete", error);
        console.log(error, "something broke in the delete note");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get note by ID
router.get('/getnotes/:id', user_session_checker("get_notes"), async (req, res) => {
    manualLog("entered in get note by id method");
    try {
        const Note = req.db.model("Salesman_notes");
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send({
                message: "note not found",
                success: false
            });
        }
        manualLog("note retrieved successfully");
        res.status(200).send({
            message: "note retrieved successfully",
            success: true,
            note: note
        });
    } catch (error) {
        manualLog("something broke in get note by id", error);
        console.log(error, "something broke in the get note by id");
        res.status(500).send({ message: "something went wrong", error });
    }
});

// Get all notes
router.get('/getallnotes', user_session_checker("get_all_notes"), async (req, res) => {
    manualLog("entered in get all notes method");
    try {
        const Note = req.db.model("Salesman_notes");
        const notes = await Note.find({salesman_id:req.session.user.tenant_user_id}).sort({ createdAt: -1 });
        manualLog("all notes retrieved successfully",notes);
        
        // ✅ SIMPLE WAY: Calculate current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endOfMonth.setHours(0, 0, 0, 0);
        
        console.log("📅 Current Month Range:");
        console.log("  Start:", startOfMonth);
        console.log("  End:", endOfMonth);
        console.log("👤 Salesman ID:", req.session.user.tenant_user_id);
        
        const Order = req.db.model("Order");
        
        // ✅ SIMPLE WAY: Just find all orders for this month
        const ordersThisMonth = await Order.find({
            order_salesman: req.session.user.tenant_user_id,
            createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        });
        
        console.log("📦 Found orders:", ordersThisMonth);
        
        // ✅ Calculate totals manually
        let totalAmount = 0;
        ordersThisMonth.forEach(order => {
            if (order.totalAmount && !isNaN(order.totalAmount)) {
                totalAmount += Number(order.totalAmount);
            }
        });
        
        const totals = {
            orderCount: ordersThisMonth.length,
            totalAmount: totalAmount
        };
        
        console.log("📊 Totals:", totals);

        res.status(200).send({
            message: "all notes retrieved successfully",
            success: true,
            notes: notes,
            count: notes.length,
            totals: totals
        });
    } catch (error) {
        manualLog("something broke in get all notes", error);
        console.log(error, "something broke in the get all notes");
        res.status(500).send({ message: "something went wrong", error: error.message });
    }
});

module.exports = router;