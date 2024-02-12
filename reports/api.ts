import axios from 'axios';
import { logger } from '@pz/utils';
const getReportForSubject = async (subject: number, formResponseIds: Array<Guid>) => {
    try {
        const { data } = await axios.post(`Reports/subject/${subject}`, formResponseIds);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const downloadReport = async (reportId: Guid, tenantId: Guid) => {
    try {
        const { data } = await axios.get(`Reports/${reportId}/tenant/${tenantId}/download`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getReportForSubject,
    downloadReport,
};
