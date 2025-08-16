const Store_location = async (req, user_id,tenent_name) => {
  try {
    const Location = req.db.model("Location");

    const { lat, lng, location_name, accuracy } = req.body;

    // Basic validation
    if (lat == null || lng == null) {
      throw new Error("Latitude and longitude are required");
    }

    const userLocationData = await Location.create({
      user_id, // Must match schema field name
      tenent_name, // Fixed spelling
      lat,
      lng,
      location_name: location_name,
      accuracy
    });

    return userLocationData;

  } catch (error) {
    console.error("Error storing location:", error.message);
    return false;
    //throw error; // Or return { error: error.message } if you prefer
  }
};

module.exports = Store_location;
