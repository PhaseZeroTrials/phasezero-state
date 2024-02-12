import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationQueryKeys } from '../conversations/queries';
import api, { IConversationTask } from './api';
import { QueryOptions } from '@pz/state/common';
import { userService } from '@pz/state';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import { inboxQueryKeys } from '@pz/state/inboxes/queries';

export const conversationTaskQueryKeys = {
    all: ['conversationTasks'] as const,
    id: (id: string) => [...conversationTaskQueryKeys.all, id] as const,
    openConversationCountByUserId: (userId: number) => ['conversationTasks', 'openConversationCount', userId] as const,
};

export const useConversationTaskById = (conversationTaskId: Guid, options?: QueryOptions) =>
    useQuery(
        conversationTaskQueryKeys.id(conversationTaskId),
        () => {
            return api.getConversationTaskById(conversationTaskId);
        },
        options,
    );

export const useUpdateConversationTask = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (conversationTask: IConversationTask) => {
            return api.updateConversationTask(conversationTask);
        },
        {
            ...options,
            onSuccess: (updatedTask) => {
                // Invalidate the conversationTask by id query to refetch after an update

                queryClient.invalidateQueries(conversationTaskQueryKeys.id(updatedTask.id as Guid));

                // Invalidate all inboxId permutations of the conversation query
                queryClient.invalidateQueries(
                    conversationQueryKeys.inboxId(updatedTask.inboxId as Guid, { status: 'assigned' }),
                );

                queryClient.invalidateQueries(
                    conversationQueryKeys.inboxId(updatedTask.inboxId as Guid, {
                        status: 'unassigned',
                    }),
                );

                queryClient.invalidateQueries(
                    conversationQueryKeys.inboxId(updatedTask.inboxId as Guid, {
                        status: 'unassigned',
                        archived: true,
                    }),
                );

                queryClient.invalidateQueries(
                    conversationQueryKeys.inboxId(updatedTask.inboxId as Guid, {
                        status: 'assigned',
                        archived: true,
                    }),
                );

                queryClient.invalidateQueries(
                    conversationQueryKeys.inboxId(updatedTask.inboxId as Guid, {
                        status: 'archived',
                    }),
                );

                queryClient.invalidateQueries(conversationQueryKeys.userId(updatedTask.assigneeId as number));

                // Invalidate conversationActivity query
                queryClient.invalidateQueries(
                    conversationActivityQueryKeys.conversationId(updatedTask.conversationId as Guid),
                );

                const currentUser = userService.getCurrentUser()?.user.id;
                queryClient.invalidateQueries(conversationQueryKeys.userId(currentUser as number));

                // Invalidate all inboxId permutations of the conversation query
                queryClient.invalidateQueries(inboxQueryKeys.all);

                // Invalidate the open conversation count query

                // Get current user id
                const currentUserId = userService.getCurrentUser()?.user.id;
                queryClient.invalidateQueries(
                    conversationTaskQueryKeys.openConversationCountByUserId(currentUserId as number),
                );

                // Navigate last
                options?.onSuccess?.(updatedTask);
            },
        },
    );
};

export const useOpenConversationTaskCountByUserId = (userId: number, options?: QueryOptions) =>
    useQuery(
        conversationTaskQueryKeys.openConversationCountByUserId(userId),
        () => {
            return api.getOpenConversationTaskCountByUserId(userId);
        },
        options,
    );
