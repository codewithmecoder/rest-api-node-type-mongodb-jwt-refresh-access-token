import { object, string, number, TypeOf, boolean } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "Title is requred",
    }),
    description: string({
      required_error: "Description is requred",
    }).min(120, "Description should be at least 120 characters long"),
    price: number({
      required_error: "Price is requred",
    }),
    image: string({
      required_error: "Image is requred",
    }),
    isDelete: boolean(),
  }),
};
const params = {
  params: object({
    productId: string({
      required_error: "ProductId is required",
    }),
  }),
};

export const createProductSchema = object({
  ...payload,
});
export const updateProductSchema = object({
  ...payload,
  ...params,
});
export const deleteProductSchema = object({
  ...params,
});
export const getProductSchema = object({
  ...params,
});

export type createProductInput = TypeOf<typeof createProductSchema>;
export type updateProductInput = TypeOf<typeof updateProductSchema>;
export type getProductInput = TypeOf<typeof getProductSchema>;
export type deleteProductInput = TypeOf<typeof deleteProductSchema>;
