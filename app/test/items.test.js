// Runs against the compiled app: `npm test` builds first.
const test = require("node:test");
const assert = require("node:assert/strict");
const {createApp} = require("../dist/app");

let server;
let base;

test.before(async () => {
    server = createApp().listen(0);
    await new Promise(resolve => server.once("listening", resolve));
    base = `http://127.0.0.1:${server.address().port}/api/menu/items`;
});

test.after(() => server.close());

const json = (method, body) => ({
    method,
    headers: {"content-type": "application/json"},
    body: JSON.stringify(body),
});

test("GET / lists the seeded items", async () => {
    const res = await fetch(base);
    assert.equal(res.status, 200);
    const items = await res.json();
    assert.deepEqual(items.map(item => item.name), ["Burger", "Pizza", "Tea"]);
});

test("GET /:id returns one item and 404s for unknown ids", async () => {
    const found = await fetch(`${base}/2`);
    assert.equal(found.status, 200);
    assert.equal((await found.json()).name, "Pizza");

    const missing = await fetch(`${base}/999`);
    assert.equal(missing.status, 404);
});

test("POST, PUT and DELETE manage an item's lifecycle", async () => {
    const created = await fetch(base, json("POST", {name: "Salad", price: 450, description: "Fresh", image: "salad.png"}));
    assert.equal(created.status, 201);
    const {id} = await created.json();

    const updated = await fetch(`${base}/${id}`, json("PUT", {name: "Big Salad", price: 550, description: "Fresher", image: "salad.png"}));
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).name, "Big Salad");

    const deleted = await fetch(`${base}/${id}`, {method: "DELETE"});
    assert.equal(deleted.status, 204);
    assert.equal((await fetch(`${base}/${id}`)).status, 404);
});

test("malformed JSON gets a 400 with a readable message", async () => {
    const res = await fetch(base, {method: "POST", headers: {"content-type": "application/json"}, body: "{bad"});
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.status, 400);
    assert.match(body.message, /JSON/);
});

test("unknown routes return 404", async () => {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/nope`);
    assert.equal(res.status, 404);
});

test("invalid payloads are rejected with every problem listed", async () => {
    const res = await fetch(base, json("POST", {name: "", price: "5", description: "x"}));
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.deepEqual(body.errors, [
        "name must be a non-empty string",
        "image must be a non-empty string",
        "price must be a non-negative integer (cents)",
    ]);

    const put = await fetch(`${base}/1`, json("PUT", {name: "Burger", price: -1, description: "Tasty", image: "b.png"}));
    assert.equal(put.status, 400);
    assert.equal((await fetch(`${base}/1`).then(r => r.json())).price, 599);
});

test("unknown fields are dropped before the item is stored", async () => {
    const res = await fetch(base, json("POST", {name: "Soup", price: 300, description: "Hot", image: "s.png", admin: true}));
    assert.equal(res.status, 201);
    assert.equal("admin" in (await res.json()), false);
});
