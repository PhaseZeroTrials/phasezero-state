import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const trialTaskQueryKeys = {
    all: ['trialTask'] as const,
    id: (id: Guid) => [...trialTaskQueryKeys.all, id] as const,
    study: () => [...trialTaskQueryKeys.all, 'study'] as const,
    studyId: (studyId: number) => [...trialTaskQueryKeys.study(), studyId] as const,
    subject: () => [...trialTaskQueryKeys.all, 'subject'] as const,
    subjectId: (subjectId: number) => [...trialTaskQueryKeys.subject(), subjectId] as const,
};

export const useRecurringTrialTaskBySubjectId = (subjectId: number, options?: QueryOptions) =>
    useQuery(
        trialTaskQueryKeys.subjectId(subjectId),
        () => {
            return api.getRecurringTasksForSubject(subjectId);
        },
        options,
    );

export const useTrialTaskByStudyId = (studyId: number, options?: QueryOptions) =>
    useQuery(
        trialTaskQueryKeys.studyId(studyId),
        () => {
            return api.getTrialTasksForProject(studyId);
        },
        options,
    );
