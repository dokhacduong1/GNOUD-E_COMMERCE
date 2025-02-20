import express from "express";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes_client from "./routes/clients/index.routes";
import routes_admin from "./routes/admins/index.routes";
import methodOverride from "method-override";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes_images from "./routes/images/index.routes";
import { updateCategoriesData } from "./helpers/categories.helpers";
import routesClientVersion1 from "./api/v1/routes_api/client/index_api.routes";
import { getWebOptions } from "./helpers/webOptions";
import routesProxyVersion1 from "./api/v1/routes_api/proxys/index.routes";
import  passport from  "./middlewares/clients/login.middleares"
const app = express();
///auth/userinfo.email
///auth/userinfo.profile
dotenv.config();
app.use(
  express.static(`${__dirname}/public`, {
    maxAge: 86400000,
    etag: false,
  })
);
app.use(
  cors({
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
   
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
//Cấu hình để hiển thị thông báo (Flash)
app.use(cookieParser("FJFDSIOSDFIPDSF"));
app.use(session({ secret: process.env.SECRET_KEY_SESSION, cookie: { maxAge: 60000 } }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//Cấu hình phương thức gửi đi của form
app.use(methodOverride("_method"));
// app.use((req, res, next) => {
//    console.log("ok")
//     next();
// });


app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


routes_client(app);
routes_admin(app);
routes_images(app);
routesClientVersion1(app);
routesProxyVersion1(app);
https
  .createServer(
    {
      key: fs.readFileSync("testcookie.com+2-key.pem"),
      cert: fs.readFileSync("testcookie.com+2.pem"),
    },
    app
  )
  .listen(3000, async function () {
    app.locals.dataCategories = await updateCategoriesData();
    app.locals.webOptions = await getWebOptions();

    // app.locals.dataCategories = {
    //   dataCategorieClothes: [],
    //   dataCategorieHouseholdGoods: [],
    //   categoryAll:[],
    // }

    console.log(
      "Example app listening on port 3000! Go to https://localhost:3000/"
    );
  });

// app
//     .listen(3000, async function () {
//         app.locals.dataCategories = await updateCategoriesData();
//         app.locals.webOptions = await getWebOptions();
//
//         // app.locals.dataCategories = {
//         //   dataCategorieClothes: [],
//         //   dataCategorieHouseholdGoods: [],
//         //   categoryAll:[],
//         // }
//
//         console.log(
//             "Example app listening on port 3000! Go to http://localhost:3000/"
//         );
//     });