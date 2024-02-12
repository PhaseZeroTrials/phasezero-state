import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryOptions } from '../common';
import api, { IPhoneNumberConfiguration, IPartialPhoneNumberConfiguration } from './api';

const phoneNumberConfigurationQueryKeys = {
    all: ['phoneNumberConfiguration'] as const,
    id: (id: string) => [...phoneNumberConfigurationQueryKeys.all, id] as const,
    channel: () => [...phoneNumberConfigurationQueryKeys.all, 'channel'] as const,
    channelId: (channelId: string) => [...phoneNumberConfigurationQueryKeys.channel(), channelId] as const,
};

export const usePhoneNumberConfigurationById = (id: string, options?: QueryOptions) =>
    useQuery(phoneNumberConfigurationQueryKeys.id(id), () => api.getPhoneNumberConfigurationById(id), options);

export const usePhoneNumberConfigurationsByChannelId = (channelId: string, options?: QueryOptions) =>
    useQuery(
        phoneNumberConfigurationQueryKeys.channelId(channelId),
        () => api.getPhoneNumberConfigurationsByChannelId(channelId),
        options,
    );

export const useCreatePhoneNumberConfiguration = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (phoneNumberConfiguration: IPartialPhoneNumberConfiguration) =>
            api.createPhoneNumberConfiguration(phoneNumberConfiguration),
        {
            ...options,
            onSuccess: (newPhoneNumberConfiguration) => {
                options?.onSuccess?.(newPhoneNumberConfiguration);
                queryClient.setQueryData(
                    phoneNumberConfigurationQueryKeys.id(newPhoneNumberConfiguration.id),
                    newPhoneNumberConfiguration,
                );
                queryClient.invalidateQueries(
                    phoneNumberConfigurationQueryKeys.channelId(newPhoneNumberConfiguration.channelId),
                );
            },
        },
    );
};

export const useUpdatePhoneNumberConfiguration = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (phoneNumberConfiguration: IPhoneNumberConfiguration) =>
            api.updatePhoneNumberConfiguration(phoneNumberConfiguration.id, phoneNumberConfiguration),
        {
            ...options,
            onSuccess: (updatedPhoneNumberConfiguration) => {
                queryClient.setQueryData(
                    phoneNumberConfigurationQueryKeys.id(updatedPhoneNumberConfiguration.id),
                    updatedPhoneNumberConfiguration,
                );
                queryClient.invalidateQueries(
                    phoneNumberConfigurationQueryKeys.channelId(updatedPhoneNumberConfiguration.channelId),
                );
            },
        },
    );
};
