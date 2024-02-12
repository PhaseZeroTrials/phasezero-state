import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialPatientChartConfig } from './api';

const patientChartConfigQueryKeys = {
    all: ['patientChartConfig'] as const,
    id: (id: Guid) => [...patientChartConfigQueryKeys.all, id] as const,
    study: () => [...patientChartConfigQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...patientChartConfigQueryKeys.study(), id] as const,
};

export const useBulkCreateOrUpdatePatientChartConfig = (studyId, options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (patientChartConfigs: IPartialPatientChartConfig[]) => {
            return api.bulkCreateOrUpdatePatientChartConfig(studyId, patientChartConfigs);
        },
        {
            ...options,
            onSuccess: (responses) => {
                if (responses.length > 0) {
                    queryClient.invalidateQueries(patientChartConfigQueryKeys.studyId(responses[0].studyId));
                } else {
                    queryClient.invalidateQueries(patientChartConfigQueryKeys.all);
                }
            },
        },
    );
};

export const useGetPatientChartSummaryBySubjectId = (
    props: { studyId: number; subjectId: number },
    options?: QueryOptions,
) => {
    const { studyId, subjectId } = props;
    return useQuery(
        patientChartConfigQueryKeys.studyId(studyId),
        () => {
            return api.getPatientChartSummaryBySubjectId(subjectId);
        },
        options,
    );
};
