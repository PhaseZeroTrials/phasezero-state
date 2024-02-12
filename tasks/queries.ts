import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import { queueTaskQueryKeys } from '../queue';
import { AppointmentQueryKeys } from '../appointments';
import { TaskStatus } from '@pz/state';
import api, { IPartialTask, ITask } from './api';

const TaskQueryKeys = {
    all: ['task'] as const,
    id: (id: Guid) => [...TaskQueryKeys.all, id] as const,
};

export const useTaskById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        TaskQueryKeys.id(id),
        () => {
            return api.getTaskById(id);
        },
        options,
    );

export const useUpdateTask = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (task: IPartialTask) => {
            return api.updateTask(task);
        },
        {
            ...options,
            onSuccess: (task) => {
                // Go ahead and add this to the id collection.
                options && options.onSuccess && options.onSuccess(task);
                queryClient.setQueryData(queueTaskQueryKeys.id(task.id), task);
                if (task?.queueId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.queueId(task?.queueId));
                }

                queryClient.invalidateQueries(queueTaskQueryKeys.params());

                // Invalidate AppointmentQueryKeys.all
                queryClient.invalidateQueries(AppointmentQueryKeys.all);
            },
        },
    );
};

export const useDeleteTask = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (task: ITask) => {
            return api.deleteTask(task.id);
        },
        {
            ...options,
            onSuccess: (task) => {
                if (task.queueId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.queueId(task.queueId));
                }

                queryClient.invalidateQueries(queueTaskQueryKeys.id(task.id));
                queryClient.invalidateQueries(
                    queueTaskQueryKeys.queryParams({
                        subject: [task.subjectId as number],
                    }),
                );

                queryClient.invalidateQueries(
                    queueTaskQueryKeys.queryParams({
                        status: [TaskStatus.OPEN],
                    }),
                );
            },
        },
    );
};
