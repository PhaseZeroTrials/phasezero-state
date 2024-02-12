import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialSegment } from './api';

export const segmentQueryKeys = {
    all: ['segments'] as const,
    segment: () => [...segmentQueryKeys.all, 'segment'] as const,
    segmentId: (id: string) => [...segmentQueryKeys.segment(), id] as const,
};

export const useAllSegments = (options?: QueryOptions) => {
    return useQuery(
        segmentQueryKeys.all,
        async () => {
            return api.getAllSegments();
        },
        options,
    );
};

export const useSegment = (segmentId: string, options?: QueryOptions) =>
    useQuery(
        segmentQueryKeys.segmentId(segmentId),
        () => {
            return api.getSegment(segmentId);
        },
        options,
    );

export const useCreateSegment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((segment: IPartialSegment) => api.createSegment(segment), {
        ...options,
        onSuccess: (segment) => {
            options && options.onSuccess && options.onSuccess(segment);
            queryClient.invalidateQueries(segmentQueryKeys.all);
        },
    });
};

export const useUpdateSegment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((segment: IPartialSegment) => api.updateSegment(segment), {
        ...options,
        onSuccess: (updatedSegment) => {
            options && options.onSuccess && options.onSuccess(updatedSegment);
            queryClient.invalidateQueries(segmentQueryKeys.segmentId(updatedSegment.id));

            // Repull for the nav
            queryClient.invalidateQueries(segmentQueryKeys.all);
        },
    });
};

export const useDeleteSegment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation((segmentId: string) => api.deleteSegment(segmentId), {
        ...options,
        onSuccess: (segment) => {
            options && options.onSuccess && options.onSuccess(segment);
            queryClient.invalidateQueries(segmentQueryKeys.all);
        },
    });
};

export default {
    useSegment,
    useAllSegments,
    useCreateSegment,
    useUpdateSegment,
    useDeleteSegment,
};
