import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import userService from './api';
import { IPartialUser } from './model';

const userQueryKeys = {
    all: ['user'] as const,
    id: (id: number) => [...userQueryKeys.all, id] as const,
    workspace: () => [...userQueryKeys.all, 'workspace'] as const,
};

export const useWorkspaceUsers = () =>
    useQuery(userQueryKeys.workspace(), () => {
        return userService.getWorkSpaceUsers();
    });

export const useUserById = (id: number, options?: QueryOptions) =>
    useQuery(
        userQueryKeys.id(id),
        () => {
            return userService.getUserById(id);
        },
        options,
    );

export const useAcsCreateUser = (id: number, options?: QueryOptions) =>
    useQuery(
        userQueryKeys.id(id),
        () => {
            return userService.createAcsUser();
        },
        options,
    );

export const useUpdateUser = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (user: IPartialUser) => {
            return userService.updateUser(user);
        },
        {
            ...options,
            onSuccess: (user) => {
                options && options?.onSuccess && options.onSuccess(user);

                if (user.id) {
                    queryClient.setQueryData(userQueryKeys.id(user.id), user);
                }
            },
        },
    );
};
