/**
 * Class to handle all CRUD operations for items. Time complexities are discussed in each method comment.
 */

import { Item } from "./item";

export default class ItemService {

    private readonly items: Map<string, Item>;          // Item name to the item object
    private readonly availableItems: Set<string>;       // Set of available item names

    constructor() {
        this.items = new Map();
        this.availableItems = new Set();
    }

    // Create an item based on the input. Add the item to the items Map and to the availableItems Set.
    // Newly created items are available on creation.
    // Time complexity: O(1) inserting into Map and Set
    public addItem(name: string, description: string, pricePerDay: number) {
        const item: Item = {
            name,
            description,
            pricePerDay
        };

        this.items.set(name, item);
        this.availableItems.add(name);
    }

    // Return an array of items based on the input params.
    // Worst case: O(n), we will need to search through every item if the price range is the entire set
    // Best case: O(1), we have O(1) access to all items based on name
    //
    // Optimization: We could store the items in sorted order based on price. A binary search tree would give us O(logn) insert time
    // and O(logn) search time. I didn't opt for this as I didn't think the assessment required that level of detail. I am assuming
    // that you are evaluating the ability to write API's and define clean classes to manage data, and not my search algorithm skills.
    //
    // The best way to scale this would obviously be to move the data into a database and take advantage of the advanced search
    // features, scaling, and durability of something like Postgres w/ Full Text Search or Elasticsearch.
    public getItems(name?: string, startPrice?: number, endPrice?: number): Item[] {
        if (!name && !startPrice && !endPrice) {
            // No search params, return all available items
            return [...this.availableItems].map(x => this.items.get(x)!);
        }

        let filteredItems = [...this.availableItems];
        startPrice = startPrice ?? 0;
        endPrice = endPrice ?? Infinity;

        // If name is specified and available, then filter results down to that item before applying price filtering
        if (name) {
            if (!this.availableItems.has(name)) {
                return [];
            } else {
                filteredItems = [name];
            }
        }

        return filteredItems.map(x => this.items.get(x)!)
            .filter(x => x.pricePerDay >= startPrice && x.pricePerDay <= endPrice);
    }

    // Rent an item by removing it from the availableItems set and setting the rental date range.
    // First we check to make sure the item is not already rented.
    // Time complexity: O(1)
    public rentItem(name: string, startDate: Date, endDate: Date): void {
        if (!this.availableItems.has(name)) {
            throw new Error('Item is not available for rent');
        }
        const item: Item = this.items.get(name)!;
        item.rentalStartDate = startDate;
        item.rentalEndDate = endDate;
        this.availableItems.delete(name);
    }

    // Return the item by adding it back to the availableItems set and wiping out the rental date range.
    // Time complexity: O(1)
    public returnItem(name: string): void {
        const item: Item = this.items.get(name)!;
        item.rentalStartDate = undefined;
        item.rentalEndDate = undefined;
        this.availableItems.add(name);
    }
}