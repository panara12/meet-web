const mongoose = require("mongoose");
const env = require("dotenv").config();

const connectionCache ={};

const gettenentDb = async (dbName)=>{
    //if the connection is in cache
    // console.log("----- DB Cache Tenants -----");
    // Object.keys(connectionCache).forEach((tenantKey) => {
    //     console.log(`✅ Cached tenant: ${tenantKey}`);
    // });

    console.log('enterd in gettenetdbname code ',dbName)

    //db already have connection active than use it
    if (connectionCache[dbName]) {
            console.log("✅ Using cached DB connection:", dbName);
            return connectionCache[dbName];
    }

    //get new connection for each tenent 
    const mongoose_uri =  process.env.DYNAMIC_MONGOOSE_URL_FIRST+dbName+process.env.DYNAMIC_MONGOOSE_URL_LAST;

    // console.log("modanna"+mongoose_uri);
    try {
        const conn = await mongoose.createConnection(mongoose_uri);

        //getting assecc for all the models used in connection
        conn.model('Distributer',require('./models/distributer_model'));
        conn.model('Order',require('./models/order_model'));
        conn.model('Salesman',require('./models/salesman_model'));
        conn.model('Product',require('./models/product_model'));
        conn.model('Seller',require('./models/seller_model'));
        conn.model('Company',require('./models/company_model'));
        conn.model('Location',require('./models/location_model'));
        conn.model('Tenent_user_master',require('./models/tenent_user_model'));
        connectionCache[dbName] = conn;
        return conn;

    } catch (error) {
        console.error(`Error connecting to tenent DB "${dbName}":`, error.message);
    }
    
}

module.exports = gettenentDb