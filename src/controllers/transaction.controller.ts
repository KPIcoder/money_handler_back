import { NextFunction, Request, Response } from 'express';
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
} from '../services/transaction.service';
import { customResponse } from '../utils/customResponse';

export default {
  getTransactions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await getAllTransactions();

      return customResponse(res, 200, 'Success', transactions);
    } catch (error) {
      customResponse(res, 500, 'Error');
    }
  },

  addTransaction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTransaction = await addTransaction(req.body);

      return customResponse(res, 200, 'Success', newTransaction);
    } catch (error) {
      customResponse(res, 500, 'Error');
    }
  },

  deleteTransaction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.query.id;

      if (!id || typeof id !== 'string') return customResponse(res, 400, 'Invalid id');
      const parsedId = parseInt(id);

      await deleteTransaction(parsedId);

      return customResponse(res, 200, 'Success');
    } catch (error) {
      customResponse(res, 500, 'Error');
    }
  },

  updateTransaction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = req.body;

      if (!transaction || typeof transaction !== 'object') return customResponse(res, 400, 'Invalid transaction data');

      const updatedTransaction = await updateTransaction(transaction);

      return customResponse(res, 200, 'Success', transaction);
    } catch (error) {
      customResponse(res, 500, 'Error');
    }
  },
};
