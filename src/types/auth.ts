export type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
  publishedAt: string;
};

export type Auth = {
  jwt: string;
  user: User;
};
