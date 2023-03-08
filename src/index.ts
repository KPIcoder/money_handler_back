import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import cors from 'cors';

import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import config from './utils/configs';
import { connectToDatabase, disconnectFromDatabase } from './utils/db';

const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);

const server = app.listen(config.PORT, async () => await connectToDatabase());

// --------------------------------------------

const signals = ['SIGTERM', 'SIGINT'];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    server.close();
    await disconnectFromDatabase();
    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
