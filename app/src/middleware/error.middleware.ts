import HttpException from "../common/http-exception";
import {Request, Response, NextFunction} from "express";

export const errorHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || error.status || 500;
    // The client only sees a generic message for these, so keep the real error in the logs.
    if (status >= 500) console.error(error);
    // Error properties are not enumerable, so sending the error object itself serialises to {}.
    // Hide internal details for server errors.
    const message = status >= 500 ? "Internal server error" : error.message;

    response.status(status).json({status, message});
};
