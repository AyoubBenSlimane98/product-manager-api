export type LocalSignupResponse = {
  message: string;
  user: {
    user_id: string | null;
    username: string;
    created_at: Date | null;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
};
