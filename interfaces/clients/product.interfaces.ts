export interface IBaseProduct {
  ID: number;
  Product_ID?: number;
}

type TextOptionType = string | { listTitle: string[]; listOptions: string[][] };

export interface IProduct extends IBaseProduct {
  Title?: string;
  Category_ID?: number;
  Slug?: string;
  Featured?: boolean;
  Status?: string;
  DiscountPercent?: number;
  Description?: string;
  ImageLink?: string;
  Price?: number;
  Deleted?: boolean;
  Product_Sample_Information?: string;
  popularProductsTemp?: number;
  Options?:string;
}

export interface ISizeSpecification extends IBaseProduct {
  TextOption: TextOptionType;
}

export interface IProductInformation extends IBaseProduct {
  Info_Key: string;
  Info_Value: string;
}

export interface IDataSize {
  size: string;
  stock: number;
}

export interface IListImage {
  ImageURL: string;
  ImageURLMain: string;
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

export interface IListImages extends IBaseProduct {
  dataImage: IListImage[];
  dataSize: string | IDataSize[];
  Stock: number;
}
