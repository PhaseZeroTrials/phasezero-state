import { z } from 'zod';

import { IStudyUserRole } from '@pz/state';
import { IUserGroupAssociation } from '@pz/state';

export interface IUserType {
    id: string;
    value: string;
}

const UserType = z.object({
    id: z.string(),
    value: z.string(),
});

export interface IUserRole {
    id: string;
    value: string;
}

// Create a user role enum
export enum UserRoleEnum {
    Admin = '3c52f75e-33ab-4a0e-8815-c1f6c3c01034',
    Collaborator = 'bb9dc99f-3eb2-47fb-9ff7-f50f9e83adfc',
    ReadOnly = 'd2b2727f-6a8e-4c43-b646-e65f7b61b960',
}

const UserRole = z.object({
    id: z.string(),
    value: z.string(),
});

// Create a user role enum
export enum UserAccountStatusEnum {
    Pending = '1c9add31-3ad5-4b3a-a300-27da4647dbd8',
    Active = '4f78f03d-7225-46b5-b73f-b787def9ddce',
}

export interface IUserAccountStatus {
    id: string;
    value: string;
}

const UserAccountStatus = z.object({
    id: z.string(),
    value: z.string(),
});

export interface IUser {
    createdAt?: string;
    updatedAt?: string;
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    lastLoggedIn?: string;
    userTypeId?: string;
    userRoleId?: string;
    maxAssignedTask?: number;
    userAccountStatusId?: string;
    userType?: IUserType;
    userRole?: IUserRole;
    studyUserRole?: IStudyUserRole;
    studyUserRoleId?: number;
    userAccountStatus?: IUserAccountStatus;
    userGroupAssociations?: IUserGroupAssociation[];
    name?: string;
    admin: boolean;
    avatarUrl?: string;
    acsUserId?: string;
}

export const User = z.object({
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    id: z.number().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    lastLoggedIn: z.string().optional(),
    userTypeId: z.string().optional(),
    userRoleId: z.string().optional(),
    userAccountStatusId: z.string().optional(),
    userType: UserType.optional(),
    userRole: UserRole.optional(),
    // Stopping zod work here at User for now
    //studyUserRole: StudyUserRole.optional(),
    studyUserRoleId: z.number().optional(),
    userAccountStatus: UserAccountStatus.optional(),
    maxAssignedTask: z.number().optional(),
    //userGroupAssociations: UserGroupAssociation.array().optional(),
    name: z.string().optional(),
    admin: z.boolean(),
    avatarUrl: z.string().optional(),
    acsUserId: z.string().optional(),
});

const PartialUser = User.partial({
    id: true,
    phoneNumber: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    admin: true,
});
export type IPartialUser = z.infer<typeof PartialUser>;

export interface ICurrentUser {
    user: IUser;
}

export class CurrentUser implements ICurrentUser {
    user: IUser;

    constructor(currentUser: { user: IUser }) {
        this.user = currentUser.user;
    }
}
