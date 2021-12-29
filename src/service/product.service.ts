import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import ProductModel, { ProductDocument } from "../models/product.model";

export async function createProduct(
  input: DocumentDefinition<Omit<ProductDocument, "createdAt" | "updatedAt">>
) {
  return ProductModel.create(input);
}
export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return ProductModel.findOne(query, {}, options);
}
export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}
export async function deleteProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>
) {
  return ProductModel.findOneAndUpdate(query, update, { new: true });
}
export async function getDeleteProduct(userId: string) {
  return ProductModel.find({ isDelete: true, user: userId });
}
export async function getNonDeleteProducts(userId: string) {
  return ProductModel.find({ isDelete: false, user: userId });
}
export async function getProducts(userId: string) {
  return ProductModel.find({ user: userId });
}
