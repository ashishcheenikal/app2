const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const path = require("path");
const socket = require("socket.io");
const { disconnect } = require("process");

const corsOptions = {
  origin: `${process.env.RESET_URL}`,
  successStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", userRouter);
app.use("/admin", adminRouter);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then((data) => console.log("DataBase Connection established"))
  .catch((error) =>
    console.log("Error in DataBase Connection establishing : ", error)
  );

let port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log("listening on port " + port);
});

const io = socket(server, {
  cors: {
    origin:  `${process.env.RESET_URL}`,
  },
});

io.on("connection", (socket) => {
  console.log(`user joined server ${socket.id}`,);
  socket.on("join_room",(data)=>{
    console.log(data)
    const {slug, userID} = data
    socket.join(slug)
    let createdTime =new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes();
    let welcomeMessage = {
      message: `${userID} has joined the chat room`,
      username: `${userID}`,
      createdTime
    }
    socket.to(slug).emit('receive_message', welcomeMessage);
  })
  socket.on("disconnect",()=>[
    console.log("disconnected")
  ])
});
