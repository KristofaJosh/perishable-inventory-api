require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
const cors = require("cors");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const port = process.env.PORT || 8000;
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker: { process: { pid: any } }, code: any, signal: any) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  app.get("/", (req, res, next) => {
    res.send("hello");
  });

  // route versions entry
  app.use("/api/v1", require("./routes"));

  db.authenticate()
    .then(() => console.log("DB Connected"))
    .catch((err: any) => console.log(`DB Connect error: ${err}`));
  
  db.sync().then(() => {console.log("DBs Created!")})

  app.listen(port, () => console.log(`Server Started @ Port ${port}`));
}
