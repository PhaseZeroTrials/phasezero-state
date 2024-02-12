import axios from 'axios';
import { z } from 'zod';
import { logger } from '@pz/utils';

export enum FeatureTypeEnum {
    Home = '846b42a6-2c6b-449a-b017-835fac1692a0',
    Tasks = 'dfb6a9f9-c3fd-4c4d-883f-b68d4c1da108',
    Calendar = '54335de5-1aab-40e8-b60d-4ad1d5e16de8',
    Messages = 'be8b1bdd-cb28-442e-a2af-2a84b46b79c5',
    Documents = '63625ee8-1b01-4676-8b3e-bcee8276ab26',
    CarePlan = '8c4fb715-7f80-4404-8f68-2c6155415ca8',
}

// Define the Feature schema
export const Feature = z.object({
    id: z.string(),
    studyId: z.number(),
    name: z.string(),
    featureTypeId: z.string(),
    isEnabled: z.boolean(),
});

// Type for instances of Feature
export type IFeature = z.infer<typeof Feature>;

const getStudyFeatures = async (studyId: number): Promise<IFeature[]> => {
    try {
        const { data } = await axios.get(`/FeatureFlags/study/${studyId}`);

        // Check for null or undefined

        if (!data) {
            return [];
        }
        return data.map((item: any) => Feature.parse(item));
    } catch (error: any) {
        logger.log(error);
        if (error?.response?.status === 404) {
            return [];
        } else {
            throw error;
        }
    }
};

const updateFeature = async (feature: IFeature): Promise<IFeature> => {
    const { data } = await axios.put(`/FeatureFlags/`, feature);
    return Feature.parse(data);
};

export default {
    getStudyFeatures,
    updateFeature,
};
