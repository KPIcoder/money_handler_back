import Joi from 'joi';
import { LoginUser, RegisterUser } from '../DTOs/auth.dto';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../utils/constants';

const userSubSchema = {
  email: Joi.string().regex(EMAIL_REGEX).lowercase().required().messages({
    'string.pattern.base': 'Enter valid email',
    'string.base': 'Enter valid email',
    'string.empty': 'Email field cannot be empty',
    'any.required': 'Email is a required field',
  }),
  password: Joi.string().regex(PASSWORD_REGEX).required().messages({
    'string.pattern.base':
      'Password must be at least 8 characters long, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    'string.base':
      'Password must be at least 8 characters long, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    'string.empty': 'Password field cannot be empty',
    'any.required': 'Password is a required field',
  }),
};

export const loginUserValidator = Joi.object<LoginUser>({
  ...userSubSchema,
});

export const registerUserValidator = Joi.object<RegisterUser>({
  name: Joi.string().alphanum().min(2).max(30).required(),
  ...userSubSchema,
});
