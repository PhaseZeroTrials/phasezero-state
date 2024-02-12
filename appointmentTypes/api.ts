import axios from 'axios';
import { z } from 'zod';
import { logger } from '../../utils';
import { Form } from '../forms';

export const AppointmentType = z.object({
    id: z.string(),
    studyId: z.number(),
    name: z.string(),
    description: z.string().optional(),
    duration: z.number(),
    color: z.string(),
    forms: z.array(Form).optional(),
    queueId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export type IAppointmentType = z.infer<typeof AppointmentType>;

const PartialAppointmentType = AppointmentType.partial({ id: true });
export type IPartialAppointmentType = z.infer<typeof PartialAppointmentType>;

const getAppointmentTypes = async (): Promise<IAppointmentType[]> => {
    try {
        const { data } = await axios.get(`AppointmentTypes`);
        return AppointmentType.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getAppointmentType = async (id: Guid): Promise<IAppointmentType> => {
    try {
        const { data } = await axios.get(`AppointmentTypes/${id}`);
        return AppointmentType.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getAppointmentTypesForStudy = async (id: number): Promise<IAppointmentType[]> => {
    try {
        const { data } = await axios.get(`AppointmentTypes/study/${id}`);
        return AppointmentType.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updateAppointmentType = async (appointmentType: IAppointmentType) => {
    try {
        const { data } = await axios.put(`AppointmentTypes`, appointmentType);
        return AppointmentType.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const createAppointmentType = async (appointmentType: IPartialAppointmentType) => {
    try {
        const { data } = await axios.post(`AppointmentTypes`, appointmentType);
        return AppointmentType.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const deleteAppointmentType = async (id: Guid): Promise<IAppointmentType> => {
    try {
        const { data } = await axios.delete(`AppointmentTypes/${id}`);
        return AppointmentType.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getAppointmentTypes,
    getAppointmentType,
    getAppointmentTypesForStudy,
    updateAppointmentType,
    createAppointmentType,
    deleteAppointmentType,
};
