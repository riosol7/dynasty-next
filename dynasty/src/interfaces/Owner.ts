// interface RatingEntry {
//     date: string;
//     value: number;
// }
  
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

export const initialOwner: Owner = {
  user_id: "",
  settings: null,
  metadata: {
    "": "",
  },
  league_id: "",
  is_owner: false,
  is_bot: false,
  display_name: "",
  avatar: ","
}