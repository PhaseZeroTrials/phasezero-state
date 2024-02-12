import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import subjectService from './api';
import { ISubject, ISubjectQueryParams } from './model';
import { conversationParticipantQueryKeys } from '@pz/state/conversationParticipants/queries';

export const subjectQueryKeys = {
    all: ['subjects'] as const,
    id: () => [...subjectQueryKeys.all, 'id'] as const,
    byId: (id: number) => [...subjectQueryKeys.id(), id.toString()] as const,
    email: () => [...subjectQueryKeys.all, 'email'] as const,
    byEmail: (email: string) => [...subjectQueryKeys.email(), email] as const,
    phoneNumber: () => [...subjectQueryKeys.all, 'phoneNumber'] as const,
    byPhoneNumber: (phoneNumber: string) => [...subjectQueryKeys.phoneNumber(), phoneNumber] as const,
    study: () => [...subjectQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...subjectQueryKeys.study(), id?.toString()] as const,
    params: (studyId: number) => [...subjectQueryKeys.studyId(studyId), 'params'] as const,
    byParams: (studyId: number, q: string) => [...subjectQueryKeys.params(studyId), q] as const,
};

export const useInfinteSubjectsByStudyId = (studyId: number, queryParam?: string, options?: QueryOptions) => {
    const q = queryParam || 'none';
    return useInfiniteQuery(
        subjectQueryKeys.byParams(studyId, q),
        // max int for C#
        ({ pageParam = 2147483647 }) => {
            return subjectService.getSubjectsForStudyByPage(studyId, pageParam, queryParam);
        },
        {
            ...options,
            getNextPageParam: (lastPage) => {
                const { subjects } = lastPage;
                if (!subjects || subjects.length === 0 || subjects.length >= lastPage.totalSubjectCountForStudy) {
                    return false;
                }

                const _endingBefore = subjects[subjects.length - 1].id;
                return _endingBefore;
            },
        },
    );
};

export const useSubjectsByStudyId = (studyId: number, queryParams?: ISubjectQueryParams, options?: QueryOptions) => {
    const q = queryParams?.q ? queryParams.q : 'none';
    const shouldKeep = queryParams?.endingBefore ? true : false;
    return useQuery(
        subjectQueryKeys.byParams(studyId, q),
        () => {
            return subjectService.getSubjectsForStudy(studyId, queryParams);
        },
        {
            ...options,
            keepPreviousData: shouldKeep,
        },
    );
};

export const useSubjectById = (id: number, options?: QueryOptions) =>
    useQuery(subjectQueryKeys.byId(id), () => subjectService.getSubject(id), { ...options });

export const useSubjectByEmail = (email: string, options?: QueryOptions) =>
    useQuery(subjectQueryKeys.byEmail(email), () => subjectService.getSubjectByEmail(email), { ...options });

export const useSubjectByPhoneNumber = (phoneNumber: string, options?: QueryOptions) =>
    useQuery(subjectQueryKeys.byPhoneNumber(phoneNumber), () => subjectService.getSubjectByPhoneNumber(phoneNumber), {
        ...options,
    });

export const useCreateSubjectForStudy = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    // The parameter is typed as an interface, but we often use Zod as well
    return useMutation(
        (subject: ISubject) => {
            return subjectService.addSubjectForStudy(subject);
        },
        {
            ...options,
            onSuccess: async (response) => {
                options && options.onSuccess && options.onSuccess(response);
                if (response.studyId) {
                    queryClient.invalidateQueries([subjectQueryKeys.studyId(response.studyId)]);
                }
            },
        },
    );
};

export const useUpdateSubject = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (subject: ISubject) => {
            return subjectService.updateSubject(subject);
        },
        {
            ...options,
            onSuccess: async (response) => {
                options && options.onSuccess && options.onSuccess(response);

                if (response.studyId) {
                    queryClient.invalidateQueries([subjectQueryKeys.studyId(response.studyId)]);
                }

                if (response.id) {
                    queryClient.invalidateQueries([subjectQueryKeys.byId(response.id)]);
                }

                // Invalidate all the conversation participant keys
                queryClient.invalidateQueries(conversationParticipantQueryKeys.all);
            },
        },
    );
};

export const useDeleteSubject = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (id: number) => {
            return subjectService.deleteSubject(id);
        },
        {
            ...options,
            onSuccess: async (response) => {
                options && options.onSuccess && options.onSuccess(response);

                if (response.studyId) {
                    queryClient.invalidateQueries([subjectQueryKeys.studyId(response.studyId)]);
                }

                if (response.id) {
                    queryClient.removeQueries([subjectQueryKeys.byId(response.id)]);
                }
            },
        },
    );
};

export const useInviteSubjectToPortal = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (subject: ISubject) => {
            return subjectService.inviteSubjectToPortal(subject);
        },
        {
            ...options,
            onSuccess: async (response) => {
                options && options.onSuccess && options.onSuccess(response);

                if (response.studyId) {
                    queryClient.invalidateQueries([subjectQueryKeys.studyId(response.studyId)]);
                }

                if (response.id) {
                    queryClient.invalidateQueries([subjectQueryKeys.byId(response.id)]);
                }
            },
        },
    );
};

export const useGetAllSubjects = (options?: QueryOptions) => {
    return useQuery(subjectQueryKeys.all, () => subjectService.getAllSubjects(), { ...options });
};

export const useCreateSubject = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (subjectDefinition: ISubject) => {
            // Assuming you've got the type defined
            return subjectService.createSubject(subjectDefinition);
        },
        {
            ...options,
            onSuccess: async (response) => {
                options && options.onSuccess && options.onSuccess(response);

                // Invalidate any related queries as necessary
                queryClient.invalidateQueries(subjectQueryKeys.all);
            },
        },
    );
};
