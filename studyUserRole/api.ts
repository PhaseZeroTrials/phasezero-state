import axios from 'axios';
import { IStudyUserRole } from './model';

export enum UserRoleEnum {
    Owner = '3c52f75e-33ab-4a0e-8815-c1f6c3c01034',
    Collaborator = 'bb9dc99f-3eb2-47fb-9ff7-f50f9e83adfc',
    ReadOnly = 'd2b2727f-6a8e-4c43-b646-e65f7b61b960',
}

export const UserRoleMap = {
    [UserRoleEnum.Owner]: {
        Id: UserRoleEnum.Owner,
        Value: 'Owner',
    },
    [UserRoleEnum.Collaborator]: {
        Id: UserRoleEnum.Collaborator,
        Value: 'Collaborator',
    },
    [UserRoleEnum.ReadOnly]: {
        Id: UserRoleEnum.ReadOnly,
        Value: 'ReadOnly',
    },
};

async function getStudyUserRoleForStudy(studyId: number): Promise<IStudyUserRole[]> {
    const { data } = await axios.get(`StudyUserRoles/study/${studyId}`);
    return data;
}

async function getStudyUserRoleForStudyAndUser(studyId: number, userId: number): Promise<IStudyUserRole | undefined> {
    try {
        const { data } = await axios.get(`StudyUserRoles/study/${studyId}/user/${userId}`);
        return data;
    } catch (error) {
        return undefined;
    }
}

async function inviteUserToStudy(studyUserRole: IStudyUserRole) {
    return await axios.post(`StudyUserRoles`, studyUserRole);
}

async function updateStudyUserRole(studyUserRole: IStudyUserRole) {
    return await axios.put(`StudyUserRoles`, studyUserRole);
}

async function deleteStudyUserRole(userRoleId: number) {
    return await axios.delete(`StudyUserRoles/${userRoleId}`);
}

export default {
    getStudyUserRoleForStudy,
    getStudyUserRoleForStudyAndUser,
    inviteUserToStudy,
    updateStudyUserRole,
    deleteStudyUserRole,
};
