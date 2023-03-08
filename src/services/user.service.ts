import authUsersSchema from '../database schemas/authUsers.schema';

export async function getUsers() {
  return authUsersSchema.find();
}
