// interface RatingEntry {
//     date: string;
//     value: number;
// }
  
export interface Owner {
  user_id: string;
  settings: null; // Update this type as per your data
  metadata: {
    [key: string]: string;
  };
  league_id: string;
  is_owner: boolean;
  is_bot: boolean;
  display_name: string;
  avatar: string;
};