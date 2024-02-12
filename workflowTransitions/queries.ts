import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QueryOptions } from '@pz/state/common';

const workflowActionTransitionQueryKeys = {
    all: ['workflowActionTransition'] as const,
    id: (id: Guid) => [...workflowActionTransitionQueryKeys.all, id] as const,
    workflowAction: () => [...workflowActionTransitionQueryKeys.all, 'workflowAction'] as const,
    workflowActionId: (id: Guid) => [...workflowActionTransitionQueryKeys.workflowAction(), id] as const,
};

export const useWorkflowActionTransitionsByWorkflowActionId = (workflowActionId: Guid, options?: QueryOptions) =>
    useQuery(
        workflowActionTransitionQueryKeys.workflowActionId(workflowActionId),
        () => {
            return api.getWorkflowActionTransitionByTargetAction(workflowActionId);
        },
        {
            ...options,
            onSuccess: (workflowActionTransitions) => {
                options && options?.onSuccess && options.onSuccess(workflowActionTransitions);
            },
        },
    );

export const useUpdateWorkflowActionTransition = () => {
    const queryClient = useQueryClient();
    return useMutation(api.updateWorkflowActionTransition, {
        onSuccess: (workflowActionTransition) => {
            queryClient.setQueryData(
                workflowActionTransitionQueryKeys.id(workflowActionTransition.id),
                workflowActionTransition,
            );
        },
    });
};
