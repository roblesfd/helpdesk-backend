require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/usuarios", require("./routes/userRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/notificaciones", require("./routes/notificationRoutes"));
app.use("/comentarios", require("./routes/commentRoutes"));
app.use("/articulos", require("./routes/articleRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/categorias", require("./routes/categoryRoutes"));
app.use("/tags", require("./routes/tagRoutes"));

// Manejo de 404
app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Página no encontrada" });
  } else {
    res.type("txt".send("404 Página no encontrada"));
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Conectado a MongoDB");
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
