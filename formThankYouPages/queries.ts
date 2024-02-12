import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryOptions } from '../common'; // Import QueryOptions if you have a common definition
import api, { IPartialFormThankYouPage } from './api'; // Import your FormThankYouPage API and model

export const formThankYouPageQueryKeys = {
    all: ['formThankYouPages'] as const,
    formThankYouPageByFormId: (id: number) => [...formThankYouPageQueryKeys.all, id] as const,
};

export const useFormThankYouPage = (formId: number, options?: QueryOptions) =>
    useQuery(
        formThankYouPageQueryKeys.formThankYouPageByFormId(formId),
        () => {
            return api.getFormThankYouPage(formId);
        },
        options,
    );

export const useCreateFormThankYouPage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((formThankYouPage: IPartialFormThankYouPage) => api.createFormThankYouPage(formThankYouPage), {
        ...options,
        onSuccess: (formThankYouPage) => {
            options && options.onSuccess && options.onSuccess(formThankYouPage);
            queryClient.invalidateQueries(formThankYouPageQueryKeys.all);
        },
    });
};

export const useUpdateFormThankYouPage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((formThankYouPage: IPartialFormThankYouPage) => api.updateFormThankYouPage(formThankYouPage), {
        ...options,
        onSuccess: (updatedFormThankYouPage) => {
            options && options.onSuccess && options.onSuccess(updatedFormThankYouPage);
            queryClient.invalidateQueries(
                formThankYouPageQueryKeys.formThankYouPageByFormId(updatedFormThankYouPage.formId),
            );
        },
    });
};

export const useDeleteFormThankYouPage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((formThankYouPageId: number) => api.deleteFormThankYouPage(formThankYouPageId), {
        ...options,
        onSuccess: (formThankYouPage) => {
            options && options.onSuccess && options.onSuccess(formThankYouPage);
            queryClient.invalidateQueries(formThankYouPageQueryKeys.all);
        },
    });
};
