import express from "express";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes_client from "./routes/clients/index.routes";
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
dotenv.config();

routes_client(app);
https
  .createServer(
    {
      key: fs.readFileSync("testcookie.com+2-key.pem"),
      cert: fs.readFileSync("testcookie.com+2.pem"),
    },
    app
  )
  .listen(3000, function () {
    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });
