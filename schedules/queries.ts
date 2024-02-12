import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';
import { ISchedule } from '@pz/state';
import { IScheduleSubject } from '@pz/state/schedules/model';

const scheduleQueryKeys = {
    all: ['schedules'] as const,
    id: (id: string) => ['schedules', id] as const,
    study: () => [...scheduleQueryKeys.all, 'study'] as const,
    studyId: (id: number) => [...scheduleQueryKeys.study(), id] as const,
    subject: () => [...scheduleQueryKeys.all, 'subject'] as const,
    subjectId: (id: number) => [...scheduleQueryKeys.subject(), id] as const,
};

export const useSchedulesByStudyId = (studyId: number, includeSchema?: boolean, options?: QueryOptions) =>
    useQuery(
        scheduleQueryKeys.studyId(studyId),
        () => {
            return api.getSchedulesForStudy(studyId, includeSchema);
        },
        options,
    );

export const useScheduleBySubjectId = (subjectId: number, options?: QueryOptions) =>
    useQuery(
        scheduleQueryKeys.subjectId(subjectId),
        () => {
            return api.getScheduleForSubject(subjectId);
        },
        options,
    );

export const useAssignScheduleToSubject = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (scheduleSubject: IScheduleSubject) => {
            return api.assignScheduleToSubject(
                scheduleSubject.subjectId,
                scheduleSubject.scheduleId,
                scheduleSubject.trialTaskGroupIds,
            );
        },
        {
            ...options,
            onSuccess: (data) => {
                options?.onSuccess?.(data);
                queryClient.invalidateQueries(scheduleQueryKeys.all);
                queryClient.invalidateQueries(scheduleQueryKeys.subject());
            },
        },
    );
};

export const useScheduleById = (id: Guid, options?: QueryOptions) =>
    useQuery(
        scheduleQueryKeys.id(id),
        () => {
            return api.getScheduleById(id);
        },
        options,
    );
export const useCreateSchedule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (schedule: ISchedule) => {
            return api.createSchedule(schedule);
        },
        {
            ...options,
            onSuccess: (schedule) => {
                options?.onSuccess?.(schedule);
                queryClient.invalidateQueries(scheduleQueryKeys.studyId(schedule.studyId));
            },
        },
    );
};

export const useDeleteSchedule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (id: Guid) => {
            return api.deleteSchedule(id);
        },
        {
            ...options,
            onSuccess: (record) => {
                options?.onSuccess?.(record.id);
                queryClient.invalidateQueries(scheduleQueryKeys.id(record?.id as string));
                queryClient.invalidateQueries(scheduleQueryKeys.studyId(record?.studyId as number));
            },
        },
    );
};
