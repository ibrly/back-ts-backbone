import {Request, Response, NextFunction} from "express";

export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    response.status(404).json({status: 404, message: "Resource not found"});
};