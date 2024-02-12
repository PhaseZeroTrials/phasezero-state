import axios from 'axios';
import { z } from 'zod';
import { DateOrString } from '../common';
import { ParsedFormResponse } from '../formResponses';
import { logger } from '@pz/utils';

export const PatientChartConfig = z.object({
    id: z.string(),
    studyId: z.number(),
    subjectId: z.number().optional(),
    identifier: z.string(),
    subjectTrialTaskParsedFormResponses: ParsedFormResponse.array().optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
});
export type IPatientChartConfig = z.infer<typeof PatientChartConfig>;

// When creating a task we want the QueueTask type, minus an id since
// it hasn't been created yet.
const PartialPatientChartConfig = PatientChartConfig.partial({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type IPartialPatientChartConfig = z.infer<typeof PartialPatientChartConfig>;

const createPatientChartConfig = async (
    patientChartConfig: IPartialPatientChartConfig,
): Promise<IPatientChartConfig> => {
    try {
        const { data } = await axios.post('/PatientChartConfig', patientChartConfig);
        return PatientChartConfig.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const bulkCreateOrUpdatePatientChartConfig = async (
    studyId: number,
    patientChartConfigs: IPartialPatientChartConfig[],
): Promise<IPatientChartConfig[]> => {
    try {
        const { data } = await axios.post(`/PatientChartConfig/study/${studyId}/bulk`, patientChartConfigs);
        return PatientChartConfig.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getPatientChartSummaryBySubjectId = async (subjectId: number): Promise<IPatientChartConfig[]> => {
    try {
        const { data } = await axios.get(`/PatientChartSummary/subject/${subjectId}`);
        return PatientChartConfig.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    createPatientChartConfig,
    getPatientChartSummaryBySubjectId,
    bulkCreateOrUpdatePatientChartConfig,
};
