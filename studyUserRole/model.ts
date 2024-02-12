import { IUser, IUserRole } from '../user';

export interface IStudyUserRole {
    id?: number;
    studyId: number;
    user: IUser;
    userId?: number;
    userRole?: IUserRole;
    userRoleId?: string;
}
