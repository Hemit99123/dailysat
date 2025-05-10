export type ShopItem = {
    price: number;
    name: string;
    purpose: string;
    amnt?: number;
    date?:string;
    reward?: number;
    // "price": price (number)
    // "amnt": # of specific item the user has (number)
    // "name": name of the item (string)
    // "purpose": what the item does (string)
    // "date": the date is was bought, for investor items
    // "reward": the reward that comes from the item, for investor items
}
