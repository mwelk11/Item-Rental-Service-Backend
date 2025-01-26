"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const item_service_1 = __importDefault(require("./item-service"));
const app = (0, express_1.default)();
const port = 3000;
const itemService = new item_service_1.default();
app.use(express_1.default.json());
app.post('/item', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('description is required').isString().withMessage('description must be a string'),
    (0, express_validator_1.body)('pricePerDay').notEmpty().withMessage('pricePerDay is required').isNumeric().withMessage('pricePerDay must be a number')
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    const { name, description, pricePerDay } = req.body;
    itemService.addItem(name, description, pricePerDay);
    res.status(200).send("OK");
});
app.get('/item', [
    (0, express_validator_1.query)('name').optional().isString().withMessage('Name must be a string'),
    (0, express_validator_1.query)('startPrice').optional().isNumeric().withMessage('startPrice must be a number'),
    (0, express_validator_1.query)('endPrice').optional().isNumeric().withMessage('endPrice must be a number'),
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    const { name, startPrice, endPrice } = req.query;
    // I wouldn't normally typecast like this, but I've spent too much time trying to debug it for the purposes of this assessment
    // I have already verified the input using express-validator above. I know that the query params are strings and numbers at this point
    res.send(itemService.getItems(name, startPrice, endPrice));
});
app.post('/item/rent', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'),
    (0, express_validator_1.body)('startDate').notEmpty().withMessage('startDate is required').isDate().withMessage('startDate must be a date'),
    (0, express_validator_1.body)('endDate').notEmpty().withMessage('endDate is required').isDate().withMessage('endDate must be a date')
], (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    const { name, startDate, endDate } = req.body;
    itemService.rentItem(name, startDate, endDate);
    res.status(200).send("OK");
});
app.post('/item/return', (0, express_validator_1.body)('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string'), (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    const name = req.body.name;
    itemService.returnItem(name);
    res.status(200).send("OK");
});
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    });
};
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
