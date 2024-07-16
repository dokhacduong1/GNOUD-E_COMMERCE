import express from "express";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes_client from "./routes/clients/index.routes";
import routes_admin from "./routes/admins/index.routes";
import methodOverride from "method-override";
import flash from "express-flash";
import session from "express-session"
import cookieParser from "cookie-parser";
import cors from "cors";
import routes_images from "./routes/images/index.routes";
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
//Cấu hình để hiển thị thông báo (Flash)
app.use(cookieParser('FJFDSIOSDFIPDSF'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//Cấu hình phương thức gửi đi của form
app.use(methodOverride('_method'));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
dotenv.config();

routes_client(app);
routes_admin(app);
routes_images(app);
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
