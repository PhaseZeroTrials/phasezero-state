import axios from 'axios';
import { logger } from '../../utils';
import { ISubject, ISubjectQueryParams } from './model';

const getSubjectsForStudyByPage = async (studyId: number, endingBefore: number, queryParam?: string) => {
    try {
        let url = `/Subjects/studies/${studyId}?`;

        if (queryParam != null) {
            url += `q=${queryParam}&`;
        }

        if (endingBefore != null) {
            url += `endingBefore=${endingBefore}&`;
        }

        const { data } = await axios.get<{ subjects: ISubject[]; totalSubjectCountForStudy: number }>(url);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

async function getSubjectsForStudy(
    studyId: number,
    queryParams?: ISubjectQueryParams,
): Promise<{ subjects: ISubject[]; totalSubjectCountForStudy: number }> {
    try {
        let url = `/Subjects/studies/${studyId}?`;

        if (queryParams?.q != null) {
            url += `q=${queryParams?.q}&`;
        }

        if (queryParams?.startingAfter != null) {
            url += `startingAfter=${queryParams.startingAfter}&`;
        }

        if (queryParams?.endingBefore != null) {
            url += `endingBefore=${queryParams.endingBefore}&`;
        }

        if (queryParams?.limit != null) {
            url += `limit=${queryParams.limit}&`;
        }

        const { data } = await axios.get<{ subjects: ISubject[]; totalSubjectCountForStudy: number }>(url);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getSubjectsWithMetaData(studyId: number, queryParams?: ISubjectQueryParams) {
    const url = `/Subjects/study/${studyId}/metadata`;

    // Check if queryParams?.q is not null

    const urlParams = new URLSearchParams();
    if (queryParams?.q != null) {
        urlParams.append('q', queryParams.q);
    }

    // queryParams?.subjectName is not null
    if (queryParams?.subjectName != null) {
        urlParams.append('subjectName', queryParams.subjectName);
    }

    // and queryParams.lastSubjectId is not null
    if (queryParams?.lastSubjectId != null) {
        urlParams.append('lastSubjectId', queryParams.lastSubjectId.toString());
    }

    if (queryParams?.lastUpdatedAt != null) {
        urlParams.append('lastUpdatedAt', queryParams.lastUpdatedAt.toString());
    }

    // combine the url and urlParams
    const urlWithParams = `${url}?${urlParams.toString()}`;

    return await axios.get(urlWithParams);
}

async function getSubjectsWithGlobalMetaData(queryParams?: ISubjectQueryParams) {
    const url = `/Subjects/metadata`;

    // Check if queryParams?.q is not null

    const urlParams = new URLSearchParams();
    if (queryParams?.q != null) {
        urlParams.append('q', queryParams.q);
    }

    // queryParams?.subjectName is not null
    if (queryParams?.subjectName != null) {
        urlParams.append('subjectName', queryParams.subjectName);
    }

    // and queryParams.lastSubjectId is not null
    if (queryParams?.lastSubjectId != null) {
        urlParams.append('lastSubjectId', queryParams.lastSubjectId.toString());
    }

    if (queryParams?.lastUpdatedAt != null) {
        urlParams.append('lastUpdatedAt', queryParams.lastUpdatedAt.toString());
    }

    // combine the url and urlParams
    const urlWithParams = `${url}?${urlParams.toString()}`;

    return await axios.get(urlWithParams);
}

async function getSubjectByEmail(email: string): Promise<ISubject> {
    try {
        const { data } = await axios.get(`/Subjects/email/${email}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getSubjectByPhoneNumber(phoneNumber: string): Promise<ISubject> {
    try {
        const { data } = await axios.get(`/Subjects/phone/${phoneNumber}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}
async function deleteSubject(subjectId: number): Promise<ISubject> {
    try {
        const { data } = await axios.delete(`/Subjects/${subjectId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function addSubjectForStudy(subject: ISubject): Promise<ISubject> {
    try {
        // Note: It is weird to have an implicit routeParam of studyId, but it
        // is placed instead on the subject object.
        const { data } = await axios.post(`/Subjects/study`, subject);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getSubject(subjectId: number): Promise<ISubject> {
    try {
        const { data } = await axios.get(`/Subjects/${subjectId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateSubject(subject: ISubject): Promise<ISubject> {
    try {
        const { data } = await axios.put(`/Subjects/${subject.id}`, subject);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function inviteSubjectToPortal(subject: ISubject): Promise<ISubject> {
    try {
        const { data } = await axios.post(`/Subjects/invite`, subject);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getAllSubjects(): Promise<ISubject[]> {
    try {
        const { data } = await axios.get(`/Subjects`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createSubject(subjectDefinition: ISubject): Promise<any> {
    try {
        const { data } = await axios.post(`/subjects`, subjectDefinition);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    createSubject,
    getAllSubjects,
    getSubjectsForStudy,
    getSubjectByEmail,
    getSubjectByPhoneNumber,
    getSubjectsForStudyByPage,
    getSubjectsWithMetaData,
    getSubjectsWithGlobalMetaData,
    deleteSubject,
    addSubjectForStudy,
    getSubject,
    updateSubject,
    inviteSubjectToPortal,
};
