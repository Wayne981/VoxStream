import {initServer } from "./app";
import * as dotenv from "dotenv";

dotenv.config(); // when server starts , it will read the .env file and set the environment variables

// console.log(process.env);

async function init() {

    const app = await initServer();
    app.listen(8000, () => console.log(" server started at PORT:8000"));
}

init().catch(error => console.error('Failed to start the server:', error));