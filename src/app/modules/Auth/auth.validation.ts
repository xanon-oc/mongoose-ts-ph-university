import { z } from 'zod';
const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'You have to provide the user id!' }),
    password: z.string({
      required_error: 'You have to provide the user password!',
    }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'You have to provide the old password!',
    }),
    newPassword: z.string({
      required_error: 'You have to provide the user password!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
