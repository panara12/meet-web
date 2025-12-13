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
    const mongoose_uri =  process.env.MONGODB_URL+dbName;

    // console.log("modanna"+mongoose_uri);
    try {
        const conn = await mongoose.createConnection(mongoose_uri);
        // console.log(conn);

        //getting assecc for all the models used in connection
        conn.model('Distributer',require('./models/distributer_model'));
        conn.model('Order',require('./models/order_model'));
        conn.model('User',require('./models/user_model'));
        conn.model('Product',require('./models/product_model'));
        conn.model('Seller',require('./models/seller_model'));
        conn.model('Company',require('./models/company_model'));
        conn.model('Location',require('./models/location_model'));
        conn.model('ProductCategory',require('./models/product_category_model'));
        conn.model('Payment',require('./models/payment_model'));
        conn.model('Salesman_notes',require('./models/salesman_notes'));
        connectionCache[dbName] = conn;
        return conn;

    } catch (error) {
        console.error(`Error connecting to tenent DB "${dbName}":`, error.message);
    }
    
}

module.exports = gettenentDb