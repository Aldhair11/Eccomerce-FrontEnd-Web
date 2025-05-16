export interface Products {
    idProduct: number;
    productName: string;
    productDescription: string;
    productSku: string;
    productPrice: number;
    priceCreditCard: number;
    stock: number;
    quantity: number;
    productOfferDiscount: number;
    priceOffer: number;
    idCategory?: number | null;
    categoryName: string;
    idBrand?: number | null;
    brandName: string;
    brandImage: string;
    isOffer: boolean;
    isActive: boolean;
    productImg: string;
    pdfFile: string;
}
