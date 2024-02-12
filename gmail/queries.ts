import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IMessage } from '../messages/api';
import { QueryOptions } from '@pz/state/common';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import api, { IEmailDefinition } from '@pz/state/gmail/api'; // Assuming you named the Gmail API file as gmailApi.ts

export const gmailQueryKeys = {
    sync: ['gmail', 'sync'] as const,
    send: ['gmail', 'send'] as const,
    reply: ['gmail', 'reply'] as const,
    channelId: (id: string) => ['gmail', id] as const,
};

export const useSyncEmails = (channelId: string, options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(() => api.syncEmails(channelId), {
        ...options,
        onSuccess: () => {
            queryClient.invalidateQueries(gmailQueryKeys.channelId(channelId));
        },
    });
};

export const useSendEmail = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: { channelId: string; email: IEmailDefinition }) => api.sendEmail(params.channelId, params.email),
        {
            ...options,
            onSuccess: (message: IMessage) => {
                options && options.onSuccess && options.onSuccess(message);
                queryClient.invalidateQueries(gmailQueryKeys.send);
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(message.conversationId));
            },
        },
    );
};

export const useSendReplyGmail = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: { channelId: string; email: IEmailDefinition }) => api.sendReplyGmail(params.channelId, params.email),
        {
            ...options,
            onSuccess: (message: IMessage) => {
                options && options.onSuccess && options.onSuccess(message);
                queryClient.invalidateQueries(gmailQueryKeys.reply);
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(message.conversationId));
            },
        },
    );
};
