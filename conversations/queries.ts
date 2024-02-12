import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { ConversationBulkRequest, ConversationQueryParams, IConversation, IPartialConversation } from './api';
import { inboxQueryKeys } from '@pz/state/inboxes/queries';
import { userService } from '@pz/state';
import { conversationTaskQueryKeys } from '@pz/state/conversationTasks/queries';

export const conversationQueryKeys = {
    all: ['conversation'] as const,
    internalChannel: () => [...conversationQueryKeys.all, 'internalChannel'] as const,
    id: (id: Guid) => [...conversationQueryKeys.all, id] as const,
    taskId: (taskId: Guid) => [...conversationQueryKeys.all, 'taskId', taskId] as const,
    subjectId: (subjectId: number) => [...conversationQueryKeys.all, 'subjectId', subjectId] as const,
    inboxId: (inboxId: Guid, queryParams?: ConversationQueryParams) =>
        ['conversations', 'inbox', inboxId, queryParams?.status, queryParams?.archived] as const,
    userId: (userId: number) => [...conversationQueryKeys.all, 'userId', userId] as const,
    mentioned: (userId: number, queryParams?: ConversationQueryParams) =>
        ['conversations', 'mentioned', userId, queryParams?.status, queryParams?.archived] as const,
};

export const useConversationById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.id(id),
        () => {
            return api.getConversationById(id);
        },
        options,
    );

export const useCreateConversationForSubject = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (subjectId: number) => {
            return api.createConversationForSubject(subjectId);
        },
        {
            ...options,
            onSuccess: (conversation) => {
                // Invalidate the conversation by id query
                queryClient?.invalidateQueries(conversationQueryKeys.subjectId(conversation.subjectId as number));
            },
        },
    );
};

export const useUpdateConversation = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (conversation: IPartialConversation) => {
            return api.updateConversation(conversation.id as string, conversation);
        },
        {
            ...options,
            onSuccess: (conversation: IConversation) => {
                options && options?.onSuccess && options.onSuccess(conversation);
                queryClient.invalidateQueries(conversationQueryKeys.id(conversation.id));
                queryClient.invalidateQueries(conversationQueryKeys.internalChannel());
            },
        },
    );
};

export const useAllConversations = (options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.all,

        () => {
            return api.getAllConversations();
        },
        options,
    );

export const useConversationForStudy = (studyId: number, options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.all,

        () => {
            return api.getConversationForStudy(studyId);
        },
        options,
    );

export const useConversationBySubjectId = (subjectId: number, options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.subjectId(subjectId),
        () => {
            return api.getConversationBySubjectId(subjectId);
        },
        {
            ...options,
            onSuccess: (conversation) => {
                options && options?.onSuccess && options.onSuccess(conversation);
            },
        },
    );

export const useV2ConversationBySubjectId = (subjectId: number, options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.subjectId(subjectId),
        () => {
            return api.getV2ConversationsBySubjectId(subjectId);
        },
        {
            ...options,
            onSuccess: (conversation) => {
                options && options?.onSuccess && options.onSuccess(conversation);
            },
        },
    );

// NOTE:
/*
[assigneeId = null, resolved_at = 0] = Unassigned

[assigneeId = not null, resolved_at = 0] = Assigned

[assigneeId = *, resolved_at = 1] = Archived
 */

export const useConversationsByInboxId = (
    inboxId: Guid,
    queryParams?: ConversationQueryParams,
    options?: QueryOptions,
) =>
    useQuery(
        conversationQueryKeys.inboxId(inboxId, queryParams),
        () => {
            return api.getConversationsByInboxId(inboxId, queryParams);
        },
        options,
    );

export const useConversationForUser = (userId: number, queryParams?: ConversationQueryParams, options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.userId(userId),

        () => {
            return api.getConversationForUser(userId, queryParams);
        },
        options,
    );

export const useBulkArchiveConversations = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (request: ConversationBulkRequest) => {
            return api.bulkArchiveConversations(request);
        },
        {
            ...options,
            onSuccess: () => {
                options && options.onSuccess && options.onSuccess(null);
                queryClient.invalidateQueries(inboxQueryKeys.all);
                // Invalidate current user conversationTaskQueryKeys
                const currentUser = userService.getCurrentUser()?.user.id;
                queryClient.invalidateQueries(
                    conversationTaskQueryKeys.openConversationCountByUserId(currentUser as number),
                );
                // Invalidate and refetch something when the mutation is successful
                // e.g., queryClient.invalidateQueries(conversationQueryKeys.all);
            },
        },
    );
};

export const useBulkUnarchiveConversations = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (request: ConversationBulkRequest) => {
            return api.bulkUnarchiveConversations(request); // Assuming bulkUnarchiveConversations is the name of your new API method
        },
        {
            ...options,
            onSuccess: () => {
                options && options.onSuccess && options.onSuccess(null);
                // Invalidate and refetch something when the mutation is successful
                queryClient.invalidateQueries(inboxQueryKeys.all);
                // Invalidate current user conversationTaskQueryKeys
                const currentUser = userService.getCurrentUser()?.user.id;
                queryClient.invalidateQueries(
                    conversationTaskQueryKeys.openConversationCountByUserId(currentUser as number),
                );
                // e.g., queryClient.invalidateQueries(conversationQueryKeys.all);
            },
        },
    );
};

export const useSearchConversations = (keyword?: string, status?: string, assignee?: string, options?: QueryOptions) =>
    useQuery(
        ['conversations', 'search', keyword, status, assignee],
        () => {
            return api.searchConversations(keyword, status, assignee);
        },
        options,
    );

// Hook for creating an internal channel conversation
export const useCreateInternalChannelConversation = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (name: string) => {
            return api.createInternalChannelConversation(name);
        },
        {
            ...options,
            onSuccess: (conversation) => {
                // Invalidate and refetch relevant queries
                queryClient.invalidateQueries(conversationQueryKeys.all);
                // Additional logic if needed
            },
        },
    );
};

// Hook for getting internal channel conversations
export const useGetInternalChannelConversations = (options?: QueryOptions) =>
    useQuery(
        conversationQueryKeys.internalChannel(),
        () => {
            return api.getInternalChannelConversations();
        },
        options,
    );

export const useFindOrCreateDirectConversation = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (userIds: number[]) => {
            return api.findOrCreateDirectConversation(userIds);
        },
        {
            ...options,
            onSuccess: (conversation) => {
                // Invalidate and refetch relevant queries
                queryClient.invalidateQueries(conversationQueryKeys.all);
                // Additional logic if needed
            },
        },
    );
};

export const useMentionedConversations = (
    userId: number,
    queryParams?: ConversationQueryParams,
    options?: QueryOptions,
) =>
    useQuery(
        conversationQueryKeys.mentioned(userId, queryParams),
        () => {
            return api.getMentionedConversations(userId, queryParams);
        },
        options,
    );
