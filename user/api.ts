import axios, { AxiosResponse } from 'axios';
import { logger } from '../../utils';
import { ICurrentUser, IPartialUser, IUser } from './model';

const getAllUsers = async () => {
    const { data } = await axios.get<IUser[]>(`/Users`);
    return data;
};

/**
 * Get all users which has userRoleId. If userRoleId is null, then the user is not part of the Workspace.
 * @returns filtered users which has userRoleId
 */
const getWorkSpaceUsers = async () => {
    const users = await getAllUsers();

    return users.filter((user) => {
        return user.userRoleId;
    });
};

const getUserById = async (id: number): Promise<IUser> => {
    const { data } = await axios.get(`Users/${id}`);
    return data;
};

const getUserByEmail = async (email: string): Promise<IUser> => {
    try {
        const { data } = await axios.get(`Users/email/${email}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getUserByPhoneNumber = async (phoneNumber: string): Promise<IUser> => {
    try {
        const { data } = await axios.get(`Users/phone/${phoneNumber}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getUsersByUserGroup = async (id: string): Promise<AxiosResponse<IUser[]>> => {
    return await axios.get(`/Users/userGroup/${id}`);
};

const createUser = async (user: any): Promise<AxiosResponse<IUser>> => {
    return await axios.post(`Users/`, user);
};

const resendInvite = async (user: any): Promise<AxiosResponse<IUser>> => {
    return await axios.post(`Auth/ReinviteUser/${user.email}`);
};

const updateUser = async (user: IPartialUser): Promise<IUser> => {
    const { data } = await axios.put(`/Users/`, user);
    return data;
};

const deleteUser = async (id: number): Promise<AxiosResponse<IUser>> => {
    return await axios.delete(`Users/${id}`);
};

const setCurrentUser = (currentUser: ICurrentUser | null): void => {
    if (currentUser === null) {
        localStorage.removeItem('currentUser');
    } else {
        // These are here primarily for convenience to support existing usages
        localStorage.setItem('name', currentUser?.user?.name || '');
        localStorage.setItem('email', currentUser?.user?.email || '');

        // This object represents the current user and their token
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
};

const getCurrentUser = (): ICurrentUser | null => {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || '');
    } catch {
        return null;
    }
};

const createAcsUser = async (): Promise<IUser> => {
    try {
        const { data } = await axios.post(`AcsUser/`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getAcsUserToken = async (): Promise<string> => {
    try {
        const { data } = await axios.get(`AcsUser/token`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    createAcsUser,
    getAcsUserToken,
    createUser,
    updateUser,
    deleteUser,
    resendInvite,
    getAllUsers,
    getWorkSpaceUsers,
    getUserById,
    getUserByEmail,
    getUserByPhoneNumber,
    getUsersByUserGroup,
    setCurrentUser,
    getCurrentUser,
};
