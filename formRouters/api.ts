import axios from 'axios';
import { IFormRouter } from './model';

const getFormRouter = async (url: string): Promise<IFormRouter> => {
    const config = {};
    const { data } = await axios.get(`/FormRouters/${url}`, config);
    return data;
};

const getFormRouterFromDomain = async (domainPrefix: string, path: string): Promise<IFormRouter> => {
    if (path == '' || path == null) {
        path = '/';
    }
    const { data } = await axios.get(`/FormRouters/domain?domainName=${domainPrefix}&path=${path}`);
    return data;
};

export default {
    getFormRouter,
    getFormRouterFromDomain,
};
