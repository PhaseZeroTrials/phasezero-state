import axios from 'axios';
import { z } from 'zod';

import { DateOrString } from '../common';
import { logger } from '../../utils';

export const Study = z.object({
    id: z.number(),
    name: z.string(),
    acronym: z.string(),
    expected_enrollment: z.number().optional(),
    start_date: DateOrString.optional(),
    end_date: DateOrString.optional(),
    createdAt: DateOrString,
    totalForms: z.number().optional(),
    totalParticipants: z.number().optional(),
    portalUrl: z.string().optional(),
});

export type IStudy = z.infer<typeof Study>;

async function getStudies(): Promise<IStudy[]> {
    try {
        const { data } = await axios.get(`/studies`);
        return Study.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getStudy(id: number): Promise<IStudy> {
    try {
        const { data } = await axios.get(`/studies/${id}`);
        return Study.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteStudy(record: IStudy): Promise<IStudy> {
    try {
        const { data } = await axios.delete(`/studies/${record.id}`);
        return Study.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateStudy(record: IStudy): Promise<IStudy> {
    try {
        const { data } = await axios.put(`/studies/`, record);
        return Study.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getStudies,
    getStudy,
    deleteStudy,
    updateStudy,
};
