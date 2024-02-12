import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const studyUserRoleQueryKeys = {
    all: ['studyUserRole'] as const,
    id: (id: Guid) => [...studyUserRoleQueryKeys.all, id] as const,
    studyId: (studyId: number) => [...studyUserRoleQueryKeys.all, 'studyId', studyId] as const,
    userId: (userId: number) => [...studyUserRoleQueryKeys.all, 'userId', userId] as const,
    studyIdAndUserId: (studyId: number, userId: number) =>
        [...studyUserRoleQueryKeys.all, 'studyId', studyId, 'userId', userId] as const,
};

export const useStudyUserRolesByStudyAndUser = (studyId: number, userId: number, options?: QueryOptions) =>
    useQuery(
        studyUserRoleQueryKeys.studyIdAndUserId(studyId, userId),
        () => {
            return api.getStudyUserRoleForStudyAndUser(studyId, userId);
        },
        options,
    );
