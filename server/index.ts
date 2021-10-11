import { Server } from "./config/server";

// get instance of the server
const server = new Server();

// start the server
server.start();

export default new Server().app;







