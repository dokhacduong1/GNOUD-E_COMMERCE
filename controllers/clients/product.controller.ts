import { Request, Response } from "express";
import Product from "../../models/product.model";
import SizeSpecification from "../../models/size_specification.model";
import ProductInformation from "../../models/product_information.model";
import ProductOption from "../../models/product_options.model";
import ProductImage from "../../models/ProductImage.model";
import {
  IListImage,
  IListImages,
  IProduct,
  IProductImage,
  IProductInformation,
  IProductOption,
  ISizeSpecification,
} from "../../interfaces/clients/product.interfaces";
import { LinkImageConverter } from "../../helpers/convertLinkImage";
import Categorie from "../../models/categorie.model";
import { CategoryInterface } from "../../interfaces/admins/categories.interface";
import { getBreadcrumbUsingCTE } from "../../helpers/categories.helpers";
import ProductPreview from "../../models/product_preview.model";
import { convertProducts } from "../../helpers/products.helpers";
import { Op } from "sequelize";

const prefix_client = "clients";

// Hàm getProductDetails là một hàm bất đồng bộ, nhận vào slug của sản phẩm và trả về Promise chứa thông tin chi tiết về sản phẩm
async function getProductDetails(slug: string): Promise<{
  product: IProduct;
  size_product: ISizeSpecification | null;
  productInfomation: IProductInformation[];
  productOptions: IProductOption[];
  breadcrumb: CategoryInterface[];
  reladtedProductsTemp: IProduct[];
  popularProductsTemp: IProduct[];
}> {
  // Tìm sản phẩm dựa trên slug
  const product = (await Product.findOne({
    where: { Slug: slug },
    raw: true,
  })) as unknown as IProduct;

  // Sử dụng Promise.all để thực hiện song song các thao tác tìm kiếm thông tin kích thước, thông tin sản phẩm và tùy chọn sản phẩm
  const [
    size_product,
    productInfomation,
    productOptions,
    breadcrumb,
    reladtedProducts,
    popularProducts,
  ] = await Promise.all([
    // Tìm thông tin kích thước của sản phẩm
    SizeSpecification.findOne({
      where: { Product_ID: product.ID },
      raw: true,
    }) as unknown as ISizeSpecification | null,

    // Tìm tất cả thông tin của sản phẩm
    ProductInformation.findAll({
      where: { Product_ID: product.ID },
      raw: true,
    }) as unknown as IProductInformation[],

    // Tìm tất cả tùy chọn của sản phẩm
    ProductOption.findAll({
      where: { Product_ID: product.ID },
      raw: true,
    }) as unknown as IProductOption[],

    // Tìm tất cả danh mục của sản phẩm để tạo breadcrumb
    getBreadcrumbUsingCTE(
      product.Category_ID
    ) as unknown as CategoryInterface[],
    // Tìm tất cả sản phẩm liên quan dựa trên Category_ID của sản phẩm
    ProductPreview.findAll({
      where: {
        Status: "active",
        Deleted: false,
        Category_ID: product.Category_ID,
        Product_ID: {
          [Op.ne]: product.ID, // Loại bỏ sản phẩm hiện tại
        },
      },
      attributes: [
        "Title",
        "Price",
        "DiscountPercent",
        "Slug",
        "Options",
      ],
      limit: 18,
      raw: true,
    }) as unknown as IProduct[],
    // Tìm tất cả sản phẩm phổ biến
    ProductPreview.findAll({
      where: {
        Status: "active",
        Deleted: false,
      },
      attributes: [
       
        "Product_ID",
        "Title",
        "Price",
        "DiscountPercent",
        "Slug",
        "Options",
        "NumberOfPurchases",
      ],
      order: [["NumberOfPurchases", "DESC"]],
      limit: 12,
      raw: true,
    }) as unknown as IProduct[]
  ]);

  // Nếu thông tin kích thước không null và TextOption là chuỗi, chuyển đổi TextOption từ chuỗi JSON sang đối tượng
  if (size_product !== null && typeof size_product.TextOption === "string") {
    size_product.TextOption = JSON.parse(size_product.TextOption);
  }
  const reladtedProductsTemp: IProduct[] = convertProducts(reladtedProducts);

  const popularProductsTemp: IProduct[] = convertProducts(popularProducts);
  console.log(productOptions);
  // Trả về đối tượng chứa thông tin sản phẩm, thông tin kích thước, thông tin sản phẩm và tùy chọn sản phẩm
  return {
    product,
    size_product,
    productInfomation,
    productOptions,
    breadcrumb,
    reladtedProductsTemp,
    popularProductsTemp,
  };
}

// Hàm này có nhiệm vụ lấy danh sách hình ảnh cho tùy chọn sản phẩm
async function getProductImages(
  productOptions: IProductOption[]
): Promise<IProductImage[]> {
  //Vào bảng ProductImage để lấy hình ảnh của sản phẩm theo id của tùy chọn sản phẩm
  return (await ProductImage.findAll({
    where: {
      Option_ID: productOptions.map((option: IProductOption): string =>
        option.ID.toString()
      ),
    },
    order: [["ID", "ASC"]],
    raw: true,
  })) as unknown as IProductImage[];
}

// [GET] /
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Lấy slug từ tham số của yêu cầu
    const slug: string = req.params.slug;

    // Lấy chi tiết sản phẩm bằng cách gọi hàm getProductDetails với slug
    const {
      product,
      size_product,
      productInfomation,
      productOptions,
      breadcrumb,
      reladtedProductsTemp,
      popularProductsTemp
    } = await getProductDetails(slug);

    // Tạo danh sách hình ảnh cho từng tùy chọn sản phẩm
    const listImages = productOptions.map(
      async (option: IProductOption): Promise<IListImages> => {
        // Chuyển đổi List_Options từ chuỗi JSON sang đối tượng
        if (typeof option.List_Options === "string") {
          option.List_Options = JSON.parse(option.List_Options.toString());
        }

        // Lấy danh sách hình ảnh cho tùy chọn sản phẩm hiện tại
        const imagesForOption = (await getProductImages(productOptions)).filter(
          (image: IProductImage) => image.Option_ID === option.ID
        );

        // Chuyển đổi URL của hình ảnh
        option.ListImages = imagesForOption.map(
          (image: IProductImage): IListImage => ({
            // Chuyển đổi URL hình ảnh với kích thước 48x48
            ImageURL: LinkImageConverter(image.ImageURL, 48, 48),
            // Chuyển đổi URL hình ảnh chính với kích thước 1260x1260
            ImageURLMain: LinkImageConverter(image.ImageURL, 1260, 1260),
          })
        );

        // Chuyển đổi URL của màu sắc với kích thước 37x37
        option.Color = LinkImageConverter(option.Color, 37, 37);

        // Trả về đối tượng với ID, danh sách hình ảnh, danh sách kích thước và số lượng hàng tồn
        return {
          ID: option.ID,
          dataImage: option.ListImages,
          dataSize: option.List_Options,
          Stock: option.Stock,
        };
      }
    );
 
    // Render trang sản phẩm với dữ liệu cần thiết
    res.render(`${prefix_client}/pages/product/index`, {
      title: product.Title,
   
      product: product,
      size_product: size_product,
      productInfomation: productInfomation,
      productOptions: productOptions,
      breadcrumb: breadcrumb,
      reladtedProducts: reladtedProductsTemp,
      popularProducts: popularProductsTemp,
      // Chờ cho tất cả các Promise trong listImages hoàn thành
      listImages: await Promise.all(listImages),
    });
  } catch (error) {
    // Nếu có lỗi, in lỗi ra console và trả về lỗi máy chủ nội bộ
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
