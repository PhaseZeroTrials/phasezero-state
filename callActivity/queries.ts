import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import api, { IPartialCallActivity } from '@pz/state/callActivity/api';
import { QueryOptions } from '@pz/state/common';

const callActivityQueryKeys = {
    id: (id: string) => ['callActivity', id] as const,
    conversation: (conversationId: string) => ['callActivities', 'conversation', conversationId] as const,
};

export const useCreateCallActivity = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((callActivity: IPartialCallActivity) => api.createCallActivity(callActivity), {
        onSuccess: (newCallActivity) => {
            options && options.onSuccess && options.onSuccess(newCallActivity);
            queryClient.setQueryData(callActivityQueryKeys.id(newCallActivity.id), newCallActivity);
            queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(newCallActivity.conversationId));
        },
    });
};

export const useUpdateCallActivity = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (params: { id: string; callActivity: IPartialCallActivity }) =>
            api.updateCallActivity(params.id, params.callActivity),
        {
            onSuccess: (updatedCallActivity) => {
                queryClient.setQueryData(callActivityQueryKeys.id(updatedCallActivity.id), updatedCallActivity);
                queryClient.invalidateQueries(
                    conversationActivityQueryKeys.conversationId(updatedCallActivity.conversationId),
                );
            },
        },
    );
};
