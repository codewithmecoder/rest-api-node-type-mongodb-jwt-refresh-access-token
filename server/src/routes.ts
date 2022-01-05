import { Express, Response, Request } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getDeleteProductHandler,
  getNonDeleteProductsHandler,
  getProductHandler,
  getProductsHandler,
  updateProductHandler,
} from "./controllers/product.controller";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "./controllers/session.controller";
import { createUserHandler } from "./controllers/user.controller";
import { requireUser } from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  /**
   * User route
   */
  //@POST : /api/users
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  /**
   * End user route
   */

  /**
   * Session route
   */

  //@POST : /api/sessions
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  //@GET : /api/sessions
  app.get("/api/sessions", requireUser, getUserSessionHandler);

  //@DELETE : /api/sessions
  app.delete("/api/sessions", requireUser, deleteSessionHandler);
  /**
   * End session route
   */

  /**
   * Product route
   */

  //@POST : /api/products
  app.post(
    "/api/products",
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );
  //@GET : /api/products/:productId
  app.get(
    `/api/products/:productId`,
    validateResource(getProductSchema),
    getProductHandler
  );
  //@GET : /api/productsdelete
  app.get(`/api/productsdelete`, requireUser, getDeleteProductHandler);
  //@GET : /api/productsnondelete
  app.get(`/api/productsnondelete`, requireUser, getNonDeleteProductsHandler);
  //@GET : /aip / productsnondelete;
  app.get(`/api/products`, requireUser, getProductsHandler);
  //@PUT : /api/products/:productId
  app.put(
    `/api/products/:productId`,
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );

  //@DELETE : /api/products/:productId
  app.delete(
    `/api/products/:productId`,
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
