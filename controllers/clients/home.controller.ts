import { Request, Response } from "express";
import Product from "../../models/product.model";
const prefix_client = "clients";
// [GET] /
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const coutProduct = await Product.findAll({
      where: {
        Status: "Active",
        Deleted: false,
      },
      raw: true,
    });
    const data = [
      [
        {
          title: "婦人・レディース1",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        },
        {
          title: "婦人・レディース1.1",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        },
      ],
      [
        
        {
          title: "婦人・レディース2",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        },
      ],
      [
        
        {
          title: "婦人・レディース3",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        },
        {
          title: "婦人・レディース3.1",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        },
      ],
      [
        
        {
          title: "婦人・レディース4",
          items: [
            { id: 1, name: "Tシャツ" },
            { id: 2, name: "ワンピース・チュニック" },
            { id: 3, name: "シャツ・ブラウス" },
            { id: 4, name: "カーディガン・ニット" },
            { id: 5, name: "スウェット" },
          ],
        }
      ],
    ];


    const banner = [
      "https://www.muji.com/public/media/jp/img/top_banner/1640_fragrance_240614.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_clear-care_240614.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_wind-summer_240607.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_cool-fabric_240614.jpg",
    ]
    res.render(prefix_client + "/pages/home/index", {
      title: "Home",
      data: data,
      banner: banner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
