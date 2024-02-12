import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialInbox } from './api';

export const inboxQueryKeys = {
    all: ['inboxes'] as const,
    inbox: () => [...inboxQueryKeys.all, 'inbox'] as const,
    inboxId: (id: string) => [...inboxQueryKeys.inbox(), id] as const,
};

export const useInboxes = (options?: QueryOptions) =>
    useQuery(
        inboxQueryKeys.all,
        () => {
            return api.getInboxes();
        },
        options,
    );

export const useInbox = (inboxId: string, options?: QueryOptions) =>
    useQuery(
        inboxQueryKeys.inboxId(inboxId),
        () => {
            return api.getInbox(inboxId);
        },
        options,
    );

export const useCreateInbox = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((inbox: IPartialInbox) => api.createInbox(inbox), {
        ...options,
        onSuccess: (inbox) => {
            options && options.onSuccess && options.onSuccess(inbox);
            queryClient.invalidateQueries(inboxQueryKeys.all);
        },
    });
};

export const useUpdateInbox = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((inbox: IPartialInbox) => api.updateInbox(inbox), {
        ...options,
        onSuccess: (updatedInbox) => {
            options && options.onSuccess && options.onSuccess(updatedInbox);
            queryClient.invalidateQueries(inboxQueryKeys.inboxId(updatedInbox.id));
        },
    });
};

export const useDeleteInbox = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((inboxId: string) => api.deleteInbox(inboxId), {
        ...options,
        onSuccess: (inbox) => {
            options && options.onSuccess && options.onSuccess(inbox);
            queryClient.invalidateQueries(inboxQueryKeys.all);
        },
    });
};
