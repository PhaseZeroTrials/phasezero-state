import { z } from 'zod';

import { IStudy, Study } from '../studies';
import { DateOrString } from '../common';
import { IUser, User } from '../user';

// export enum Gender {
//     male = 'male',
//     female = 'female',
// }

// // Would z.enum(['male', 'female']) be better?
// const GenderEnum = z.nativeEnum(Gender);

export enum SubjectTypeEnum {
    Channel = 'a8ca3d0e-3a41-4e81-a3a5-0efcb3212d42',
    Teammate = 'f42d9e4f-6855-4d43-8891-2ca96e097855',
    Contact = 'e1037c5d-5d5d-4a97-9a20-d2e33590e024',
}

export interface ISubject {
    id?: number;
    identifier?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    sexAtBirth?: string;
    administrativeGender?: string;
    race?: string;
    ethnicity?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    timeZone?: string;
    licenseRegion?: string;
    studyId?: number;
    subjectTypeId?: string;
    study?: IStudy;
    createdAt?: string;
    updatedAt?: string;
    userId?: number;
    user?: IUser;
    createNewUser?: boolean;
}

export const Subject = z.object({
    id: z.number().optional(),
    identifier: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: DateOrString.optional(),
    sexAtBirth: z.string().optional(),
    administrativeGender: z.string().optional(),
    race: z.string().optional(),
    ethnicity: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    timeZone: z.string().optional(),
    licenseRegion: z.string().optional(),
    studyId: z.number().optional(),
    subjectTypeId: z.string().optional(),
    // // Stopping zod work here at User for now
    //study: Study.optional();
    study: Study.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    userId: z.number().optional(),
    user: User.optional(),
});

export interface ISubjectQueryParams {
    lastSubjectId?: number;
    lastUpdatedAt?: string;
    q?: string;
    subjectName?: string;
    startingAfter?: number;
    endingBefore?: number;
    limit?: number;
}

export enum GenderAbbreviation {
    male = 'm',
    female = 'f',
}
