"use strict";
/**
 * Entry point to our application. This file creates a node server and sets up routing using express.js.
 * We specify two middlewares: the express provided JSON parser to parse our request bodies, and an error handler
 * to propogate errors back to the client. Core business logic for handling items happens in item-service.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_service_1 = __importDefault(require("./item-service"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const app = (0, express_1.default)();
const port = 3000;
const itemService = new item_service_1.default();
app.use(express_1.default.json());
app.use(OpenApiValidator.middleware({
    apiSpec: './openapi.yml',
    validateRequests: true,
    validateResponses: true,
}));
app.post('/item', (req, res) => {
    const { name, description, pricePerDay } = req.body;
    itemService.addItem(name, description, pricePerDay);
    res.status(200).send("OK");
});
app.get('/item', (req, res) => {
    // All requests are verified using OpenApiValidator against the schema defined in openapi.yml.
    // It is safe to typecast here b/c the input has already been validated.
    const name = req.query.name;
    const startPrice = req.query.startPrice;
    const endPrice = req.query.endPrice;
    res.send(itemService.getItems(name, startPrice, endPrice));
});
app.post('/item/rent', (req, res) => {
    const { name, startDate, endDate } = req.body;
    itemService.rentItem(name, startDate, endDate);
    res.status(200).send("OK");
});
app.post('/item/return', (req, res) => {
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
