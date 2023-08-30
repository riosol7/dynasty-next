interface WaiverBudget {
    sender: number;
    receiver: number;
    amount: number;
};

export interface Transaction {
    type: string;
    transaction_id: string;
    status_updated: number;
    status: string;
    settings: {
        roster_ids: string[];
        metadata: {
            leg: number;
        };
        drops: {
            [key: string]: any;
        };
        draft_picks: any[];
        creator: string;
        created: number;
        consenter_ids: string[];
        adds: {
            [key: string]: any;
        };
    };
    waiver_budget: WaiverBudget[];
}