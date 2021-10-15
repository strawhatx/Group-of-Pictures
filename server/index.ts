/** server/index.ts */
import 'localenv'
import 'reflect-metadata'
//import * as dotenv from "dotenv"
import express, { Request, Response, NextFunction } from "express";
import { useExpressServer } from 'routing-controllers';
import path from 'path';
import morgan from "morgan";

/**
 * Server
 */
export class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.controllers();
    }

    /**
     * Api Controllers
     */
    public controllers(): void {
        useExpressServer(this.app, {
            //If you want to prefix all your routes, e.g. /api you can use routePrefix option
            routePrefix: '/api',
            // register created express server in routing-controllers
            controllers: [path.join(__dirname + '/controllers/*.ts')], // and configure it the way you need (controllers, validation, etc.)
        });
    }

    /**
     * Main Config
     */
    public config(): void {
        this.app.use(morgan('dev'));
        this.app.set("port", process.env.PORT || 8081);
        this.app.use(express.json({ type: "application/json" }));
        this.app.use(express.urlencoded({ extended: true }));

        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'jade');
        this.app.set("json spaces", 2);


    }

    /**
     * Starts server
     */
    public start(): void {
        this.app.listen(this.app.get("port"), () => {
            console.log(
                "  API is running at http://localhost:%d",
                this.app.get("port")
            );
        });
    }
}

// get instance of the server
const server = new Server();

// start the server
server.start();

export default new Server().app;







