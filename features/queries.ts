import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { IFeature } from './api';

export const featureQueryKeys = {
    all: ['features'] as const,
    id: (id: Guid) => [...featureQueryKeys.all, id] as const,
    study: () => [...featureQueryKeys.all, 'study'] as const,
    studyId: (studyId: number) => [...featureQueryKeys.all, studyId],
};

export const useStudyFeatures = (studyId: number) => {
    return useQuery(featureQueryKeys.studyId(studyId), () => api.getStudyFeatures(studyId));
};

export const useUpdateFeature = (options?: { onError?: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation(
        (feature: IFeature) => {
            return api.updateFeature(feature);
        },
        {
            ...options,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries(featureQueryKeys.id(data.id));
                queryClient.invalidateQueries(featureQueryKeys.all);
            },
        },
    );
};
