const express = require('express');
const router = express.Router();
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');

// ADD LOCATION ENTRY
router.post('/locationEntry', user_session_checker('add_location'), async (req, res) => {
  manualLog('Entered location entry route');
  try {
    const userId = req.session.user.user_id;
    const tenantName = req.session.user.tenant;

    // Validate incoming location data
    const { latitude, longitude, locationName, accuracy } = req.body;

    if (!latitude || !longitude || !locationName) {
      return res.status(400).json({
        message: 'Missing required fields: latitude, longitude, locationName'
      });
    }

    const Location = req.db.model('Location');

    // Create location entry
    const location_data = new Location({
      userId: userId,
      tenantName: tenantName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName: locationName,
      accuracy: accuracy ? parseFloat(accuracy) : 0
    });

    const savedLocation = await location_data.save();

    manualLog(`Location stored successfully for user :: ${userId}`);
    res.status(200).json({
      message: 'Location stored successfully',
      location: savedLocation
    });
  } catch (error) {
    console.log('Error in location entry', error);
    manualLog(`Error in location entry :: ${JSON.stringify(error)}`);
    res.status(500).json({
      message: 'Failed to store location',
      error: error.message
    });
  }
});

// GET USER LOCATION HISTORY
router.get('/locationHistory/:userId', user_session_checker('view_location'), async (req, res) => {
  manualLog('Entered get location history route');
  try {
    const { userId } = req.params;
    const Location = req.db.model('Location');

    const locations = await Location.find({
      userId: userId,
      isDeleted: false
    }).sort({ createdAt: -1 }).limit(50);

    if (!locations || locations.length === 0) {
      return res.status(200).json({
        message: 'No location history found',
        locations: []
      });
    }

    manualLog(`Location history fetched for user :: ${userId}`);
    res.status(200).json({
      message: 'Location history retrieved',
      locations
    });
  } catch (error) {
    console.log('Error fetching location history', error);
    manualLog(`Error in get location history :: ${JSON.stringify(error)}`);
    res.status(500).json({
      message: 'Failed to fetch location history',
      error: error.message
    });
  }
});

// GET LATEST LOCATION
router.get('/latestLocation/:userId', user_session_checker('view_location'), async (req, res) => {
  manualLog('Entered get latest location route');
  try {
    const { userId } = req.params;
    const Location = req.db.model('Location');

    const latest_location = await Location.findOne({
      userId: userId,
      isDeleted: false
    }).sort({ createdAt: -1 });

    if (!latest_location) {
      return res.status(404).json({
        message: 'No location found for this user'
      });
    }

    manualLog(`Latest location fetched for user :: ${userId}`);
    res.status(200).json({
      message: 'Latest location retrieved',
      location: latest_location
    });
  } catch (error) {
    console.log('Error fetching latest location', error);
    manualLog(`Error in get latest location :: ${JSON.stringify(error)}`);
    res.status(500).json({
      message: 'Failed to fetch location',
      error: error.message
    });
  }
});

// GET LOCATIONS BY TENANT
router.get('/locationsByTenant', user_session_checker('view_location'), async (req, res) => {
  manualLog('Entered get locations by tenant route');
  try {
    const tenantName = req.session.user.tenant;
    const Location = req.db.model('Location');

    const locations = await Location.find({
      tenantName: tenantName,
      isDeleted: false
    }).sort({ createdAt: -1 }).limit(100);

    if (!locations || locations.length === 0) {
      return res.status(200).json({
        message: 'No locations found for this tenant',
        locations: []
      });
    }

    manualLog(`Locations fetched for tenant :: ${tenantName}`);
    res.status(200).json({
      message: 'Tenant locations retrieved',
      locations
    });
  } catch (error) {
    console.log('Error fetching tenant locations', error);
    manualLog(`Error in get locations by tenant :: ${JSON.stringify(error)}`);
    res.status(500).json({
      message: 'Failed to fetch locations',
      error: error.message
    });
  }
});

module.exports = router;