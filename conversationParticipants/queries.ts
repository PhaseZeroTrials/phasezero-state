import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialConversationParticipant } from './api';

export const conversationQueryKeys = {
    all: ['conversation'] as const,
    id: (id: Guid) => [...conversationQueryKeys.all, id] as const,
    taskId: (taskId: Guid) => [...conversationQueryKeys.all, 'taskId', taskId] as const,
    subjectId: (subjectId: number) => [...conversationQueryKeys.all, 'subjectId', subjectId] as const,
};

export const conversationParticipantQueryKeys = {
    all: ['conversationParticipant'] as const,
    id: (id: Guid) => [...conversationParticipantQueryKeys.all, id] as const,
    conversationId: (conversationId: Guid) =>
        [...conversationParticipantQueryKeys.all, 'conversationId', conversationId] as const,
};

export const useConversationParticipants = (conversationId: Guid, options?: QueryOptions) =>
    useQuery(
        conversationParticipantQueryKeys.conversationId(conversationId),
        () => {
            return api.getConversationParticipants(conversationId);
        },
        options,
    );

export const useInviteConversationParticipant = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (conversationParticipant: IPartialConversationParticipant) =>
            api.inviteConversationParticipant(conversationParticipant),
        {
            ...options,
            onSuccess: (data) => {
                // Invalidate and refetch the conversation participants query
                queryClient.invalidateQueries(conversationParticipantQueryKeys.conversationId(data.conversationId));
                queryClient.invalidateQueries(conversationQueryKeys.id(data.conversationId));
            },
        },
    );
};
