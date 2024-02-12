import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';
import { DateOrString } from '@pz/state/common';

// Define the Segment schema using Zod
export const Segment = z.object({
    id: z.string(),
    name: z.string(),
    query: z.string(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
});

// Create a partial for Segment
const PartialSegment = Segment.partial({ id: true, query: true, createdAt: true, updatedAt: true });

export type ISegment = z.infer<typeof Segment>;
export type IPartialSegment = z.infer<typeof PartialSegment>;

async function getAllSegments(): Promise<ISegment[]> {
    try {
        const { data } = await axios.get(`/segments`);
        return data.map((segment: any) => Segment.parse(segment));
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getSegment(segmentId: string): Promise<ISegment> {
    try {
        const { data } = await axios.get(`/segments/${segmentId}`);
        return Segment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createSegment(segment: IPartialSegment): Promise<ISegment> {
    try {
        const { data } = await axios.post(`/segments`, segment);
        return Segment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateSegment(segment: IPartialSegment): Promise<ISegment> {
    try {
        const { data } = await axios.put(`/segments`, segment);
        return Segment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteSegment(segmentId: string): Promise<ISegment> {
    try {
        const { data } = await axios.delete(`/segments/${segmentId}`);
        return Segment.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getSegment,
    getAllSegments,
    createSegment,
    updateSegment,
    deleteSegment,
};
