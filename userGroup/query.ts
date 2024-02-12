import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import userGroupService from './api';
import { IUserGroup } from './model';

const userGroupKeys = {
    all: ['userGroups'] as const,
    id: (id: string) => [...userGroupKeys.all, id] as const,
    studies: () => [...userGroupKeys.all, 'study'] as const,
    study: (id: number | undefined) => [...userGroupKeys.studies(), id] as const,
};

const useAllUserGroups = (options: any) =>
    useQuery(
        userGroupKeys.all,
        () => {
            return userGroupService.getAllUserGroups();
        },
        options,
    );

const useUserGroupById = (id: string, options: any) =>
    useQuery(
        userGroupKeys.id(id),
        () => {
            return userGroupService.getUserGroupById(id);
        },
        options,
    );

export const useUserGroupsByStudy = (id: number, options: any) =>
    useQuery(
        userGroupKeys.study(id),
        () => {
            return userGroupService.getUserGroupsByStudyId(id);
        },
        options,
    );

const useAddUserGroup = (studyId: number | undefined, options: any) => {
    const queryClient = useQueryClient();

    return useMutation(
        (group: IUserGroup) => {
            const userGroup: IUserGroup = {
                studyId: studyId,
                name: group.name,
                description: group.description,
            };

            return userGroupService.createUserGroup(userGroup);
        },
        {
            ...options,
            onSuccess: (group: IUserGroup) => {
                options && options.onSuccess && options.onSuccess(group);

                // Invalidate the user group related to a specific study
                queryClient.invalidateQueries(userGroupKeys.study(group.studyId));

                // Invalidate the entire list of user groups to refresh the data
                queryClient.invalidateQueries(userGroupKeys.all);
            },
        },
    );
};

const useDeleteUserGroup = (options: any) => {
    const queryClient = useQueryClient();

    return useMutation(
        (group: IUserGroup) => {
            return userGroupService.deleteUserGroup(group.id as string);
        },
        {
            ...options,
            onSuccess: (group: IUserGroup) => {
                options && options.onSuccess && options.onSuccess(group);

                // Invalidate the user group related to a specific study
                queryClient.invalidateQueries(userGroupKeys.study(group.studyId));

                // Invalidate the entire list of user groups to refresh the data
                queryClient.invalidateQueries(userGroupKeys.all);
            },
        },
    );
};

export default {
    useAddUserGroup,
    useAllUserGroups,
    useDeleteUserGroup,
    useUserGroupById,
    useUserGroupsByStudy,
};
