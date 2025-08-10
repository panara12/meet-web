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
const session_setter = require('./middleware/session_middleware');
const salesman = require('./routes/salesman');
const tenent = require('./routes/tenent');
const tenentCache = require('./cache/tenent_list');
const errorHandler = require('./utils/errorHandler'); // adjust path accordingly
const manualLog = require('./utils/manuallogger'); 


app.use(cors())
// Body parser for JSON
app.use(express.json());
// If you're sending form-data (urlencoded)
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGODB_URL)
.then(async ()=>{
    console.log('db connected');
    //get all  the tenents list on server starts
    const tenent_list = await getTenentList();
    tenentCache.tenent = tenent_list;
    manualLog('db is connected broooo');
})
.catch(()=>{
    console.log('db not connected');
    manualLog('db is connected broooo');
})

manualLog('session is ready to go');

app.use(session_setter)

app.use('/tenent',tenent);

app.use('/auth',tenent_middleware,auth);
app.use('/distributer',tenent_middleware,distributer);
app.use('/seller',tenent_middleware,seller)
app.use('/salesman',tenent_middleware,salesman)
app.use('/product',tenent_middleware,product);

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
