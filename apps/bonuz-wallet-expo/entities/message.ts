import { User } from './user';

export interface Message {
  id: string;
  message: string;
  createdAt: Date;
  user: Pick<User, 'id' | 'handle' | 'smartAccountAddress'>;
}
