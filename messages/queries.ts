import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IMessage, IPartialMessage } from './api';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';

export const messageQueryKeys = {
    all: ['messages'],
    byConversationId: (conversationId: string) => [...messageQueryKeys.all, conversationId],
    byQueryParams: (status?: number, creatorId?: number) => [...messageQueryKeys.all, 'queryParams', status, creatorId],
};

export const useMessagesForConversation = (conversationId: Guid, options?: QueryOptions) =>
    useQuery(
        messageQueryKeys.byConversationId(conversationId),
        () => {
            return api.getMessagesForConversation(conversationId);
        },
        options,
    );

export const useMessagesByQueryParams = (status?: number, creatorId?: number, options?: QueryOptions) => {
    return useQuery(
        messageQueryKeys.byQueryParams(status, creatorId),
        () => {
            return api.getMessagesByQueryParams({ status, creatorId });
        },
        options,
    );
};

export const useSendInternalMessage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (messageDefinition: IPartialMessage) => {
            return api.sendInternalMessage(messageDefinition);
        },
        {
            ...options,
            onSuccess: (message: IMessage) => {
                const conversationId = message.conversationId as string;
                options && options?.onSuccess && options.onSuccess(message);
                queryClient.invalidateQueries(messageQueryKeys.byConversationId(conversationId));
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(conversationId));
            },
        },
    );
};
