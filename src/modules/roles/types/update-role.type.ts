export type UpdateRoleResponse = {
  message: string;
  role: {
    role_id: string;
    name: string;
    description: string | null;
    updated_at: Date | null;
  };
};
