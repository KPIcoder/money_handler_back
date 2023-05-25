import { pool } from '../utils/db';

type Transaction = {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  transaction_type: 'expense' | 'profit';
  transaction_date: Date;
  description?: string;
};

export async function getAllTransactions() {
  const transactionsQuery = await pool.query<Transaction>('select * from l_transaction');
  return transactionsQuery.rows;
}

export async function addTransaction(transaction: Transaction) {
  const { user_id, category_id, amount, transaction_type, description = '' } = transaction;

  const addTransactionQuery = await pool.query<Transaction>(
    `
        insert into l_transaction
        values($1, $2, $3, $4, now(), $6)
        returning *
    `,
    [user_id, category_id, amount, transaction_type, description]
  );
  return addTransactionQuery.rows[0];
}

export async function deleteTransaction(id: number) {
  pool.query(
    `
        deleete from l_transaction 
        where id = $1
    `,
    [id]
  );
}

export async function updateTransaction(transaction: Transaction) {
  const { id, category_id, amount, transaction_type, description = '' } = transaction;
  const updateTransactionQuery = await pool.query<Transaction>(
    `
            update l_transaction
            set 
                category_id = $1,
                amount = $2,
                transaction_type = $3,
                description = $4
            where id = $5
            returning *
        `,
    [category_id, amount, transaction_type, description, id]
  );
  return updateTransactionQuery.rows[0];
}
