import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';

import authRouter from './routes/auth.router';
import config from './utils/configs';
import { connectToDatabase, disconnectFromDatabase } from './utils/db';

const app: Application = express();

app.use(helmet());

app.use(express.json());
app.use('/auth', authRouter);

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
