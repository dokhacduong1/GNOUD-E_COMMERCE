import { Request, Response } from "express";

import ProductPreview from "../../models/product_preview.model";
const prefix_client = "clients";
// [GET] /
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {

    const productsNew = await ProductPreview.findAll({
      where: {
        Status: "active",
        Deleted: false,
      },
      order: [["Created_At", "DESC"]],
      limit: 6,
      raw: true,
    });
    productsNew.forEach((item) => {
      item["Options"] = JSON.parse(item["Options"]);
    });
    const slickItemsNewProducts = productsNew.map((item: any) => {
      return {
        title: item.Title,
        listImages: item.Options.map((option: any) => {
          return {
            color: `/images/item/${option.color}.avif?w=14&h=14`,
            img: `/images/item/${option.image}.avif?w=253&h=253`,
          };
        }),
        slug: item.Slug,
        price: item.Price,
      };
    });


    const banner = [
      "images/item/tos-alisg-i-375lmtcpo0-sg/b6be080e784d45518c6d428928c7308e~tplv-375lmtcpo0-image.avif",
      "images/item/tos-alisg-i-375lmtcpo0-sg/7b4262fd046f4252b86057c40da3960a~tplv-375lmtcpo0-image.avif",
      "images/item/tos-alisg-i-375lmtcpo0-sg/eacf95269234415d9e8f95037d020359~tplv-375lmtcpo0-image.avif",
    ];

    const slickItemsSampleOne = [
      {
        img: "https://www.muji.com/jp/store/home/category/image/240614/clothes/D00001_400_0614.jpg",
        content: "婦人・レディース",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240614/clothes/D00022_400_0614.jpg",
        content: "紳士・メンズ",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240614/clothes/T10001_400_0614.jpg",
        content: "婦人インナー・下着",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240412/dailygoods/D00019_400_0412.jpg",
        content: "家具",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240412/dailygoods/D00041_400_0412.jpg",
        content: "寝具",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240426/dailygoods/D00016_400_0426.jpg",
        content: "収納用品・収納ケース",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240607/dailygoods/D00034_400_0607.jpg",
        content: "掃除・洗濯用品",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240607/food/T30001_400_0607.jpg",
        content: "レトルト・フリーズドライ",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240412/food/D00030_400_0412.jpg",
        content: "飲料・茶葉",
      },
      {
        img: "https://www.muji.com/jp/store/home/category/image/240412/food/D00030_400_0412.jpg",
        content: "飲料・茶葉",
      },
    ];
 



    res.render(prefix_client + "/pages/home/index", {
      title: "Home",
     
      banner: banner,
      slickItemsSampleOne: slickItemsSampleOne,
      slickItemsNewProducts: slickItemsNewProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
