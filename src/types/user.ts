export interface User {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  [key: string]: unknown;
}
