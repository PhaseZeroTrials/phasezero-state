import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const studyCustomFormQueryKeys = {
    all: ['studyCustomForm'] as const,
    id: (id: Guid) => [...studyCustomFormQueryKeys.all, id] as const,
    studyId: (studyId: number) => [...studyCustomFormQueryKeys.all, 'studyId', studyId] as const,
};

export const useStudyCustomFormByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(
        studyCustomFormQueryKeys.studyId(studyId),
        () => {
            return api.getStudyCustomForms(studyId);
        },
        options,
    );
