/** server/index.ts */
import 'localenv'
//import * as dotenv from "dotenv"
import express, { Request, Response, NextFunction } from "express";
import { useExpressServer } from 'routing-controllers';
import path from 'path';
//import compression from "compression";
import cors from "cors";

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
        this.app.set("port", process.env.PORT || "3080");
        this.app.use(express.json({ type: "application/json" }));
        this.app.use(express.urlencoded({ extended: true }));
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