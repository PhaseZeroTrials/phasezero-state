import axios from 'axios';
import { z } from 'zod';
import { logger } from '../../utils';
import { AppointmentType } from '../appointmentTypes';
import { Subject } from '../subjects';
import { User } from '../user';
import { FormResponse } from '../formResponses';
import { DateOrString } from '../common';

export const AppointmentStatus = {
    Booked: 'dfa76cdf-99b0-45c4-87e7-3cb3d515388c',
    NoShow: '11cb243f-23d9-44e0-a3d5-5d3cfc17b8e4',
    Completed: 'e00b97f4-d8dc-4054-b996-4319bd8e4f5f',
    Canceled: '2b95f22a-21fa-4fef-9b8f-a13ebe09c0f6',
};

export const AppointmentStatusCopy = {
    [AppointmentStatus.Booked]: 'Booked',
    [AppointmentStatus.NoShow]: 'No Show',
    [AppointmentStatus.Completed]: 'Completed',
    [AppointmentStatus.Canceled]: 'Canceled',
};

export type AppointmentQueryParams = {
    users?: number[];
    startAt?: Date;
    endAt?: Date;
};

export const AppointmentTask = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    subjectId: z.number().optional(),
    subject: Subject.optional(),
    taskStatusId: z.string(),
    assigneeId: z.number().optional(),
    assignee: User.optional(),
    formId: z.number().optional(),
    subjectTaskFormResponses: FormResponse.array().optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
});
export type IAppointmentTask = z.infer<typeof AppointmentTask>;

const PartialAppointmentTask = AppointmentTask.partial({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type IPartialAppointmentTask = z.infer<typeof PartialAppointmentTask>;

export const Appointment = z.object({
    id: z.string(),
    name: z.string(),
    startAt: z.string(),
    endAt: z.string(),
    duration: z.number().optional(),
    appointmentTypeId: z.string(),
    appointmentType: AppointmentType.optional(),
    appointmentStatusId: z.string(),
    subjectId: z.number().optional(),
    assigneeId: z.number().optional(),
    appointmentTask: AppointmentTask.optional(),
    taskId: z.string().optional(),
    status: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export type IAppointment = z.infer<typeof Appointment>;

const PartialAppointment = Appointment.partial({ id: true, name: true });
export type IPartialAppointment = z.infer<typeof PartialAppointment>;

const getAllAppointments = async (queryParam?: AppointmentQueryParams): Promise<IAppointment[]> => {
    try {
        let endpoint = `Appointments`;
        const urlParams = new URLSearchParams();
        queryParam?.users?.forEach((user) => urlParams.append('users', user?.toString()));
        queryParam?.startAt && urlParams.append('startAt', queryParam.startAt?.toISOString());
        queryParam?.endAt && urlParams.append('endAt', queryParam.endAt?.toISOString());

        if (queryParam) {
            endpoint += `/?${urlParams.toString()}`;
        }

        const { data } = await axios.get(endpoint);
        return Appointment.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getAppointment = async (id: Guid): Promise<IAppointment> => {
    try {
        const { data } = await axios.get(`Appointments/${id}`);
        return Appointment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updateAppointment = async (appointment: IPartialAppointment) => {
    try {
        const { data } = await axios.put(`Appointments`, appointment);
        return Appointment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const createAppointment = async (appointment: IPartialAppointment) => {
    try {
        const { data } = await axios.post(`Appointments`, appointment);
        return Appointment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const deleteAppointment = async (id: Guid) => {
    try {
        const { data } = await axios.delete(`Appointments/${id}`);
        return PartialAppointment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getAllAppointments,
    getAppointment,
    updateAppointment,
    createAppointment,
    deleteAppointment,
};
