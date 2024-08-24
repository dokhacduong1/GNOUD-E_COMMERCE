import { deleteQuery } from "../find-record/delete_query";
import { IProduct } from "../interfaces/clients/product.interfaces";
import ProductImage from "../models/ProductImage.model";
import ProductInformation from "../models/product_information.model";
import ProductOption from "../models/product_options.model";
import SizeSpecification from "../models/size_specification.model";
import Trash from "../models/trash.model";
import { LinkImageConverter } from "./convertLinkImage";

export async function handleDeleteAll(ids: number[]) {
    for (let id of ids) {
      const findItemOptions = await ProductOption.findAll({
        where: {
          Product_ID: id,
        },
        raw: true,
      });

      //Xóa hình ảnh sản phẩm
      await Promise.all(findItemOptions.map(item => 
        ProductImage.destroy({
          where: {
            Option_ID: item["ID"],
          },
        })
      ));

      // Xóa thông tin sản phẩm
      await Promise.all([
        ProductOption.destroy({
          where: {
            Product_ID: id,
          },
        }),
        SizeSpecification.destroy({
          where: {
            Product_ID: id,
          },
        }),
        ProductInformation.destroy({
          where: {
            Product_ID: id,
          },
        })
      ]);

      await deleteQuery("products", id);
    }
}
export function convertProducts(reladtedProducts: IProduct[]): IProduct[] {
  return reladtedProducts.map(
    (item: IProduct) => {
      let options: any = item.Options;

      // Chỉ chuyển đổi nếu Options là chuỗi
      if (typeof options === "string") {
        options = JSON.parse(options)[0];
      }
      return {
        ID: item.ID,
        Product_ID: item.Product_ID,
        Title: item.Title,
        Price: item.Price,
        DiscountPercent: item.DiscountPercent,
        Slug: item.Slug,
        Image: LinkImageConverter(options?.image, 418, 418), // Dùng optional chaining để tránh lỗi nếu `options` không có `image`
      };
    }
  );
}