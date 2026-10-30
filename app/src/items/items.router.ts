/**
 * Required External Modules and Interfaces
 */

import express, {NextFunction, Request, Response} from "express";
import * as ItemService from "./items.service";
import {BaseItem, Item} from "./item.interface";
import {toBaseItem, validateItem} from "./item.validation";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();

// parseInt("abc") is NaN, which reads as "not found" or, for PUT, a brand new item.
itemsRouter.param("id", (req: Request, res: Response, next: NextFunction, id: string) => {
    // Past 2^53 parseInt rounds, so "9007199254740993" would read item 9007199254740992.
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return res.status(400).json({status: 400, message: "id must be a positive integer"});
    }
    next();
});


/**
 * Controller Definitions
 */

// GET items

itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const items: Item[] = await ItemService.findAll();

        res.status(200).send(items);
    } catch (e) {
        res.status(500).send(e instanceof Error ? e.message : String(e));
    }
});

// GET items/:id

itemsRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item: Item = await ItemService.find(id);

        if (item) {
            return res.status(200).send(item);
        }

        res.status(404).send("item not found");
    } catch (e) {
        res.status(500).send(e instanceof Error ? e.message : String(e));
    }
});

// POST items

itemsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const errors = validateItem(req.body);
        if (errors.length) return res.status(400).json({status: 400, errors});

        const item: BaseItem = toBaseItem(req.body);

        const newItem = await ItemService.create(item);

        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).send(e instanceof Error ? e.message : String(e));
    }
});

// PUT items/:id

itemsRouter.put("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const errors = validateItem(req.body);
        if (errors.length) return res.status(400).json({status: 400, errors});

        const itemUpdate: BaseItem = toBaseItem(req.body);
        const existingItem: Item = await ItemService.find(id);

        if (existingItem) {
            const updatedItem = await ItemService.update(id, itemUpdate);
            return res.status(200).json(updatedItem);
        }

        const newItem = await ItemService.create(itemUpdate, id);

        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).send(e instanceof Error ? e.message : String(e));
    }
});

// DELETE items/:id

itemsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await ItemService.remove(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e instanceof Error ? e.message : String(e));
    }
});