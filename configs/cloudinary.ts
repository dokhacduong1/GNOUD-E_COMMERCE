//Import cấu hình file .env

import dotevn from "dotenv";
dotevn.config()

const CONFIG = {
    cloud_name: process.env.CLOUD_NAME,
    api_key:  process.env.CLOUD_KEY,
    api_secret:  process.env.CLOUD_SECRET
}

export const configClound = {
    configCloudinary: CONFIG
}