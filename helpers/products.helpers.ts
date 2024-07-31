import { deleteQuery } from "../find-record/delete_query";
import ProductImage from "../models/ProductImage.model";
import ProductInformation from "../models/product_information.model";
import ProductOption from "../models/product_options.model";
import SizeSpecification from "../models/size_specification.model";
import Trash from "../models/trash.model";

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