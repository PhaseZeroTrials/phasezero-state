import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const studyQueryKeys = {
    all: ['studies'] as const,
    study: () => [...studyQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...studyQueryKeys.study(), id] as const,
};

export const useStudyById = (studyId: number, options?: QueryOptions) =>
    useQuery(
        studyQueryKeys.studyId(studyId),
        () => {
            return api.getStudy(studyId);
        },
        options,
    );

export const useStudies = (options?: QueryOptions) =>
    useQuery(
        studyQueryKeys.all,
        () => {
            return api.getStudies();
        },
        options,
    );
