const mongoose = require('mongoose');
const express = require('express');
const env = require("dotenv").config();
const distributer = require('./routes/distributer');
const app = express();
const cors = require('cors');
const tenent_middleware = require('./middleware/tenent_middleware');
const getTenentList = require('./utils/tenentgeter');
const seller = require('./routes/seller');
const product = require('./routes/product')
const auth = require('./routes/auth');
const user_routes = require('./routes/user_routes');
const tenent = require('./routes/tenent');
const tenentCache = require('./cache/tenent_list');
const errorHandler = require('./utils/errorHandler'); // adjust path accordingly
const manualLog = require('./utils/manuallogger'); 
const company = require('./routes/company')
const sessionLoader = require('./utils/sessionlodder');
const Location = require('./routes/location');
const email = require('./routes/email');

const allowedOrigins = [
  "http://localhost:5173","*"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
// Body parser for JSON
app.use(express.json());
// If you're sending form-data (urlencoded)
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGODB_URL+'user_master')
.then(async ()=>{
    console.log('db connected');
    //get all  the tenents list on server starts
    const tenent_list = await getTenentList();
    tenentCache.tenent = tenent_list;
    console.log(tenentCache);
    manualLog('db is connected broooo');
})
.catch(()=>{
    console.log('db not connected');
    manualLog('db is connected broooo');
})

manualLog('session is ready to go');

app.use(sessionLoader); 

app.use('/tenent',tenent);
app.use("/company",tenent_middleware,company);
app.use('/auth',auth);
app.use('/distributer',tenent_middleware,distributer);
app.use('/seller',tenent_middleware,seller)
app.use('/user',tenent_middleware,user_routes)
app.use('/product',tenent_middleware,product);
app.use('/location',tenent_middleware,Location);
app.use('/email', email);

app.get('/error', (req, res, next) => {
  // This will throw an error and be caught by your error handler
  throw new Error('Test error for logging!');
});

// Your routes go above this
app.use(errorHandler); 



app.get('/',(req,res)=>{
    res.send('running')
})

app.listen(process.env.PORT,()=>{
    console.log('server is running');
})
