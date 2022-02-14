//* EXPRESS APP SETUP
const express = require("express");
const { connectDB } = require("./server/util/connect");
const cloudinary = require('cloudinary').v2
require("dotenv").config();

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;

//* NEXT APP SETUP
//! imports tools from the next library
const next = require("next");
//! find out if this is a dev or production build
const dev = process.env.NODE_ENV !== "production";
//! creates a project with dev error templates
const nextApp = next({ dev });
//! import req handlers for the server
const handler = nextApp.getRequestHandler();

//* MIDDLEWARES
const fileUpload = require('express-fileupload')

app.use(express.json());
app.use(fileUpload({useTempFiles: true}))

//*ROUTERS
const userRoutes = require('./server/routes/userRoutes')
const authRoutes = require('./server/routes/authRoutes')
const uploadRoutes = require('./server/routes/uploadRoutes')
const searchRoutes = require('./server/routes/search')

//? alternative way to route if you prefer
// app.use("/api/v1/user", require('./server/routes/userRoutes'));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/search", searchRoutes);

connectDB();

nextApp.prepare().then(() => {
  app.all("*", (req, res) => handler(req, res));
  app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server listening @ ${PORT}`);
  });
});