const mongoose = require('mongoose');
const express = require('express');
const env = require("dotenv").config();
const distributer = require('./routes/distributer');
const app = express();
const cors = require('cors');
const tenent_middleware = require('./middleware/tenent_middleware');
const seller = require('./routes/seller');
const auth = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const salesman = require('./routes/salesman');
const tenent = require('./routes/tenent');

app.use(cors())
// Body parser for JSON
app.use(express.json());
// If you're sending form-data (urlencoded)
app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('db connected');
})
.catch(()=>{
    console.log('db not connected');
})

//settings up the session
app.use(session({
    secret:"iamajavascriptLover",
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        //this used because we don't have to make the second connection request
        client:mongoose.connection.getClient(),
        collectionName:"user_sessions",
        ttl: 60 * 2,
        autoRemove: 'native',
        touchAfter: 60
    }),
    cookie:{
        maxAge:1000*60*2, //2 mins
        httpOnly:true,
        secure:false
    }
}))

app.get('/',(req,res)=>{
    res.send('running')
})

app.listen(process.env.PORT,()=>{
    console.log('server is running');
})

app.use('/tenent',tenent);

app.use('/auth',tenent_middleware,auth);
app.use('/distributer',tenent_middleware,distributer);
app.use('/seller',tenent_middleware,seller)
app.use('/salesman',tenent_middleware,salesman)
