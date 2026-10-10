import express from "express";
import cors from "cors";
import helmet from "helmet";
import {itemsRouter} from "./items/items.router";
import {errorHandler} from "./middleware/error.middleware";
import {notFoundHandler} from "./middleware/not-found.middleware";

/**
 * Builds the Express app without starting a server, so tests can mount it on any port.
 */
export const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use("/api/menu/items", itemsRouter);
    app.use(errorHandler);
    app.use(notFoundHandler);

    return app;
};
