import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import formService, { IForm, IPartialForm } from './api';
import { IConversation } from '@pz/state';
import { conversationQueryKeys } from '@pz/state/conversations/queries';

const formQueryKeys = {
    all: ['forms'] as const,
    id: () => [...formQueryKeys.all, 'id'] as const,
    byId: (id: number) => [...formQueryKeys.id(), id] as const,
    study: () => [...formQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...formQueryKeys.study(), id] as const,
    task: () => [...formQueryKeys.all, 'task'] as const,
    taskId: (taskId: Guid) => [...formQueryKeys.task(), taskId] as const,
};

export const useCreateForm = () => {
    return useMutation((newForm: IPartialForm) => formService.createForm(newForm));
};

export const useDeleteForm = () => {
    const queryClient = useQueryClient();
    return useMutation((form: IForm) => formService.deleteForm(form), {
        //     Invalidate and refetch all forms after this mutation succeeds
        onSuccess: () => {
            queryClient.invalidateQueries(formQueryKeys.all);
        },
    });
};

export const useFormsByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery<IForm[]>(
        formQueryKeys.studyId(studyId),
        () => {
            return formService.getFormsByStudyId(studyId);
        },
        options,
    );

export const useAllForms = (options?: QueryOptions) =>
    useQuery<IForm[]>(formQueryKeys.all, () => formService.getForms(), options);

// Not going to use the tenantId as a key here as this should be session specific
export const useFormByTaskId = (tenantId: Guid, taskId: Guid, options?: QueryOptions) =>
    useQuery(
        formQueryKeys.taskId(taskId),
        () => {
            return formService.getFormByTrialTaskId(tenantId, taskId);
        },
        options,
    );

export const useFormById = (id: number, options?: QueryOptions) => {
    return useQuery(
        formQueryKeys.byId(id),
        () => {
            return formService.getForm(id);
        },
        options,
    );
};
