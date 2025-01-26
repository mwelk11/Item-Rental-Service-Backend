"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemService {
    constructor() {
        this.items = new Map();
        this.availableItems = new Set();
    }
    addItem(name, description, pricePerDay) {
        const item = {
            name,
            description,
            pricePerDay
        };
        this.items.set(name, item);
        this.availableItems.add(name);
    }
    getItems(name, startPrice, endPrice) {
        if (!name && !startPrice && !endPrice) {
            // No search params, return all available items
            return [...this.availableItems].map(x => this.items.get(x));
        }
        let filteredItems = [...this.availableItems];
        startPrice = startPrice !== null && startPrice !== void 0 ? startPrice : 0;
        endPrice = endPrice !== null && endPrice !== void 0 ? endPrice : Infinity;
        // If name is specified and available, then filter results down to that item before applying price filtering
        if (name) {
            if (!this.availableItems.has(name)) {
                return [];
            }
            else {
                filteredItems = [name];
            }
        }
        return filteredItems.map(x => this.items.get(x))
            .filter(x => x.pricePerDay >= startPrice && x.pricePerDay <= endPrice);
    }
    rentItem(name, startDate, endDate) {
        if (!this.availableItems.has(name)) {
            throw new Error('Item is not available for rent');
        }
        const item = this.items.get(name);
        item.rentalStartDate = startDate;
        item.rentalEndDate = endDate;
        this.availableItems.delete(name);
    }
    returnItem(name) {
        const item = this.items.get(name);
        item.rentalStartDate = undefined;
        item.rentalEndDate = undefined;
        this.availableItems.add(name);
    }
}
exports.default = ItemService;
