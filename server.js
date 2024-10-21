const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const { errorHandler } = require('./server/middleware/errorHandler');
const db = require("./server/db/db");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(errorHandler);

db.getInstace();

// Cargar certificado y clave privada
const privateKey = fs.readFileSync("./private.key");
const certificate = fs.readFileSync("./certificate.crt");

// Crear servidor HTTPS
const httpsServer = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});