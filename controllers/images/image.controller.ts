
import { Request, Response } from "express";

import axios from "axios";
import sharp from "sharp";
import NodeCache from "node-cache";

const myCache = new NodeCache();
// Hàm xử lý request để lấy hình ảnh
export const image = async function (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Lấy các tham số từ request
      const keyImage: string = req.params.key.toString();
      const idImage: string = req.params.id.toString();
      const width = req.query.w ? parseInt(req.query.w.toString()) : null;
      const height = req.query.h ? parseInt(req.query.h.toString()) : null;

      // Tạo key cho cache dựa trên các tham số
      const cacheKey = `${keyImage}-${idImage}-${width}-${height}`;

      // Kiểm tra xem dữ liệu đã được lưu trong cache chưa
      const cachedData = myCache.get(cacheKey);
      if (cachedData) {
        // Nếu dữ liệu đã có trong cache, gửi dữ liệu này trong response
        res.setHeader('Content-Type', `image/${idImage.split("image.")[1]}`);
        res.send(cachedData);
        return;
      }

      // Nếu dữ liệu chưa có trong cache, tải hình ảnh từ URL
      const imageUrl = `${process.env.IMAGE_KEY}/${keyImage}/${idImage}`;
      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
      });

      // Tạo một instance của sharp để biến đổi hình ảnh
      let transform = sharp();

      // Nếu có tham số width hoặc height, resize hình ảnh
      if (width || height) {
        transform = transform.resize(width, height);
      }

      // Đặt Content-Type của response
      res.setHeader('Content-Type', 'image/avif');

      // Pipe dữ liệu từ response vào sharp
      const transformedStream = response.data.pipe(transform);
      const chunks = [];

      // Khi có dữ liệu mới từ stream, thêm nó vào mảng chunks
      transformedStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // Khi stream kết thúc, gộp các chunks lại, lưu vào cache và gửi trong response
      transformedStream.on('end', () => {
        const result = Buffer.concat(chunks);
        // Lưu dữ liệu vào cache trong 24 giờ
        const ttl = 24 * 60 * 60;
        myCache.set(cacheKey, result, ttl);
        res.send(result);
      });

    } catch (error) {
      // Nếu có lỗi, gửi status 500 và thông báo lỗi
      res.status(500).send("Error fetching the image");
    }
  };