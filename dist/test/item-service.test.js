"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const item_service_1 = __importDefault(require("../src/item-service"));
describe('item-service', () => {
    describe('addItem', () => {
        it('should return an item that is just added', () => {
            const itemService = new item_service_1.default();
            itemService.addItem('my-item', 'some description', 2);
            const result = itemService.getItems();
            (0, chai_1.expect)(result).to.eql([{
                    name: 'my-item',
                    description: 'some description',
                    pricePerDay: 2
                }]);
        });
        it('should not add a duplicate item', () => {
            const itemService = new item_service_1.default();
            itemService.addItem('my-item', 'some description', 2);
            itemService.addItem('my-item', 'some description', 2);
            const result = itemService.getItems();
            (0, chai_1.expect)(result).to.eql([{
                    name: 'my-item',
                    description: 'some description',
                    pricePerDay: 2
                }]);
        });
    });
    describe('getItems', () => {
        it('should return an empty array when no items are present', () => {
            const itemService = new item_service_1.default();
            const result = itemService.getItems();
            (0, chai_1.expect)(result).have.lengthOf(0);
        });
        it('should return all available items when no search params are sent', () => {
            const itemService = new item_service_1.default();
            const items = [{
                    name: 'item1',
                    description: 'description 1',
                    pricePerDay: 20
                }, {
                    name: 'item2',
                    description: 'description 2',
                    pricePerDay: 7
                }, {
                    name: 'item3',
                    description: 'description 3',
                    pricePerDay: 14
                }, {
                    name: 'item4',
                    description: 'description 4',
                    pricePerDay: 0
                }];
            for (const item of items) {
                itemService.addItem(item.name, item.description, item.pricePerDay);
            }
            // Set item1 to unavailable
            itemService.rentItem('item1', new Date("2025-01-25"), new Date("2025-01-27"));
            const resultNames = itemService.getItems().map(x => x.name);
            // All items except item1 are returned
            (0, chai_1.expect)(resultNames).have.lengthOf(3);
            (0, chai_1.expect)(resultNames).to.not.include('item1');
        });
        it('should return no items when no matches are found', () => {
            const itemService = new item_service_1.default();
            const items = [{
                    name: 'item1',
                    description: 'description 1',
                    pricePerDay: 20
                }, {
                    name: 'item2',
                    description: 'description 2',
                    pricePerDay: 7
                }, {
                    name: 'item3',
                    description: 'description 3',
                    pricePerDay: 14
                }, {
                    name: 'item4',
                    description: 'description 4',
                    pricePerDay: 0
                }];
            for (const item of items) {
                itemService.addItem(item.name, item.description, item.pricePerDay);
            }
            const resultNames = itemService.getItems('item6').map(x => x.name);
            (0, chai_1.expect)(resultNames).have.lengthOf(0);
        });
        it('should return correct item when name is specified', () => {
            const itemService = new item_service_1.default();
            const items = [{
                    name: 'item1',
                    description: 'description 1',
                    pricePerDay: 20
                }, {
                    name: 'item2',
                    description: 'description 2',
                    pricePerDay: 7
                }, {
                    name: 'item3',
                    description: 'description 3',
                    pricePerDay: 14
                }, {
                    name: 'item4',
                    description: 'description 4',
                    pricePerDay: 0
                }];
            for (const item of items) {
                itemService.addItem(item.name, item.description, item.pricePerDay);
            }
            const resultNames = itemService.getItems('item3').map(x => x.name);
            (0, chai_1.expect)(resultNames).have.lengthOf(1);
            (0, chai_1.expect)(resultNames).to.include('item3');
        });
        it('should return correct items for price range', () => {
            const itemService = new item_service_1.default();
            const items = [{
                    name: 'item1',
                    description: 'description 1',
                    pricePerDay: 20
                }, {
                    name: 'item2',
                    description: 'description 2',
                    pricePerDay: 7
                }, {
                    name: 'item3',
                    description: 'description 3',
                    pricePerDay: 14
                }, {
                    name: 'item4',
                    description: 'description 4',
                    pricePerDay: 0
                }];
            for (const item of items) {
                itemService.addItem(item.name, item.description, item.pricePerDay);
            }
            const resultNames = itemService.getItems(undefined, 4, 16).map(x => x.name);
            (0, chai_1.expect)(resultNames).have.lengthOf(2);
            (0, chai_1.expect)(resultNames).to.include('item2');
            (0, chai_1.expect)(resultNames).to.include('item3');
        });
        it('should return correct item when name and date range is specified', () => {
            const itemService = new item_service_1.default();
            const items = [{
                    name: 'item1',
                    description: 'description 1',
                    pricePerDay: 20
                }, {
                    name: 'item2',
                    description: 'description 2',
                    pricePerDay: 7
                }, {
                    name: 'item3',
                    description: 'description 3',
                    pricePerDay: 14
                }, {
                    name: 'item4',
                    description: 'description 4',
                    pricePerDay: 0
                }];
            for (const item of items) {
                itemService.addItem(item.name, item.description, item.pricePerDay);
            }
            const resultNames = itemService.getItems('item2', 8, 10).map(x => x.name);
            (0, chai_1.expect)(resultNames).have.lengthOf(0);
        });
    });
    describe('rentItem', () => {
        it('should remove items from available when rented', () => {
            const itemService = new item_service_1.default();
            const item = {
                name: 'item1',
                description: 'description 1',
                pricePerDay: 20
            };
            itemService.addItem(item.name, item.description, item.pricePerDay);
            // Set item1 to unavailable
            itemService.rentItem('item1', new Date("2025-01-25"), new Date("2025-01-27"));
            const result = itemService.getItems();
            (0, chai_1.expect)(result).have.lengthOf(0);
        });
        it('should not be able to rent an item that is already rented', () => {
            const itemService = new item_service_1.default();
            const item = {
                name: 'item1',
                description: 'description 1',
                pricePerDay: 20
            };
            itemService.addItem(item.name, item.description, item.pricePerDay);
            itemService.rentItem('item1', new Date("2025-01-25"), new Date("2025-01-27"));
            (0, chai_1.expect)(() => itemService.rentItem('item1', new Date("2025-01-25"), new Date("2025-01-27")))
                .to.throw('Item is not available for rent');
        });
    });
    describe('returnItem', () => {
        it('should set an item back to available when it is returned', () => {
            const itemService = new item_service_1.default();
            const item = {
                name: 'item1',
                description: 'description 1',
                pricePerDay: 20
            };
            itemService.addItem(item.name, item.description, item.pricePerDay);
            itemService.rentItem('item1', new Date("2025-01-25"), new Date("2025-01-27"));
            // Expect item to not be available
            (0, chai_1.expect)(itemService.getItems()).have.lengthOf(0);
            itemService.returnItem(item.name);
            // Expect item to be available again
            (0, chai_1.expect)(itemService.getItems()).have.lengthOf(1);
        });
    });
});
