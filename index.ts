require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
const cors = require("cors");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const port = process.env.PORT || 8000;
const db = require("./config/db");
const cronSchedule = require("node-schedule");
const itemController = require("./controllers/itemController");

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

  cluster.on("exit", (worker: { process: { pid: any } }) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });

  db.authenticate()
    .then(() => console.log("DB Connected"))
    .catch((err: any) => console.log(`DB Connect error: ${err}`));

  db.sync()
    .then(() => {
      console.log("DBs Created!");
    })
    .catch((err: any) => console.log(`DB Creation error: ${err}`));

  // runs every saturday mid-night -- assumes our analytics says we have low traffic on saturdays
  cronSchedule.scheduleJob("remove-expired", "0 0 * * Sat", function () {
    itemController
      .removeExpired()
      .then((res: string) => {
        cronSchedule.cancelJob("remove-expired");
        console.log(res, " --cron");
      })
      .catch(() => cronSchedule.cancelJob("remove-expired"));
  });
} else {
  app.get("/api/v1", (req, res) => {
    res.send("<h1>Perishable Inventory Pings 'Hello'</h1>");
  });

  // route versions entry
  app.use("/api/v1", require("./routes"));
  // route versions end
  
  app.listen(port, () => console.log(`Server Started @ Port ${port}`));
}
