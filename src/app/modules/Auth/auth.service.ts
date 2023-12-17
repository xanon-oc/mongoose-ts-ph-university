import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user exists
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // // checking if the user blocked

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched!');
  }
  // // Access Granted send : AccessToken , RefreshToken
  // create token and send to the user

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '10d',
  });

  // console.log(payload);
  return { accessToken, needsPasswordChange: user?.needsPasswordChange };
};

// change password

const changePassword = async (
  user: { userId: string; role: string },
  payload,
) => {
  const result = await User.findOneAndUpdate({
    id: user.userId,
    role: user.role,
  });

  return result;
};
export const AuthServices = { loginUser, changePassword };
