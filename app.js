require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectdb = require("./Model/connectdb");
const express = require("express");
const http = require("http");
const app = express();
const router = require("./routes/agronomeRoute");
const agriculturerRouter = require("./routes/agriculteurRoute");
const { Server } = require("socket.io");
// initialisong server with http module and not express because of socket.io
const server = http.createServer(app);

// creating the io server
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User Connected => " + socket.id);

  // socket.on("EVENT")

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(cors());
app.use(express.json());
// default option for file upload
app.use(fileUpload());
// routes

app.use("/agronome", router);
app.use("/agriculturer", agriculturerRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

connectdb.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
});
