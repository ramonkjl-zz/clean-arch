import { Request, Response } from "express";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http";

const ERRORS = [400, 401, 403, 500]

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (ERRORS.includes(httpResponse.statusCode)) {
      return res.status(httpResponse.statusCode).json(httpResponse.body.message)
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
