/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import {createApp} from "./app";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
    console.error("PORT is not set. Copy env/app.env.example to env/app.env or export PORT.");
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

/**
 * Server Activation
 */
createApp().listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
