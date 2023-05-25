import mongoose from 'mongoose';
import configs from './configs';

export async function connectToDatabase() {
  try {
    await mongoose.connect(configs.DB_URL);
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
  return;
}
