import bcrypt from 'bcrypt';

export default {
  hashPassword: async (password: string) => await bcrypt.hash(password, 10),
  comparePasswords: async (password: string, hashedPassword: string) => await bcrypt.compare(password, hashedPassword),
};
