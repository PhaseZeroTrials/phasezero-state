import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IMessage } from '../messages/api';
import { QueryOptions } from '@pz/state/common';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import { IEmailDefinition } from '@pz/state/gmail/api';
import api from '@pz/state/emailDKIM/api';

export const emailDKIMQueryKeys = {
    send: ['email', 'send'] as const,
    channelId: (id: string) => ['email', id] as const,
};

export const useSendEmailDKIM = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: { channelId: string; email: IEmailDefinition }) => api.sendEmailDKIM(params.channelId, params.email),
        {
            ...options,
            onSuccess: (message: IMessage) => {
                options && options.onSuccess && options.onSuccess(message);
                queryClient.invalidateQueries(emailDKIMQueryKeys.send);
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(message.conversationId));
            },
        },
    );
};
