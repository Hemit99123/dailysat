interface InvestorObj {
    name: string;
    price: number;
    purpose: string;
    amnt: number;
    date: string;
    reward: number;
};

export interface InvestorItem {
    _id: string;
    investors: InvestorObj[];
};