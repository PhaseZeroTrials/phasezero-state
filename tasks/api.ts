import axios from 'axios';
import { z } from 'zod';

import { Subject } from '../subjects';
import { User } from '../user';
import { FormResponse } from '../formResponses';
import { DateOrString } from '../common';
import { logger } from '@pz/utils';

export enum TaskType {
    AppointmentTask = 'dd32f8b0-7a89-4c68-a97a-0026c37125f0',
    QueueTask = 'ff5e3078-6e5c-4317-ac96-7a19d778dde7',
    TrialTask = '1c57f17c-3896-4ceb-8fee-9b64ec877998',
}

export const Task = z.object({
    id: z.string(),
    queueId: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    subjectId: z.number().optional(),
    subject: Subject.optional(),
    taskStatusId: z.string(),
    taskTypeId: z.string().optional(),
    assigneeId: z.number().optional(),
    assignee: User.optional(),
    creatorId: z.number().optional(),
    creator: User.optional(),
    groupOrder: z.number().optional(),
    formId: z.number().optional(),
    subjectTaskFormResponses: FormResponse.array().optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
});
export type ITask = z.infer<typeof Task>;

// When creating a task we want the Task type, minus an id since
// it hasn't been created yet.
const PartialTask = Task.partial({
    queueId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type IPartialTask = z.infer<typeof PartialTask>;

const getTaskById = async (id: Guid) => {
    try {
        const { data } = await axios.get(`/Tasks/${id}`);
        return Task.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updateTask = async (task: IPartialTask) => {
    try {
        const { data } = await axios.put(`/Tasks`, task);
        return Task.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const deleteTask = async (id: Guid) => {
    try {
        const { data } = await axios.delete(`Tasks/${id}`);
        return Task.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    deleteTask,
    getTaskById,
    updateTask,
};
