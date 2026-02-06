const express = require('express');
const router = express.Router();
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');

// ADD LOCATION ENTRY
router.post(
  '/locationEntry',
  user_session_checker('add_location'),
  async (req, res) => {
    manualLog('entered in location route')
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

      manualLog(`Location updated for user :: ${location}`);
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
    manualLog("entered in location history route")
    try {
      const { userId } = req.params;
      const Location = req.db.model('Location');

      const locations = await Location.find({
        userId,
        isDeleted: false
      })
        .sort({ createdAt: -1 })
        .limit(50);
      manualLog("location history fethced successfully",locations)
      res.status(200).json({
        message: 'Location history retrieved',
        locations
      });
    } catch (error) {
      manualLog("error in location history route",error)
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
      manualLog('location fetched',location)
      res.status(200).json({
        message: 'Latest location retrieved',
        location
      });
    } catch (error) {
      console.log('Error fetching latest location', error);
      manualLog('error in latest location route',error)
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
    manualLog('Entered get locations by tenant route');
    try {
      const tenantName = req.session.user.tenant;
      const Location = req.db.model('Location');

      const locations = await Location.find({
        tenantName,
        isDeleted: false
      }).sort({ updatedAt: -1 });
      manualLog('location by tenant fetched successfully',locations)
      res.status(200).json({
        message: 'Tenant locations retrieved',
        locations
      });
    } catch (error) {
      manualLog('error in locations by tenant route',error)
      res.status(500).json({
        message: 'Failed to fetch locations',
        error: error.message
      });
    }
  }
);

router.post('/pathPoints', user_session_checker('view_location'), async (req, res) => {
  manualLog('Entered path points route');
  try {
    const { userId, date } = req.body;
    const Location = req.db.model('Location');
    
    // Parse dd/mm/yyyy format
    const [day, month, year] = date.split('/').map(Number);
    
    // Create start date (00:00:00.000 UTC)
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    console.log('Requested date for path points:', start);
    
    // Create end date (23:59:59.999 UTC)
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    console.log('End date for path points:', end);

    const locations = await Location.find({
      userId:userId,
      createdAt: { $gte: start, $lte: end },
      isDeleted: false
    }).sort({ createdAt: 1 });
    
    console.log(`Fetched ${locations.length} location points for user ${userId} on date ${date}`);
    manualLog("pathpoints getted",locations)
    res.status(200).json({
      message: 'Path points retrieved',
      locations
    });
  } catch (error) {
    console.log('Error fetching path points', error);
    manualLog("errror in fetch path poinst",error)
    res.status(500).json({
      message: 'Failed to fetch path points',
      error: error.message
    });
  }
});

module.exports = router;