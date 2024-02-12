import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const inboxQueryKeys = {
    all: ['inboxes'] as const,
    inbox: () => [...inboxQueryKeys.all, 'inbox'] as const,
    inboxId: (id: string) => [...inboxQueryKeys.inbox(), id] as const,
};

const tenantPhoneNumberQueryKeys = {
    all: ['tenantPhoneNumbers'] as const,
};

export const useTenantPhoneNumbersByTenantId = (tenantId: Guid, options?: QueryOptions) =>
    useQuery(
        tenantPhoneNumberQueryKeys.all,

        () => {
            return api.getTenantPhoneNumbersForTenant(tenantId);
        },
        options,
    );

export const useProvisionTenantPhoneNumber = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(() => api.provisionTenantPhoneNumber(), {
        ...options,
        onSuccess: (phoneNumber) => {
            options && options.onSuccess && options.onSuccess(phoneNumber);

            queryClient.invalidateQueries(tenantPhoneNumberQueryKeys.all);
        },
    });
};

export const useProvisionTwiML = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(() => api.provisionTwiML(), {
        ...options,
        onSuccess: (twiml) => {
            options && options.onSuccess && options.onSuccess(twiml);
        },
    });
};
