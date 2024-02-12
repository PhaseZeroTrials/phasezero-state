import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';

import api from './api';

const workflowTriggerQueryKeys = {
    all: ['workflowTrigger'] as const,
    id: (id: number) => [...workflowTriggerQueryKeys.all, id] as const,
    form: () => [...workflowTriggerQueryKeys.all, 'form'] as const,
    formId: (id: number) => [...workflowTriggerQueryKeys.form(), id] as const,
    study: () => [...workflowTriggerQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...workflowTriggerQueryKeys.study(), id] as const,
};

export const useWorkflowTriggersByFormId = (formId: number, options?: QueryOptions) =>
    useQuery(
        workflowTriggerQueryKeys.formId(formId),
        () => {
            return api.getWorkflowTriggersByFormId(formId);
        },
        {
            ...options,
            onSuccess: (workflowTriggers) => {
                options && options?.onSuccess && options.onSuccess(workflowTriggers);
            },
        },
    );

export const useWorkflowTriggersByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(workflowTriggerQueryKeys.studyId(studyId), () => api.getWorkflowTriggersByStudyId(studyId), {
        ...options,
        onSuccess: (workflowTriggers) => {
            options && options?.onSuccess && options.onSuccess(workflowTriggers);
        },
    });

export const useWorkflowTriggers = (options?: QueryOptions) =>
    useQuery(workflowTriggerQueryKeys.all, () => api.getWorkflowTriggers(), {
        ...options,
        onSuccess: (workflowTriggers) => {
            options && options?.onSuccess && options.onSuccess(workflowTriggers);
        },
    });
