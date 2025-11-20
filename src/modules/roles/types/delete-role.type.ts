export type DeleteRoleResponse = {
  message: string;
  role: {
    role_id: string;
    name: string;
    created_at: Date | null;
  };
};
