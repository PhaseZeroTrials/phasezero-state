import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IMessageTemplate, IPartialMessageTemplate } from '@pz/state/messageTemplates/api';

export const messageTemplateQueryKeys = {
    all: ['messageTemplate'] as const,
    id: (id: string) => [...messageTemplateQueryKeys.all, id] as const,
};

export const useMessageTemplateById = (id: string, options?: QueryOptions) =>
    useQuery(messageTemplateQueryKeys.id(id), () => api.getMessageTemplateById(id), options);

export const useCreateMessageTemplate = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((messageTemplate: IPartialMessageTemplate) => api.createMessageTemplate(messageTemplate), {
        ...options,
        onSuccess: (messageTemplate) => {
            options?.onSuccess?.(messageTemplate);
            queryClient.invalidateQueries(messageTemplateQueryKeys.all);
            // Additional logic if needed
        },
    });
};

export const useUpdateMessageTemplate = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((messageTemplate: IMessageTemplate) => api.updateMessageTemplate(messageTemplate), {
        ...options,
        onSuccess: (messageTemplate) => {
            options?.onSuccess?.(messageTemplate);
            queryClient.invalidateQueries(messageTemplateQueryKeys.all);
        },
    });
};

export const useDeleteMessageTemplate = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((id: string) => api.deleteMessageTemplateById(id), {
        ...options,
        onSuccess: (messageTemplate) => {
            queryClient.invalidateQueries(messageTemplateQueryKeys.all);
            // Additional logic if needed
        },
    });
};

export const useAllMessageTemplates = (options?: QueryOptions) =>
    useQuery(messageTemplateQueryKeys.all, () => api.getMessageTemplates(), options);
