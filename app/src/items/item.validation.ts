import {BaseItem} from "./item.interface";

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

/**
 * Returns a list of problems with an item payload; an empty list means it is valid.
 * `price` is in cents, so it must be a non-negative integer.
 */
export const validateItem = (body: unknown): string[] => {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return ["body must be a JSON object"];
    }

    const item = body as Record<string, unknown>;
    const errors: string[] = [];

    for (const field of ["name", "description", "image"] as const) {
        if (!isNonEmptyString(item[field])) errors.push(`${field} must be a non-empty string`);
    }
    if (!Number.isInteger(item.price) || (item.price as number) < 0) {
        errors.push("price must be a non-negative integer (cents)");
    }

    return errors;
};

/** Keeps only the known fields, so extra keys in the request never reach the store. */
export const toBaseItem = (body: Record<string, unknown>): BaseItem => ({
    name: body.name as string,
    price: body.price as number,
    description: body.description as string,
    image: body.image as string,
});
