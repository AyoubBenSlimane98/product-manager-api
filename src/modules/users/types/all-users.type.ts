import { User } from './user.type';

export type AllUsersResponse = {
  message: string;
  users: User[];
};
