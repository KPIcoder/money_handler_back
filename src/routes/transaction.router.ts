import express from 'express';
import transactionController from '../controllers/transaction.controller';

const transactionRouter = express.Router();

transactionRouter.get('/', transactionController.getTransactions);
transactionRouter.post('/', transactionController.addTransaction);
transactionRouter.delete('/', transactionController.deleteTransaction);
transactionRouter.put('/', transactionController.updateTransaction);

export default transactionRouter;
