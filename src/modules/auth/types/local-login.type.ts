import { TokenPair } from '../jwt/interface/jwt.token';

export type LocalLoginResponse = {
  message: string;
  user_id: string;
  tokens: TokenPair;
};
