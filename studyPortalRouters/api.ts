import axios from 'axios';
import { IStudyPortalRouter } from './model';

const getStudyPortalRouter = async (url: string): Promise<IStudyPortalRouter> => {
    const { data } = await axios.get(`/StudyPortalRouters/${url}`);
    return data;
};

export default {
    getStudyPortalRouter,
};
