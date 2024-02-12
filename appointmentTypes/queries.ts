import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IAppointmentType, IPartialAppointmentType } from './api';

const appointmentTypeQueryKeys = {
    all: ['appointmentType'] as const,
    id: (id: Guid) => [...appointmentTypeQueryKeys.all, id] as const,
    study: () => [...appointmentTypeQueryKeys.all, 'study'] as const,
    studyId: (studyId: number) => [...appointmentTypeQueryKeys.study(), studyId] as const,
};

export const useAllAppointmentTypes = () => {
    return api.getAppointmentTypes();
};

export const useAppointmentTypeById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        appointmentTypeQueryKeys.id(id),
        () => {
            return api.getAppointmentType(id);
        },
        options,
    );

export const useAppointmentTypesByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(
        appointmentTypeQueryKeys.studyId(studyId),
        () => {
            return api.getAppointmentTypesForStudy(studyId);
        },
        options,
    );

export const useCreateAppointmentType = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (appointmentType: IPartialAppointmentType) => {
            return api.createAppointmentType(appointmentType);
        },
        {
            ...options,
            onSuccess: (appointmentType) => {
                options && options.onSuccess && options.onSuccess(appointmentType);

                // Go ahead and add this to the id collection.
                queryClient.setQueryData(appointmentTypeQueryKeys.id(appointmentType.id), appointmentType);

                // Invalidate the study collection.
                queryClient.invalidateQueries(appointmentTypeQueryKeys.studyId(appointmentType.studyId));
            },
        },
    );
};

export const useUpdateAppointmentType = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (appointmentType: IAppointmentType) => {
            return api.updateAppointmentType(appointmentType);
        },
        {
            ...options,
            onSuccess: (appointmentType) => {
                options && options.onSuccess && options.onSuccess(appointmentType);
                // Go ahead and add this to the id collection.
                queryClient.setQueryData(appointmentTypeQueryKeys.id(appointmentType.id), appointmentType);

                // Invalidate the study collection.
                queryClient.invalidateQueries(appointmentTypeQueryKeys.studyId(appointmentType.studyId));
            },
        },
    );
};

export const useDeleteAppointmentType = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (appointmentType: IAppointmentType) => {
            return api.deleteAppointmentType(appointmentType.id);
        },
        {
            ...options,
            onSuccess: (appointmentType) => {
                options && options.onSuccess && options.onSuccess(appointmentType);
                // Go ahead and remove this from the id collection.
                queryClient.removeQueries(appointmentTypeQueryKeys.id(appointmentType.id));

                // Invalidate the study collection.
                queryClient.invalidateQueries(appointmentTypeQueryKeys.studyId(appointmentType.studyId));
            },
        },
    );
};
