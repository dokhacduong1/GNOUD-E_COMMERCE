import { Request, Response } from "express";
import Product from "../../models/product.model";
const prefix_client = "clients";
// [GET] /
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
  
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
      "https://www.muji.com/public/media/jp/img/top_banner/1640_fragrance_240621.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_make_index_240621.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_wind-summer_240607.jpg",
      "https://www.muji.com/public/media/jp/img/top_banner/1640_cool-fabric_240614.jpg",
    ]

    const slickItemsSampleOne = [
      {
        img:"https://www.muji.com/jp/store/home/category/image/240614/clothes/D00001_400_0614.jpg",
        content: "婦人・レディース",
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240614/clothes/D00022_400_0614.jpg",
        content: "紳士・メンズ",
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240614/clothes/T10001_400_0614.jpg",
        content: "婦人インナー・下着",
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240412/dailygoods/D00019_400_0412.jpg",
        content: "家具",
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240412/dailygoods/D00041_400_0412.jpg",
        content: "寝具",
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240426/dailygoods/D00016_400_0426.jpg",
        content:"収納用品・収納ケース"
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240607/dailygoods/D00034_400_0607.jpg",
        content:"掃除・洗濯用品"
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240607/food/T30001_400_0607.jpg",
        content:"レトルト・フリーズドライ"
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240412/food/D00030_400_0412.jpg",
        content:"飲料・茶葉"
      },
      {
        img:"https://www.muji.com/jp/store/home/category/image/240412/food/D00030_400_0412.jpg",
        content:"飲料・茶葉"
      }
    ]

    const slickItemsSampleTwo = [
      {
        title:"保冷バッグ　Ｓ　約１４×１５×８ｃｍ",
        listImages:[
          {
            color:"https://www.muji.com/public/media/img/item/4550584383168_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584383168_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550584383175_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584383175_400.jpg"
          },
          
        ],
        price: 1290,
      },
      {
        title:"紳士　脇に縫い目のない　二重ガーゼパジャマ",
        listImages:[
          {
            color:"https://www.muji.com/public/media/img/item/4550584008757_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584008757_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550584008788_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584008788_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550584008849_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584008849_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550584008900_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584008900_400.jpg"
          }
        ],
        price: 4990,
      },
      {
        title:"スチールモニタースタンド　引出付・ワイド・ダークグレー",
        listImages:[
          {
            color:"",
            img:"https://img.muji.net/img/item/4550583767136_400.jpg"
          },
        ],
        price: 1290,
      },
      {
        title:"ベビー　あたまするっと　プリント半袖Ｔシャツ",
        listImages:[
          {
            color:"https://www.muji.com/public/media/img/item/4550583714123_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583714123_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583714154_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583714154_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583714185_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583714185_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583714246_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583714215_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583714246_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583714246_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583888145_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583888145_400.jpg"
          },
        ],
        price: 990,
      },
      {
        title:"【ネットストア先行販売】太ベルトスクエアショルダーバッグ",
        listImages:[
          {
            color:"https://www.muji.com/public/media/img/item/4550584275562_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550584275562_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583936297_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583936297_400.jpg"
          }
        ],
        price: 3990,
      },
      {
        title:"紳士　風を通すストレッチ半袖Ｔシャツ（ポケットあり）",
        listImages:[
          {
            color:"https://www.muji.com/public/media/img/item/4550583924188_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583924188_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583924249_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583924249_400.jpg"
          },
          {
            color:"https://www.muji.com/public/media/img/item/4550583924331_99_95.jpg",
            img:"https://www.muji.com/public/media/img/item/4550583924331_400.jpg"
          }
        ],
        price: 3990,
      },
    ]
    res.render(prefix_client + "/pages/home/index", {
      title: "Home",
      data: data,
      banner: banner,
      slickItemsSampleOne: slickItemsSampleOne,
      slickItemsSampleTwo: slickItemsSampleTwo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
