
export interface ICartItemn {
    ID: number;
    Cart_ID: string;
    Product_ID: number;
    Product_Option_ID: number;
    SizeProduct: string;
    Quantity: number;
    Price?: number;  
    ImageLink?: string;
    sumPrice?: number;
    update: (values: Partial<ICartItemn>) => Promise<void>;
  }
  