import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialQueue, IPartialQueueTask, IQueue, IQueueTask, QueueTaskQueryParams } from './api';

const queueQueryKeys = {
    all: ['queue'] as const,
    id: (id: Guid) => [...queueQueryKeys.all, id] as const,
    study: () => [...queueQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...queueQueryKeys.study(), id] as const,
};

export const useQueuesByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(
        queueQueryKeys.studyId(studyId),
        () => {
            return api.getQueuesByStudyId(studyId);
        },
        {
            ...options,
            onSuccess: (queues) => {
                options && options?.onSuccess && options.onSuccess(queues);
            },
        },
    );

export const useCreateQueue = (options) => {
    const queryClient = useQueryClient();

    return useMutation(
        (queueInfo: IPartialQueue) => {
            return api.createQueue(queueInfo);
        },
        {
            ...options,
            onSuccess: (queue) => {
                // Go ahead and add this to the id collection.
                options && options?.onSuccess && options.onSuccess(queue);
                queryClient.setQueryData(queueQueryKeys.id(queue.id), queue);
                if (queue.studyId) {
                    queryClient.invalidateQueries(queueQueryKeys.studyId(queue.studyId));
                }
                queryClient.invalidateQueries(queueQueryKeys.all);
            },
        },
    );
};

export const useDeleteQueue = (options?: { onError?: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation(
        (queue: IQueue) => {
            return api.deleteQueue(queue.id);
        },
        {
            ...options,
            onSuccess: (queue) => {
                if (queue.studyId) {
                    queryClient.invalidateQueries(queueQueryKeys.studyId(queue.studyId));
                }

                queryClient.invalidateQueries(queueQueryKeys.id(queue.id));
            },
        },
    );
};

export const useUpdateQueue = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (queue: IQueue) => {
            return api.updateQueue(queue);
        },
        {
            ...options,
            onSuccess: (queue) => {
                options && options?.onSuccess && options.onSuccess(queue);
                if (queue.studyId) {
                    queryClient.invalidateQueries(queueQueryKeys.studyId(queue.studyId));
                }
                queryClient.invalidateQueries(queueQueryKeys.id(queue.id));
            },
        },
    );
};

export const queueTaskQueryKeys = {
    all: ['queueTask'] as const,
    id: (id: Guid) => [...queueTaskQueryKeys.all, id] as const,
    queues: () => [...queueTaskQueryKeys.all, 'queues'] as const,
    queueId: (queueId: Guid) => [...queueTaskQueryKeys.queues(), queueId] as const,
    queueIdQuery: (queueId: Guid, queryParams: QueueTaskQueryParams) =>
        [...queueTaskQueryKeys.queueId(queueId), JSON.stringify(queryParams)] as const,
    params: () => [...queueTaskQueryKeys.all, 'params'] as const,
    queryParams: (queryParams: QueueTaskQueryParams) => [...queueTaskQueryKeys.params(), queryParams] as const,
};

export const useQueueTasks = (queryParam?: QueueTaskQueryParams, options?: QueryOptions) => {
    return useQuery(
        queueTaskQueryKeys.queryParams(queryParam ?? {}),
        () => {
            return api.getQueueTasks(queryParam);
        },
        options,
    );
};

export const useQueue = (id: Guid, options?: QueryOptions) =>
    useQuery(
        queueQueryKeys.id(id),
        () => {
            return api.getQueueById(id);
        },
        options,
    );

export const useQueueTaskById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        queueTaskQueryKeys.id(id),
        () => {
            return api.getQueueTaskById(id);
        },
        options,
    );

export const useQueueTasksByQueueId = (queueId: Guid, queryParam?: QueueTaskQueryParams, options?: QueryOptions) =>
    useQuery<IQueueTask[]>(
        queueTaskQueryKeys.queueIdQuery(queueId, queryParam ?? {}),
        () => {
            return api.getQueueTasksByQueueId(queueId, queryParam);
        },
        options,
    );

export const useCreateQueueTask = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (queueTaskInfo: IPartialQueueTask) => {
            return api.createQueueTask(queueTaskInfo);
        },
        {
            ...options,
            onSuccess: (queueTask) => {
                options && options?.onSuccess && options.onSuccess(queueTask);

                // Go ahead and add this to the id collection.
                queryClient.setQueryData(queueTaskQueryKeys.id(queueTask.id), queueTask);
                if (queueTask.queueId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.queueId(queueTask.queueId));
                }

                // Easier to do this?
                queryClient.invalidateQueries(queueTaskQueryKeys.params());
            },
        },
    );
};

export const useUpdateQueueTasks = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (queueTasks: IQueueTask[]) => {
            return api.updateQueueTasks(queueTasks);
        },
        {
            ...options,
            onSuccess: (queueTasks) => {
                // Go ahead and add this to the id collection.
                queueTasks.forEach((queueTask) =>
                    queryClient.setQueryData(queueTaskQueryKeys.id(queueTask.id), queueTask),
                );

                if (queueTasks.length > 0 && queueTasks[0].queueId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.queueId(queueTasks[0].queueId));
                }
                queryClient.invalidateQueries(queueQueryKeys.all);
            },
        },
    );
};

export const useAllQueues = (options?: QueryOptions) =>
    useQuery(
        queueQueryKeys.all,
        () => {
            return api.getAllQueues();
        },
        {
            ...options,
            onSuccess: (queues) => {
                options && options?.onSuccess && options.onSuccess(queues);
            },
        },
    );
