export type AllRolesResponse = {
  message: string;
  roles: {
    role_id: string;
    name: string;
    description: string | null;
  }[];
};
