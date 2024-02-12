import axios, { AxiosResponse } from 'axios';
import { IUser } from '../user';
import { IUserGroupAssociation } from './model';

const getAllUserGroupAssociations = async (): Promise<AxiosResponse<IUserGroupAssociation[]>> => {
    return await axios.get(`/UserGroupAssociations`);
};

const getUserGroupAssociationById = async (id: Guid): Promise<AxiosResponse<IUserGroupAssociation>> => {
    return await axios.get(`/UserGroupAssociations/${id}`);
};

const getUserGroupAssociationsByUserId = async (userId: number): Promise<AxiosResponse<IUserGroupAssociation[]>> => {
    return await axios.get(`UserGroupAssociations/user/${userId}`);
};

const getUserGroupAssociationsByUserGroupId = async (
    userGroupId: Guid,
): Promise<AxiosResponse<IUserGroupAssociation[]>> => {
    return await axios.get(`UserGroupAssociations/userGroup/${userGroupId}`);
};

const createUserGroupAssociation = async (userGroupAssociation: any): Promise<AxiosResponse<IUserGroupAssociation>> => {
    return await axios.post(`UserGroupAssociations/`, userGroupAssociation);
};

const createUserGroupAssociations = async (userGroupIds: Guid[], userId: number) => {
    if (userGroupIds.length == 0) {
        return [];
    }

    const results = await axios.all<AxiosResponse<IUserGroupAssociation>>(
        userGroupIds.map((userGroupId) => {
            return axios.post(`UserGroupAssociations/`, { userGroupId, userId });
        }),
    );

    return results.map((result) => result.data);
};

const updateUserGroupAssociation = async (
    userGroupAssociation: IUserGroupAssociation,
): Promise<AxiosResponse<IUserGroupAssociation>> => {
    return await axios.put(`UserGroupAssociations/`, userGroupAssociation);
};

const updateUserGroupAssociations = async (userGroupIds: Guid[], user: IUser) => {
    const userGroupAssociations: IUserGroupAssociation[] = user.userGroupAssociations || [];

    // Find the ids that are in both the existing associations and incoming
    const inBoth: Guid[] = [];
    const associationIdsToRemove: Guid[] = [];
    userGroupAssociations.forEach((association) => {
        if (userGroupIds.includes(association.userGroupId)) {
            inBoth.push(association.userGroupId);
        } else {
            // If an item is NOT in the incoming, then set it to be removed
            associationIdsToRemove.push(association.id);
        }
    });

    // Only add the ids that are incoming but not in both.
    const idsToAdd = userGroupIds.filter((item) => !inBoth.includes(item));

    await deleteUserGroupAssociations(associationIdsToRemove);
    if (user.id) {
        await createUserGroupAssociations(idsToAdd, user.id);
    }
};

const deleteUserGroupAssociation = async (id: Guid): Promise<AxiosResponse<IUserGroupAssociation>> => {
    return await axios.delete(`UserGroupAssociations/${id}`);
};

const deleteUserGroupAssociations = async (userGroupIds: Guid[]) => {
    if (userGroupIds.length == 0) {
        return [];
    }

    const results = await axios.all<AxiosResponse<IUserGroupAssociation>>(
        userGroupIds.map((id) => {
            return axios.delete(`UserGroupAssociations/${id}`);
        }),
    );

    return results.map((result) => result.data);
};

export default {
    createUserGroupAssociation,
    deleteUserGroupAssociation,
    getAllUserGroupAssociations,
    getUserGroupAssociationById,
    getUserGroupAssociationsByUserId,
    getUserGroupAssociationsByUserGroupId,
    updateUserGroupAssociation,
    updateUserGroupAssociations,
};
