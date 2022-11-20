const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const userRouter= require("./routes/users") 
const adminRouter= require("./routes/admin") 

const corsOptions = {
  origin: "http://localhost:3000",
  successStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/',userRouter)
app.use('/admin',adminRouter) 

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then((data) => console.log("DataBase connection established"))
  .catch((error)=>console.log("Error in DataBase onnection establishing : " ,error))

  let port = process.env.PORT || 8080;

  app.listen(port,()=>{
    console.log('listening on port ' + port);
  })