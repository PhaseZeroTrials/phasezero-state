import axios, { AxiosResponse } from 'axios';
import { IUserRole } from '../user';

const getUserRoles = async (): Promise<AxiosResponse<IUserRole[]>> => {
    return await axios.get(`/UserRoles`);
};

export default {
    getUserRoles,
};
