import { Request, Response } from "express";
import ProductOption from "../../../../models/product_options.model";
import { IProductImage, IProductOption } from "../../../../interfaces/clients/product.interfaces";
import ProductImage from "../../../../models/ProductImage.model";
import { LinkImageConverter } from "../../../../helpers/convertLinkImage";

export const getSizeProduct = async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const id: number | string = req.params.id;

        // Fetch all product options in one go
        const sizeProducts: IProductOption[] = await ProductOption.findAll({
            where: { Product_ID: id },
            attributes: ["ID", "Title", "List_Options", "Color","Stock"],
            raw: true,
        }) as unknown as IProductOption[];
      
        // Fetch all product images in one go
        const productImages: IProductImage[] = await ProductImage.findAll({
            where: { Option_ID: sizeProducts.map(size_product => size_product.ID) },
            attributes: ["Option_ID", "ImageURL"],
            order: [["ID", "ASC"]],
            raw: true,
        }) as unknown as IProductImage[];

        // Map product options to their corresponding images
        const dataResult = sizeProducts.map(size_product => {
            const imageProduct = productImages.find(image => image.Option_ID === size_product.ID);
            return {
                ...size_product,
                ImageURL: LinkImageConverter(imageProduct?.ImageURL || "", 100, 100),
                Color: LinkImageConverter(size_product.Color, 25, 25),
            };
        });

        res.status(200).json({ code: 200, data: dataResult });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
};