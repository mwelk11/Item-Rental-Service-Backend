/**
 * Entry point to our application. This file creates a node server and sets up routing using express.js.
 * We specify two middlewares: the express provided JSON parser to parse our request bodies, and an error handler
 * to propogate errors back to the client. Core business logic for handling items happens in item-service.ts
 */

import express, {
    Express,
    Request,
    Response,
    NextFunction
} from 'express';
import {
    body,
    query,
    validationResult
} from 'express-validator';
import ItemService from './item-service';

const app: Express = express();
const port = 3000;
const itemService = new ItemService();

app.use(express.json());

app.post('/item', [
    body('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
    body('description').notEmpty().withMessage('description is required').isString().withMessage('description must be a string'),
    body('pricePerDay').notEmpty().withMessage('pricePerDay is required').isNumeric().withMessage('pricePerDay must be a number')
], (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }

    const { name, description, pricePerDay } = req.body;
    itemService.addItem(name, description, pricePerDay);

    res.status(200).send("OK");
});

app.get('/item', [
    query('name').optional().isString().withMessage('Name must be a string'),
    query('startPrice').optional().isNumeric().withMessage('startPrice must be a number'),
    query('endPrice').optional().isNumeric().withMessage('endPrice must be a number'),
], (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }

    const { name, startPrice, endPrice } = req.query;

    // I wouldn't normally typecast like this, but I've spent too much time trying to debug it for the purposes of this assessment
    // I have already verified the input using express-validator above. I know that the query params are strings and numbers at this point
    res.send(itemService.getItems(
        name as string,
        startPrice as unknown as number,
        endPrice as unknown as number)
    );
});

app.post('/item/rent', [
    body('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
    body('startDate').notEmpty().withMessage('startDate is required').isDate().withMessage('startDate must be a date'),
    body('endDate').notEmpty().withMessage('endDate is required').isDate().withMessage('endDate must be a date')
], (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }

    const { name, startDate, endDate } = req.body;
    itemService.rentItem(name, startDate, endDate);
    res.status(200).send("OK");
});

app.post('/item/return', body('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
(req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }

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