import { GENDER } from '../../../core/constants';

export interface IUserPayload {
  fullname?: string;
  dateOfBirth?: Date;
  gender?: GENDER;
  address?: string;
  email?: string;
  departmentId?: number;
  startDate?: Date;
  endDate?: Date;
  avatar?: string;
  department?: {
    id?: number;
    name?: string;
  };
  accounts?: IAccountPayload[];
}

export interface IAccountPayload {
  id?: number;
  roleId?: number;
  phonenumber?: string;
  password?: string;
}

export interface IAccountData {
  payload: {
    role: string;
  };
}
export interface IProfile extends IUserPayload {
}
