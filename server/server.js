const express=require('express');
const mongoose=require('mongoose')
require('dotenv').config();
const cookieparser=require('cookie-parser')
const cors=require('cors')
const authrouter= require('./routes/auth/auth-routes')
const adminProductsRouter=require('./routes/admin/products-routes')
const petRouter = require('./routes/allpets')
const shelterAdminRouter = require('./routes/shelterAdmin')
const userRouter = require('./routes/user.routes')
const shopProductsRouter=require('./routes/shop/prdoucts-routes')
const shopcartRouter=require("./routes/shop/cart-routes")
const shopAddressRouter= require("./routes/shop/address-routes")
const shopOrderRouter= require("./routes/shop/order-routes")
//require('dotenv').config();
// create database || create a separate file also and import it than
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("MongoDB connected")
})
.catch((error)=>{
    console.log(error)
})


const app=express();
const PORT=process.env.PORT||5000;

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods:['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true
    })
)

app.use(cookieparser());
app.use(express.json());
app.use("/api/auth",authrouter);
app.use("/api/admin/products",adminProductsRouter);
app.use("/api/shelterAdmin" , shelterAdminRouter);
app.use("/api/pets" , petRouter);
app.use("/api/user" , userRouter);
app.use("/api/shop/products",shopProductsRouter)
app.use("/api/shop/cart",shopcartRouter)
app.use("/api/shop/address",shopAddressRouter)
app.use("/api/shop/order",shopOrderRouter)
app.listen(PORT,()=>{
    console.log(`Server is now running on port ${PORT}`)
})