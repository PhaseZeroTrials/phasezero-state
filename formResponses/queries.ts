import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import { queueTaskQueryKeys } from '../queue';
import api, { IFormResponse, IPartialFormResponse } from './api';

const formResponseQueryKeys = {
    all: ['formResponses'] as const,
    id: () => [...formResponseQueryKeys.all, 'id'] as const,
    byId: (id: Guid) => [...formResponseQueryKeys.id(), 'subject'] as const,
    subject: () => [...formResponseQueryKeys.all, 'form'] as const,
    subjectId: (subjectId: number) => [...formResponseQueryKeys.subject(), subjectId] as const,
    task: () => [...formResponseQueryKeys.all, 'task'] as const,
    taskId: (taskId: Guid) => [...formResponseQueryKeys.task(), taskId] as const,
    taskSubject: () => [...formResponseQueryKeys.task(), 'subject'] as const,
    taskIdSubjectId: (taskId: Guid, subjectId: number) =>
        [...formResponseQueryKeys.taskSubject(), taskId, subjectId] as const,
    form: () => [...formResponseQueryKeys.all, 'form'] as const,
    formId: (formId: number) => [...formResponseQueryKeys.form(), formId] as const,
    formSubject: () => [...formResponseQueryKeys.form(), 'subject'] as const,
    formIdSubjectId: (formId: number, subjectId: number) =>
        [...formResponseQueryKeys.formSubject(), formId, subjectId] as const,
};

export const useFormResponseById = (id: Guid, options?: QueryOptions) =>
    useQuery<IFormResponse>(
        formResponseQueryKeys.byId(id),
        () => {
            return api.getFormResponseById(id);
        },
        {
            ...options,
            onSuccess: (data) => {
                // This callback will be called on both initial fetch and refetch
                console.log('Data fetched or refetched:', data);
                // You can update your component's state or perform actions here
                if (options?.onSuccess) {
                    options.onSuccess(data); // Call the original onSuccess callback if provided
                }
            },
        },
    );

export const useFormResponsesBySubjectId = (subjectId: number, options?: QueryOptions) =>
    useQuery<IFormResponse[]>(
        formResponseQueryKeys.subjectId(subjectId), // Assuming you have a key for form response by subject ID
        () => {
            return api.getFormResponsesBySubjectId(subjectId);
        },
        options,
    );

export const useFormResponsesBySubjectAndTaskId = (subjectId: number, taskId: Guid, options?: QueryOptions) =>
    useQuery(
        formResponseQueryKeys.taskIdSubjectId(taskId, subjectId),
        () => {
            return api.getFormResponsesBySubjectAndTaskId(subjectId, taskId);
        },
        options,
    );

export const useFormResponseBySubjectAndFormId = (subjectId: number, formId: number, options?: QueryOptions) =>
    useQuery(
        formResponseQueryKeys.formIdSubjectId(formId, subjectId),
        () => {
            return api.getFormResponsesBySubjectAndForm(formId, subjectId);
        },
        options,
    );

export const useFormResponsesByFormId = (formId: number, options?: QueryOptions) =>
    useQuery(
        formResponseQueryKeys.formId(formId),
        () => {
            return api.getFormResponsesByFormId(formId);
        },
        options,
    );

export const useCreateOrUpdateFormResponse = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (partialFormResponse: IPartialFormResponse) => {
            return api.createOrUpdateFormResponse(partialFormResponse);
        },
        {
            ...options,
            onSuccess: (response) => {
                options && options.onSuccess && options.onSuccess(response);
                queryClient.invalidateQueries(formResponseQueryKeys.byId(response.id));
                // Make sure the assigned task is updated
                if (response.taskId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.id(response.taskId));
                }
            },
        },
    );
};

export const useUpdateFormResponse = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (partialFormResponse: IPartialFormResponse) => {
            return api.updateFormResponse(partialFormResponse);
        },
        {
            ...options,
            onSuccess: (response) => {
                options && options.onSuccess && options.onSuccess(response);
            },
        },
    );
};

export const useDeleteFormResponse = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (formResponse: IFormResponse) => {
            return api.deleteFormResponseById(formResponse.id);
        },
        {
            ...options,
            onSuccess: (response) => {
                queryClient.removeQueries(formResponseQueryKeys.byId(response.id));
                // Make sure the assigned task is updated
                if (response.taskId) {
                    queryClient.invalidateQueries(queueTaskQueryKeys.id(response.taskId));
                }
            },
        },
    );
};
