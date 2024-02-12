import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';

import api, { IPartialWorkflow, IWorkflow } from './api';
const workflowQueryKeys = {
    all: ['workflow'] as const,
    id: (id: Guid) => [...workflowQueryKeys.all, id] as const,
    study: () => [...workflowQueryKeys.all, 'study'] as const,
    studyId: (studyId: number) => [...workflowQueryKeys.study(), studyId] as const,
};

export const useWorkflows = (options?: QueryOptions) =>
    useQuery(
        workflowQueryKeys.all,
        () => {
            return api.getWorkflows();
        },
        options,
    );

export const useWorkflowsByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(
        workflowQueryKeys.studyId(studyId),
        () => {
            return api.getWorkflowsForProject(studyId);
        },
        options,
    );
export const useWorkflowById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        workflowQueryKeys.id(id),
        () => {
            return api.getWorkflow(id);
        },
        options,
    );

export const useDeleteWorkflow = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((record: IWorkflow) => api.deleteWorkflow(record), {
        ...options,
        onSuccess: (record: IWorkflow) => {
            options && options.onSuccess && options.onSuccess(record);
            return queryClient.invalidateQueries(workflowQueryKeys.all);
        },
    });
};

export const useCreateWorkflow = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((record: IPartialWorkflow) => api.createWorkflow(record), {
        ...options,
        onSuccess: (record: IWorkflow) => {
            options && options.onSuccess && options.onSuccess(record);
            return queryClient.invalidateQueries(workflowQueryKeys.all);
        },
    });
};

export const useUpdateWorkflow = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((record: IPartialWorkflow) => api.updateWorkflow(record), {
        ...options,
        onSuccess: (record: IWorkflow) => {
            options && options.onSuccess && options.onSuccess(record);
            if (record.studyId) {
                queryClient.invalidateQueries(workflowQueryKeys.studyId(record.studyId));
            }
            return queryClient.invalidateQueries(workflowQueryKeys.id(record.id));
        },
    });
};
