interface RatingEntry {
    date: string;
    value: number;
}
  
export interface Owner {
    _id: string;
    user_id: string;
    settings: null | any;
    league_id: string;
    is_owner: boolean;
    is_bot: boolean;
    display_name: string;
    avatar: string;
    roster_id: number;
    team_name: string;
    exp: number;
    te_rating: RatingEntry[];
    team_rating: RatingEntry[];
    qb_rating: RatingEntry[];
    rb_rating: RatingEntry[];
    wr_rating: RatingEntry[];
};

export interface OwnerContextType {
    owners: Owner[];
    loadOwners: boolean;
};
