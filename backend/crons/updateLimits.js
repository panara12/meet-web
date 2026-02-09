const cron = require("node-cron");
const mongoose = require("mongoose");
const manualLog = require("../utils/manuallogger");

module.exports = (mainConnection) => {
  cron.schedule("0 0 1 * *", async () => {
    manualLog("Starting monthly limits reset for ALL databases");

    try {
      const adminDb = mainConnection.db.admin();

      // Get all database names
      const { databases } = await adminDb.listDatabases();

      for (const dbInfo of databases) {
        const dbName = dbInfo.name;

        // Skip system DBs
        if (["admin", "local", "config","user_master"].includes(dbName)) continue;

        manualLog(`Resetting limits for: ${dbName}`);

        const tenantDb = mainConnection.useDb(dbName);

        const Limits = tenantDb.model(
          "Limits",
          new mongoose.Schema({}, { strict: false }),
          "limits"
        );

        const res = await Limits.updateMany({}, 
            [{
                $set: {
                    liveLocationlimit: "$totalLiveLocationlimit",
                    routeLocationlimit: "$totalRouteLocationlimit"
                }
            }]
        );
      }

      manualLog(`Monthly reset completed for all tenants`);

    } catch (err) {
      manualLog("Global reset failed", err);
    }
  });
};
