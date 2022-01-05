import { Request, Response } from "express";
import {
  createProductInput,
  deleteProductInput,
  getProductInput,
  updateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
  getDeleteProduct,
  getNonDeleteProducts,
  getProducts,
} from "../service/product.service";

export async function createProductHandler(
  req: Request<{}, {}, createProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const body = req.body;

  const product = await createProduct({
    ...body,
    user: userId,
  });

  return res.status(201).send(product);
}

export async function updateProductHandler(
  req: Request<updateProductInput["params"], {}, updateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send({
      error: true,
      message: "Product not found",
    });
  }
  console.log(String(product.user) !== userId);
  if (String(product.user) !== userId) {
    return res.status(403).send({
      error: true,
      message: "You're not allowed",
    });
  }
  const updateProduct = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });
  return res.status(204).send(updateProduct);
}

export async function getProductHandler(
  req: Request<getProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ productId, isDelete: false });

  if (!product) {
    return res.status(404).send({
      error: true,
      message: "Product not found",
    });
  }
  return res.status(200).send(product);
}

export async function deleteProductHandler(
  req: Request<deleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send({
      error: true,
      message: "Product not found",
    });
  }
  if (String(product.user) !== userId) {
    return res.status(403).send({
      error: true,
      message: "You're not allowed",
    });
  }
  const updateProduct = await deleteProduct({ productId }, { isDelete: true });
  return res.status(200).send(updateProduct);
}
export async function getDeleteProductHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const deleteProducts = await getDeleteProduct(userId);
  if (deleteProducts.length > 0) return res.status(200).send(deleteProducts);
  else
    return res.status(404).send({
      error: true,
      message: "No Products",
    });
}
export async function getNonDeleteProductsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const products = await getNonDeleteProducts(userId);
  if (products.length > 0) return res.status(200).send(products);
  else
    return res.status(404).send({
      error: true,
      message: "No Products",
    });
}
export async function getProductsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const products = await getProducts(userId);
  if (products.length > 0) return res.status(200).send(products);
  else
    return res.status(404).send({
      error: true,
      message: "No Products",
    });
}
