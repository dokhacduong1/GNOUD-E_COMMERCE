export interface IBaseProduct {
  ID: number;
  Product_ID?: number;
}

export interface TextOptionTypeString {
  listTitle: string[];
  listOptions: string[][];
}
export interface IDataSize {
  size: string;
  stock: number;
}
export interface IProductInformation extends IBaseProduct {
  Info_Key: string;
  Info_Value: string;
}
export interface IListImage {
  ID: number;
  ImageURL: string;
}
export interface ISizeSpecification extends IBaseProduct {
  TextOption: TextOptionTypeString;
}
export interface IProductOption extends IBaseProduct {
  Title: string;
  Color: string;
  List_Options: string | IDataSize[];
  Stock: number;
  ListImages?: IListImage[];
}

export interface IProductImage extends IBaseProduct {
  Option_ID: number;
  ImageURL: string;
}

export interface IListOptionNew extends Partial<IBaseProduct> {
  NameColor: string;
  color: string;
  img: string;
  ListOptions?: string | IDataSize[];
  Stock?: number;
}
export interface IProduct extends Partial<IBaseProduct> {
  Price: number;
  DiscountPercent: number;
  Category_ID: number;
  Featured: boolean;
  CreatedAt: Date;
  Status: string;
  Description?: string;
  ImageLink?: string;
  Deleted?: boolean;
  ListItems?: IListOptionNew[];
  Product_Sample_Information: string;
}

export interface RequestBodyCategory {
    title: string;
    category_id: number;
    discount: number;
    featured: boolean;
    options: Array<{
      id: number;
      title?: string;
      color?: string;
      stock?: number;
      listOptions?: Array<any>;
      listImages?: Array<{ id: number; link: string }>;
    }>;
    price: number;
    description: string;
    product_information: Array<{ key: string; value: string }>;
    size_specifications: Record<string, any>;
    list_delete_images: Array<number>;
    product_sample_information: string;
  }

  export interface RequestProducts {
    title: string;
    category_id: number;
    discount: number;
    featured: boolean;
    options: Array<any>;
    price: number;
    description: string;
    product_information: Array<any>;
    size_specifications: Record<string, any>;
    product_sample_information: String;
  }