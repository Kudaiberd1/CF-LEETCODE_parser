import type { NextFunction, Response } from 'express';
import type { FetchUserDataRequest } from '../types';

export function buildUserRequestContext(
  req: FetchUserDataRequest,
  _res: Response,
  next: NextFunction,
): void {
  req.body = {
    username: req.params.username,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    year: req.query.year ? parseInt(req.query.year as string, 10) : 0,
  };
  next();
}
