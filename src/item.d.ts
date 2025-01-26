export interface Item {
    name: string;
    description: string;
    pricePerDay: number;
    rentalStartDate?: Date;
    rentalEndDate?: Date;
}