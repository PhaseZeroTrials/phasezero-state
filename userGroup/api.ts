import axios from 'axios';
import { IUserGroup } from './model';

const getAllUserGroups = async (): Promise<IUserGroup[]> => {
    const { data } = await axios.get(`/UserGroups`);
    return data;
};

const getUserGroupById = async (id: Guid): Promise<IUserGroup> => {
    const { data } = await axios.get(`/UserGroups/${id}`);
    return data;
};

const getUserGroupsByStudyId = async (studyId: number): Promise<IUserGroup[]> => {
    const { data } = await axios.get(`UserGroups/study/${studyId}`);
    return data;
};

const getUserGroupsByUserId = async (userId: number): Promise<IUserGroup[]> => {
    const { data } = await axios.get(`UserGroups/user/${userId}`);
    return data;
};

const createUserGroup = async (userGroup: any): Promise<IUserGroup> => {
    const { data } = await axios.post(`UserGroups/`, userGroup);
    return data;
};

const updateUserGroup = async (userGroup: IUserGroup): Promise<IUserGroup> => {
    const { data } = await axios.put(`UserGroups/`, userGroup);
    return data;
};

const deleteUserGroup = async (id: string): Promise<IUserGroup> => {
    const { data } = await axios.delete(`UserGroups/${id}`);
    return data;
};

export default {
    createUserGroup,
    updateUserGroup,
    deleteUserGroup,
    getAllUserGroups,
    getUserGroupById,
    getUserGroupsByStudyId,
    getUserGroupsByUserId,
};
