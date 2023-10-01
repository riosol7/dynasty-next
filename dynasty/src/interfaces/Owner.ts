export interface Owner {
  user_id: string;
  settings: null;
  metadata: {
    [key: string]: string;
  };
  league_id: string;
  is_owner: boolean;
  is_bot: boolean;
  display_name: string;
  avatar: string;
};

export interface RivalryRecord {
  wins: number;
  losses: number;
  opponentID: number;
  rank: number
}

export interface RivalryRecordProps {
  record: RivalryRecord;
};