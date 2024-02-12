import { IUser } from '../user';
import { IUserGroup } from '@pz/state';

export interface IUserGroupAssociation {
    id: Guid;
    userId: number;
    user?: IUser;
    userGroupId: Guid;
    userGroup?: IUserGroup;
    createdAt?: string;
    updatedAt?: string;
}
