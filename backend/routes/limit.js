const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();


router.get('/getlimits', user_session_checker("get_limits"), async (req, res) => {
    manualLog('entered in get limits route');
    try {
        const Limits = req.db.model('Limits');
        const limits = await Limits.find();
        manualLog("fetched calls",limits)
        res.status(200).send({ success: true, data: limits });
    } catch (error) {
        manualLog(`Error fetching limits: ${error}`);
        res.status(500).send({ success: false, message: 'Error fetching limits' });
    }
})

router.post('/updatelimits', user_session_checker("update_limits"), async (req, res) => {
    manualLog('entered in get limits route');
    try {
        const { id, updates } = req.body;
        console.log("Received limits update request:", { id, updates });
        const Limits = req.db.model('Limits');
        const updatedLimits = await Limits.findOneAndUpdate({ _id: id }, { $set: updates }, { new: true, upsert: true });
        manualLog("udpated limits",updatedLimits)
        res.status(200).send({ success: true, data: updatedLimits });
    } catch (error) {
        manualLog(`Error updating limits: ${error}`);
        res.status(500).send({ success: false, message: 'Error updating limits' });
    }
})

module.exports = router;