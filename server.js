const express = require("express");
const cors = require("cors");
// const https = require("https");
// const fs = require("fs");
const { errorHandler } = require('./server/middleware/errorHandler');
const db = require("./server/helpers/db");
const verifyJwt = require('./server/middleware/authJwt'); 
const app = express();
const userRouter = require("./server/routes/userRouter");
const noteRouter = require("./server/routes/noteRouter");
const SessionService = require("./server/middleware/sessionConfig");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4173"], 
    credentials: true,
  })
);

app.use(express.json());
SessionService.initializeSession(app);

db.getInstace();

// Cargar certificado y clave privada para HTTPS
// const privateKey = fs.readFileSync("./private.key");
// const certificate = fs.readFileSync("./certificate.crt");

app.use("/users", userRouter);
app.use("/notes", verifyJwt, noteRouter); 

app.use(errorHandler);

// Crear servidor HTTPS
// const httpsServer = https.createServer(
//   {
//     key: privateKey,
//     cert: certificate,
//   },
//   app
// );

// const PORT = process.env.PORT || 5000;
// httpsServer.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});