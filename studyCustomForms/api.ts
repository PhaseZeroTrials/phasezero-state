import { z } from 'zod';
import axios from 'axios';

export const StudyCustomForm = z.object({
    id: z.string(),
    studyId: z.number(),
    formId: z.number(),
});

export type IStudyCustomForm = z.infer<typeof StudyCustomForm>;

const getStudyCustomForms = async (studyId: number) => {
    const { data } = await axios.get(`/StudyCustomForms/study/${studyId}`);
    return StudyCustomForm.array().parse(data);
};

export default {
    getStudyCustomForms,
};
