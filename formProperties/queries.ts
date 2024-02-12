import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formPropertyService, IFormProperty } from '@pz/state';
import { QueryOptions } from '@pz/state/common';

const formPropertiesQueryKeys = {
    all: ['formProperties'] as const,
    allProperties: () => [...formPropertiesQueryKeys.all, 'allProperties'] as const,
    id: () => [...formPropertiesQueryKeys.all, 'id'] as const,
    task: () => [...formPropertiesQueryKeys.all, 'task'] as const,
    taskId: (taskId: Guid) => [...formPropertiesQueryKeys.task(), taskId] as const,
    form: () => [...formPropertiesQueryKeys.all, 'form'] as const,
    formId: (formId: number) => [...formPropertiesQueryKeys.form(), formId] as const,
};

export const useFormPropertiesForTask = (trialTaskId: string, options?: QueryOptions) =>
    useQuery(
        formPropertiesQueryKeys.id(),
        () => {
            return formPropertyService.getFormPropertiesForTask(trialTaskId);
        },
        options,
    );

export const useFormPropertiesForForm = (formId: number, options?: QueryOptions) =>
    useQuery(
        formPropertiesQueryKeys.id(),
        () => {
            return formPropertyService.getFormPropertiesForForm(formId);
        },
        options,
    );

export const useFormPropertiesForAllCustomAttributes = (options?: QueryOptions) =>
    useQuery(
        formPropertiesQueryKeys.allProperties(),
        () => {
            return formPropertyService.getFormPropertiesForAllCustomAttributes();
        },
        options,
    );

export const useBulkCreateOrUpdateFormProperties = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (data: IFormProperty[]) => {
            return formPropertyService.bulkCreateOrUpdateFormProperties(data);
        },
        {
            onSuccess: (formProperties) => {
                // Invalidate relevant queries when form properties are bulk created or updated
                options && options?.onSuccess && options.onSuccess(formProperties);
                queryClient.invalidateQueries(formPropertiesQueryKeys.all);
                // Add more invalidations if needed
            },
        },
    );
};
