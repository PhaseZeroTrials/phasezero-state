import axios from 'axios';
import { IFormProperty, IFormPropertyDefinition } from './model';

async function getScheduleFormPropertyWithStudyId(studyId: number): Promise<IFormProperty[]> {
    const { data } = await axios.get(`/StudyFormProperties/study/${studyId}/schedule`);
    return data;
}

const getFormPropertiesForStudy = async (studyId: number): Promise<IFormProperty[]> => {
    const { data } = await axios.get(`/StudyFormProperties/study/${studyId}`);
    return data;
};

const getFormPropertiesForTask = async (trialTaskId: string) => {
    const { data } = await axios.get(`/StudyFormProperties/trialTask/${trialTaskId}`);
    return data;
};

const getFormPropertiesForAllCustomAttributes = async (): Promise<IFormProperty[]> => {
    const { data } = await axios.get('/StudyFormProperties/allCustomAttributes');
    return data;
};

const getFormPropertiesForForm = async (formId: number) => {
    const { data } = await axios.get(`/StudyFormProperties/form/${formId}`);
    return data;
};

async function createOrUpdateFormPropertiesForStudy(studyId: number, data: IFormPropertyDefinition[]) {
    return await axios.post(`/StudyFormProperties/study/${studyId}`, data);
}

async function bulkCreateOrUpdateFormProperties(formProperty: IFormProperty[]) {
    const { data } = await axios.post('/StudyFormProperties/allCustomAttributes', formProperty);
    return data;
}

export default {
    getScheduleFormPropertyWithStudyId,
    getFormPropertiesForStudy,
    getFormPropertiesForForm,
    getFormPropertiesForTask,
    getFormPropertiesForAllCustomAttributes,
    createOrUpdateFormPropertiesForStudy,
    bulkCreateOrUpdateFormProperties,
};
