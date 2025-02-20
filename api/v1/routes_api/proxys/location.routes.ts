import { Router, Response, Request } from "express";
import { ClientRequest } from 'http';
import {createProxyMiddleware, responseInterceptor} from 'http-proxy-middleware';
import * as validate from "../../validates_api/proxys/locations.validate";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();
const target = process.env.LOCATION_BASE_URL;

const proxyOptions = (pathRewrite: Record<string, string>) => ({
    target,
    changeOrigin: true,
    pathRewrite,
});
enum Location {
    city = '/wap/v2/master/regions/city',
    ward = '/wap/v2/master/regions/ward',
    autocomplete = '/wap/v2/master/autocomplete',
    detailAddress = '/wap/v2/master/detail-address'
}

router.get("/regions/city", createProxyMiddleware(proxyOptions({
    '^/regions/city': Location.city,
})));

router.get("/regions/ward", createProxyMiddleware(proxyOptions({
    '^/regions/ward': Location.ward,
})));

router.post("/autocomplete", createProxyMiddleware({
    ...proxyOptions({
        '^/autocomplete': Location.autocomplete,
    }),
    on: {
        proxyReq: (proxyReq : ClientRequest, req: Request, res: Response) => {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
}));

router.post("/detail-address",validate.detailAddress, createProxyMiddleware({
    ...proxyOptions({
        '^/detail-address': Location.detailAddress,
    }),
    on: {
        proxyReq: (proxyReq : ClientRequest, req: Request, res: Response) => {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
}));


router.get('/mapbox', (req: Request, res: Response, next) => {
    const mapPath = req.query.get_map?.toString();

    // Regular expression to validate the mapPath format
    const mapPathRegex = /^\/styles\/v1\/mapbox\/[a-zA-Z0-9-]+\/tiles\/\d+\/\d+\/\d+\?access_token=[a-zA-Z0-9._-]+$/;

    if (!mapPath || !mapPathRegex.test(mapPath)) {
        return res.status(400).json({ error: 'Invalid format' });
    }
    createProxyMiddleware({
        target: 'https://api.mapbox.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: () => mapPath,
        on: {
            proxyReq: (proxyReq, req) => {
                // Set Referer header to a fake source for all requests
                proxyReq.setHeader('Referer', 'https://jonnymccullagh.github.io/');

            }
        }
    })(req, res, next);
});



export const locationRoutes: Router = router;