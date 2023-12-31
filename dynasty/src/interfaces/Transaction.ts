import { Player } from ".";

interface WaiverBudget {
  sender: number;
  receiver: number;
  amount: number;
};

export interface Transaction {
  waiver_budget: WaiverBudget[];
  type: string;
  transaction_id: string;
  status_updated: number;
  status: string;
  settings: {
    waiver_bid: number;
    seq: number;
  };
  roster_ids: number[];
  metadata: {
    notes: string;
  };
  leg: number;
  drops: {
    [key: string]: any;
  };
  draft_picks: any[];
  creator: string;
  created: number;
  consenter_ids: number[];
  adds: {
    [key: string]: any;
  };
  players: Player[];
  waiver_player: Player;
};

export interface Waivers { 
  all?: Transaction[];
  QB: Transaction[];
  RB: Transaction[];
  WR: Transaction[];
  TE: Transaction[];
}

export interface WaiverBidProps {
  waivers: Waivers
}

export interface WaiverProps {
  waivers: Transaction[];
}