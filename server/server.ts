import express, { NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser';
import { UserController } from './Api/UserController'
import cors from 'cors';
import compression from 'compression';
import { MainController } from "./Api/MainController";
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import { ClientsController } from "./Api/ClientsController";
import MongoDb from './DB/mongoConnect'

require('dotenv').config()
const swaggerDocument: { [name: string]: any } = require("../swagger.json");
const isDev = process.env.ENV === 'dev';
swaggerDocument['host'] = isDev ? 'localhost:3002' : 'api-user-manager.herokuapp.com';

const app = express();
const PORT = process.env.PORT || 3002;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(compression())
app.use(bodyParser.json())
app.use(cors())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: true }
}))

app.use((err: string, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(400).send('error parsing data')
    } else {
        next()
    }
})

new UserController(app)
new MainController(app)
new ClientsController(app)

MongoDb.connect();

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    MongoDb.close();
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
