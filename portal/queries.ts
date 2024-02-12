import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialPortalSettings, IPortalSettings } from './api';

const portalSettingsQueryKeys = {
    all: ['portalSettings'] as const,
    study: () => [...portalSettingsQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...portalSettingsQueryKeys.study(), id] as const,
};

export const usePortalSettingsForStudy = (studyId: number, options?: QueryOptions) =>
    useQuery<IPortalSettings | null>(
        portalSettingsQueryKeys.studyId(studyId),
        () => api.getPortalSettingsByStudy(studyId),
        options,
    );

export const useCreatePortalSettings = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((partialSettings: IPartialPortalSettings) => api.createPortalSettings(partialSettings), {
        ...options,
        onSuccess: (settings) => {
            options && options.onSuccess && options.onSuccess(settings);
            queryClient.invalidateQueries(portalSettingsQueryKeys.studyId(settings.studyId));
        },
    });
};

export const useUpdatePortalSettings = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((settings: IPortalSettings) => api.updatePortalSettings(settings), {
        ...options,
        onSuccess: (settings) => {
            options && options.onSuccess && options.onSuccess(settings);
            queryClient.invalidateQueries(portalSettingsQueryKeys.studyId(settings.studyId));
        },
    });
};

export const useDeletePortalSettings = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((settings: IPortalSettings) => api.deletePortalSettings(settings.id), {
        ...options,
        onSuccess: (settings) => {
            options && options.onSuccess && options.onSuccess(settings);
            queryClient.invalidateQueries(portalSettingsQueryKeys.studyId(settings.studyId));
        },
    });
};

export const useAddFormToPortalSettings = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ formId, settings }: { formId: number; settings: IPortalSettings }) =>
            api.addFormToPortalSettings(formId, settings),
        {
            ...options,
            onSuccess: (settings) => {
                options && options.onSuccess && options.onSuccess(settings);
                queryClient.invalidateQueries(portalSettingsQueryKeys.studyId(settings.studyId));
            },
        },
    );
};

export const useRemoveFormFromPortalSettings = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ formId, settings }: { formId: number; settings: IPortalSettings }) =>
            api.removeFormFromPortalSettings(formId, settings),
        {
            ...options,
            onSuccess: (settings) => {
                options && options.onSuccess && options.onSuccess(settings);
                queryClient.invalidateQueries(portalSettingsQueryKeys.studyId(settings.studyId));
            },
        },
    );
};
