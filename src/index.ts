/**
 * Entry point to our application. This file creates a node server and sets up routing using express.js.
 * We specify three middlewares: the express provided JSON parser to parse our request bodies,
 * a validator using our openapi spec, and an error handler to propogate errors back to the client.
 * Core business logic for handling items happens in item-service.ts.
 */

import express, {
    Express,
    Request,
    Response,
    NextFunction
} from 'express';
import ItemService from './item-service';
import * as OpenApiValidator from "express-openapi-validator";

const app: Express = express();
const port = 3000;
const itemService = new ItemService();

app.use(express.json());

app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yml',
        validateRequests: true,
        validateResponses: true,
    })
);

app.post('/item', (req: Request, res: Response) => {
    const { name, description, pricePerDay } = req.body;
    itemService.addItem(name, description, pricePerDay);

    res.status(200).send("OK");
});

app.get('/item', (req: Request, res: Response) => {
    // All requests are validated using OpenApiValidator against the schema defined in openapi.yml.
    // It is safe to typecast here b/c the input has already been validated.
    const name: string = req.query.name as string;
    const startPrice: number = req.query.startPrice as unknown as number;
    const endPrice: number = req.query.endPrice as unknown as number;

    res.send(itemService.getItems(name, startPrice, endPrice));
});

app.post('/item/rent', (req: Request, res: Response) => {
    const { name, startDate, endDate } = req.body;
    itemService.rentItem(name, startDate, endDate);
    res.status(200).send("OK");
});

app.post('/item/return', (req: Request, res: Response) => {
    const name: string = req.body.name;
    itemService.returnItem(name);
    res.status(200).send("OK");
});

const errorHandler = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    });
}
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});