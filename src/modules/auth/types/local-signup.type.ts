export type SignupResponseApi = {
  message: string;
  user: {
    user_id: string | null;
    created_at: Date | null;
  };
  // tokens: {
  //   access_token: string | null;
  //   refresh_token: string | null;
  // };
};
