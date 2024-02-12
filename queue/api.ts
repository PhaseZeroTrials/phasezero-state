import axios from 'axios';
import { z } from 'zod';

import { Task } from '../tasks/api';
import { logger } from '@pz/utils';

// Have QueueTask extend Task zod
export const QueueTask = Task.extend({
    queueId: z.string().optional(),
    // TODO: This should be using Message optional but doesn't seem to work
    lastMessage: z.any().optional(),
});

export type IQueueTask = z.infer<typeof QueueTask>;

// When creating a task we want the QueueTask type, minus an id since
// it hasn't been created yet.
const PartialQueueTask = QueueTask.partial({
    id: true,
    groupOrder: true,
    createdAt: true,
    updatedAt: true,
});
export type IPartialQueueTask = z.infer<typeof PartialQueueTask>;

export type QueueTaskQueryParams = {
    studyId?: number;
    status?: Guid[];
    assignee?: number[];
    subject?: number[];
};

export const Queue = z.object({
    // Can enforce string lengths
    id: z.string(),
    name: z.string(),
    color: z.string().optional(),
    description: z.string().optional(),
    studyId: z.number().optional(),
    isPublic: z.boolean().optional(),
    queueTasks: QueueTask.array().optional(),
    attachedFormId: z.number().optional(),
    openTaskCount: z.number().optional(),
});
export type IQueue = z.infer<typeof Queue>;

// When creating a queue, we want the Queue type, minus an id since
// it hasn't been created yet.

const PartialQueue = Queue.partial({ id: true });
export type IPartialQueue = z.infer<typeof PartialQueue>;

const getQueueById = async (id: Guid) => {
    try {
        const { data } = await axios.get(`Queues/${id}`);
        return Queue.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getQueuesByStudyId = async (studyId: number) => {
    const { data } = await axios.get(`Queues/study/${studyId}`);
    return Queue.array().parse(data);
};

const createQueue = async (queue: IPartialQueue) => {
    const partialQueue = PartialQueue.parse(queue);
    const { data } = await axios.post(`Queues/`, partialQueue);
    return Queue.parse(data);
};

const updateQueue = async (queue: IPartialQueue) => {
    const { data } = await axios.put(`Queues/`, queue);
    return Queue.parse(data);
};

const deleteQueue = async (id: Guid) => {
    const { data } = await axios.delete(`Queues/${id}`);

    return Queue.parse(data);
};

const getQueueTaskById = async (id: Guid): Promise<IQueueTask> => {
    try {
        const { data } = await axios.get(`QueueTasks/${id}`);
        return QueueTask.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getQueueTasksByQueueId = async (queueId: Guid, queryParam?: QueueTaskQueryParams): Promise<IQueueTask[]> => {
    try {
        let endpoint = `QueueTasks/queue/${queueId}`;

        if (queryParam) {
            const urlParams = generateUrlParams(queryParam);
            endpoint += `/?${urlParams.toString()}`;
        }

        const { data } = await axios.get(endpoint);
        return QueueTask.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getQueueTasks = async (queryParam?: QueueTaskQueryParams): Promise<IQueueTask[]> => {
    try {
        let endpoint = `QueueTasks`;

        if (queryParam) {
            const urlParams = generateUrlParams(queryParam);
            endpoint += `/?${urlParams.toString()}`;
        }

        const { data } = await axios.get(endpoint);
        // Allow for empty array
        if (data.length == 0) {
            return [];
        }
        return QueueTask.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const generateUrlParams = (queryParam?: QueueTaskQueryParams) => {
    const urlParams = new URLSearchParams();

    if (queryParam?.studyId) {
        urlParams.append('studyId', queryParam.studyId.toString());
    }

    queryParam?.status?.forEach((status) => urlParams.append('status', status));
    queryParam?.assignee?.forEach((assignee) => urlParams.append('assignee', assignee.toString()));
    queryParam?.subject?.forEach((subject) => urlParams.append('subject', subject?.toString()));

    return urlParams;
};

const createQueueTask = async (queueTaskInfo: IPartialQueueTask) => {
    const partialQueueTask = PartialQueueTask.parse(queueTaskInfo);
    const { data } = await axios.post(`QueueTasks/`, partialQueueTask);
    return QueueTask.parse(data);
};

// TODO: Move this into Tasks, currently this is only used when bulk updating
// queue tasks on the board.
const updateQueueTasks = async (queueTasks: IQueueTask[]) => {
    if (queueTasks.length == 0) {
        return [];
    }

    const results = await axios.all(
        queueTasks.map((task) => {
            return axios.put(`Tasks/`, task);
        }),
    );

    return QueueTask.array().parse(results.map((result) => result.data));
};

const getAllQueues = async () => {
    try {
        const { data } = await axios.get(`Queues`);
        return Queue.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getAllQueues,
    getQueueById,
    createQueue,
    updateQueue,
    deleteQueue,
    createQueueTask,
    getQueueTasks,
    getQueuesByStudyId,
    getQueueTaskById,
    getQueueTasksByQueueId,
    updateQueueTasks,
};
