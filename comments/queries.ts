import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IComment, IPartialComment } from './api';

const commentQueryKeys = {
    all: ['comment'] as const,
    id: (id: Guid) => [...commentQueryKeys.all, id] as const,
    creator: () => [...commentQueryKeys.all, 'creator'] as const,
    creatorId: (creatorId: number) => [...commentQueryKeys.creator(), creatorId] as const,
    task: () => [...commentQueryKeys.all, 'task'] as const,
    taskId: (taskId: Guid) => [...commentQueryKeys.task(), taskId] as const,
};

export const useAllComments = () => {
    return api.getAllComments();
};

export const useCommentById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        commentQueryKeys.id(id),
        () => {
            return api.getCommentById(id);
        },
        options,
    );

export const useCommentsByUserId = (userId: number, options?: QueryOptions) =>
    useQuery(
        commentQueryKeys.creatorId(userId),
        () => {
            return api.getCommentsByUserId(userId);
        },
        options,
    );

export const useCommentsByTaskId = (taskId: Guid, options?: QueryOptions) =>
    useQuery(
        commentQueryKeys.taskId(taskId),
        () => {
            return api.getCommentsByTaskId(taskId);
        },
        options,
    );

export const useCreateComment = (options?: { onError?: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation(
        (comment: IPartialComment) => {
            return api.createComment(comment);
        },
        {
            ...options,
            onSuccess: (comment) => {
                // Go ahead and add this to the id collection.
                queryClient.setQueryData(commentQueryKeys.id(comment.id), comment);
                queryClient.invalidateQueries(commentQueryKeys.creatorId(comment.creatorId));
                queryClient.invalidateQueries(commentQueryKeys.taskId(comment.taskId));
            },
        },
    );
};

export const useUpdateComment = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (comment: IComment) => {
            return api.updateComment(comment);
        },
        {
            ...options,
            onSuccess: (comment) => {
                // Go ahead and add this to the id collection.
                queryClient.setQueryData(commentQueryKeys.id(comment.id), comment);
                queryClient.invalidateQueries(commentQueryKeys.creatorId(comment.creatorId));
                queryClient.invalidateQueries(commentQueryKeys.taskId(comment.taskId));
            },
        },
    );
};

export const useDeleteComment = (options?: { onError?: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation(
        (commentId: Guid) => {
            return api.deleteComment(commentId);
        },
        {
            ...options,
            onSuccess: (comment) => {
                queryClient.invalidateQueries(commentQueryKeys.creatorId(comment.creatorId));
                queryClient.invalidateQueries(commentQueryKeys.taskId(comment.taskId));
                queryClient.invalidateQueries(commentQueryKeys.id(comment.id));
            },
        },
    );
};
