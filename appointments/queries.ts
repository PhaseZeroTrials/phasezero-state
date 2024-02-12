import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { AppointmentQueryParams, IPartialAppointment } from './api';

export const AppointmentQueryKeys = {
    all: ['appointment'] as const,
    id: (id: Guid) => [...AppointmentQueryKeys.all, id] as const,
};

export const useAllAppointments = (queryParam?: AppointmentQueryParams, options?: QueryOptions) =>
    useQuery(
        AppointmentQueryKeys.all,
        () => {
            return api.getAllAppointments(queryParam);
        },
        options,
    );

export const useAppointmentById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        AppointmentQueryKeys.id(id),
        () => {
            return api.getAppointment(id);
        },
        options,
    );

export const useCreateAppointment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (appointment: IPartialAppointment) => {
            return api.createAppointment(appointment);
        },
        {
            ...options,
            onSuccess: (appointment) => {
                // Go ahead and add this to the id collection.
                queryClient.setQueryData(AppointmentQueryKeys.id(appointment.id), appointment);

                // Invalidate the all collection so that it will be refetched.
                queryClient.invalidateQueries(AppointmentQueryKeys.all);
            },
        },
    );
};

export const useUpdateAppointment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (appointment: IPartialAppointment) => {
            return api.updateAppointment(appointment);
        },
        {
            ...options,
            onSuccess: (appointment) => {
                // Go ahead and add this to the id collection.
                queryClient.setQueryData(AppointmentQueryKeys.id(appointment.id), appointment);

                // Invalidate the id collection so that it will be refetched.
                queryClient.invalidateQueries(AppointmentQueryKeys.id(appointment.id));

                // Invalidate the all collection so that it will be refetched.
                queryClient.invalidateQueries(AppointmentQueryKeys.all);
            },
        },
    );
};

export const useDeleteAppointment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (id: Guid) => {
            return api.deleteAppointment(id);
        },
        {
            ...options,
            onSuccess: (appointment) => {
                options && options.onSuccess && options.onSuccess(appointment);
                // Go ahead and remove this from the id collection.
                queryClient.removeQueries(AppointmentQueryKeys.id(appointment.id as Guid));

                // Invalidate the all collection so that it will be refetched.
                queryClient.invalidateQueries(AppointmentQueryKeys.all);
            },
        },
    );
};
