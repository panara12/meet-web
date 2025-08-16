const cloudinary = require('./cloudinary');
const manualLog = require('./manuallogger');

const cloudinary_delete = async (public_ids = []) => {
  try {
    if (!Array.isArray(public_ids) || public_ids.length === 0) return;

    const deletePromises = public_ids.map(id => cloudinary.uploader.destroy(id));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (err) {
    manualLog("Error deleting images from Cloudinary:", err);
    throw err;
  }
};

module.exports = cloudinary_delete;
