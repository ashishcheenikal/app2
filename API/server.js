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
const Message = require("./models/Message");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

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
    origin: `${process.env.RESET_URL}`,
  },
});

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  // io.listen(5000);
});

pubClient.on("error", (err) => {
  console.log(err.message);
});

subClient.on("error", (err) => {
  console.log(err.message);
});

io.on("connection", (socket) => {
  console.log(`user joined server ${socket.id}`);
  socket.on("join_room", (data) => {
    console.log(data);
    const { slug, userID, userName } = data;
    socket.join(slug);
    console.log(`${socket.id} joined the ${slug}`);
    const joinData = {
      room: slug,
      author: userID,
      authorName: userName,
      message: `${userName} has joined the chat room`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(slug).emit("join_message", joinData);
  });

  socket.on("send_message", (data) => {
    console.log(data, "send_message");
    const savingMessage = async () => {
      try {
        await Message.create({
          roomId: data.room,
          sender: data.author,
          message: data.message,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    savingMessage();
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => [console.log("disconnected")]);
});
