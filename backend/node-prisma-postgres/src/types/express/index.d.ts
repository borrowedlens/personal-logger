import express from "express";

declare module "express" {
  export interface Response {
    json<DataType>(
      body?: BaseResponse<DataType>
    ): Response<BaseResponse<DataType>>;
  }
  export interface RequestHandler {
    (
      req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
      res: Response<ResBody, LocalsObj>,
      next: NextFunction
    ): void;
  }
}
