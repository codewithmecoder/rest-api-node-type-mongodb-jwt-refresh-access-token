import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { EMPTY_PATH, string } from "zod";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet(`abcdefghijklmnopqrstuvwxyz0123456789`, 10);

export interface ProductDocument extends mongoose.Document {
  user: UserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    default: (): string => `product_${nanoid()}`,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
