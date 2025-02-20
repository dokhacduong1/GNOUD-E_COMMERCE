
import { Express } from "express";
import {homeRoutes} from "./home.routes"
import { productRoutes } from "./product.routes";
import { categoryRoutes } from "./category.routes";
import { searchProductRoutes } from "./search_product.routes";
import { cartRoutes } from "./cart.routes";
import {checkoutRoutes} from "./checkout.routes";
import {registrationRoutes} from "./registration.routes";
import {loginRoutes} from "./login.routes";
import *  as middlewareAuthen from "../../middlewares/clients/authen.middlewares";
import * as middlewareCart from "../../middlewares/clients/session_cart.middlewares";
import {myPageRoutes} from "./my_page.routes";
import {logoutRoutes} from "./logout.routes";
import {orderRoutes} from "./order.routes";
const routes_client = (app: Express): void => {
    app.use(middlewareCart.session_cart);
    app.use("/", homeRoutes);
    app.use("/product", productRoutes);
    app.use("/category", categoryRoutes);
    app.use("/search", searchProductRoutes);
    app.use("/cart", cartRoutes);
    app.use("/order",orderRoutes)
    app.use("/checkout", checkoutRoutes);
    app.use("/registration",middlewareAuthen.authenMiddlewares,registrationRoutes)
    app.use("/login",middlewareAuthen.authenMiddlewares,loginRoutes)
    app.use("/logout",logoutRoutes)
    app.use('/my_page',myPageRoutes)
}
export default routes_client