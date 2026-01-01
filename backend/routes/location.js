const express = require('express');
const router = express.Router();
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');

// ADD LOCATION ENTRY
router.post(
  '/locationEntry',
  user_session_checker('add_location'),
  async (req, res) => {
    try {
      const userId = req.session.user.tenant_user_id;
      const tenantName = req.session.user.tenant;

      const { latitude, longitude } = req.body;

      if (latitude == null || longitude == null) {
        return res.status(400).json({
          message: 'Latitude and longitude are required'
        });
      }

      const Location = req.db.model('Location');

      const location = await Location.create(
        {
          userId,
          tenantName,
          coordinates: {
            type: 'Point',
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude)
            ]
          }
        }
      );

      manualLog(`Location updated for user :: ${userId}`);
      res.status(200).json({
        message: 'Location updated successfully',
        location
      });
    } catch (error) {
      console.log('Error in location entry', error);
      manualLog(`Error in location entry :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Failed to store location',
        error: error.message
      });
    }
  }
);


// GET USER LOCATION HISTORY
router.get(
  '/locationHistory/:userId',
  user_session_checker('view_location'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const Location = req.db.model('Location');

      const locations = await Location.find({
        userId,
        isDeleted: false
      })
        .sort({ createdAt: -1 })
        .limit(50);

      res.status(200).json({
        message: 'Location history retrieved',
        locations
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch location history',
        error: error.message
      });
    }
  }
);


// GET LATEST LOCATION
router.get(
  '/latestLocation/:id',
  user_session_checker('view_location'),
  async (req, res) => {
    manualLog('Entered get latest location route');
    try {
      const { id } = req.params;
      const Location = req.db.model('Location');

      const location = await Location.findOne({
        userId:id,
        isDeleted: false
      }).sort({ updatedAt: -1 });

      if (!location) {
        return res.status(404).json({
          message: 'No location found for this user'
        });
      }

      res.status(200).json({
        message: 'Latest location retrieved',
        location
      });
    } catch (error) {
      console.log('Error fetching latest location', error);
      res.status(500).json({
        message: 'Failed to fetch location',
        error: error.message
      });
    }
  }
);


// GET LOCATIONS BY TENANT
router.get(
  '/locationsByTenant',
  user_session_checker('view_location'),
  async (req, res) => {
    try {
      const tenantName = req.session.user.tenant;
      const Location = req.db.model('Location');

      const locations = await Location.find({
        tenantName,
        isDeleted: false
      }).sort({ updatedAt: -1 });

      res.status(200).json({
        message: 'Tenant locations retrieved',
        locations
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch locations',
        error: error.message
      });
    }
  }
);


module.exports = router;