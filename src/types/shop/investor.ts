// This is an investor item that people by in the shop

export interface Investor {
    name: string; // Name of the investor object
    price: number; // Price at which it's bought
    purpose: string; // It's purpose
    amnt: number; // The amount bought on a certain date
    date: string; // This is the date that it's last applied to your tokens
    reward: number; // This is the amount of money one investor item brings each day
}