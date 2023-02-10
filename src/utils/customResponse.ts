import { Response } from 'express';

export function customResponse<T>(res: Response, statusCode: number, statusText: string, data?: T, dataCount?: number) {
  res.status(statusCode).json({
    statusCode,
    statusText,
    data,
    dataCount,
  });

  return;
}
