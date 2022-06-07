declare namespace Express {
  export interface Request {
    userIdToken: number;
    isAdminToken: boolean;
  }
}