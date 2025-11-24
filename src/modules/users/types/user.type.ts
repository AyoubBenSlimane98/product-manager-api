export type User = {
  user_id: string;
  username: string;
  email: string;
  is_blocked: boolean | null;
  created_at: Date | null;
};
export type UserResponse = {
  message: string;
  user: User;
};
