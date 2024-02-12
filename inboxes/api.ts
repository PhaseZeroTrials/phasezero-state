import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';
import { IStudy } from '@pz/state';
import { DateOrString } from '@pz/state/common';

export const Inbox = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().optional(),
    description: z.string().optional(),
    inboxTypeId: z.string(),
    userId: z.number().optional(),
    studyId: z.number().optional(),
    unreadCount: z.number().optional(),
    createdAt: DateOrString,
});

// Create a partial
const PartialInbox = Inbox.partial({ id: true, createdAt: true });

export type IInbox = z.infer<typeof Inbox>;
export type IPartialInbox = z.infer<typeof PartialInbox>;

export interface IStudyInbox extends IStudy {
    inboxes: IInbox[];
}

async function getInboxes(): Promise<IInbox[]> {
    try {
        const { data } = await axios.get(`/inboxes`);
        return Inbox.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getInbox(inboxId: Guid): Promise<IInbox> {
    try {
        const { data } = await axios.get(`/inboxes/${inboxId}`);
        return Inbox.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createInbox(inbox: IPartialInbox): Promise<IInbox> {
    try {
        const { data } = await axios.post(`/inboxes`, inbox);
        return Inbox.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateInbox(inbox: IPartialInbox): Promise<IInbox> {
    try {
        const { data } = await axios.put(`/inboxes`, inbox);
        return Inbox.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteInbox(inboxId: Guid): Promise<IInbox> {
    try {
        const { data } = await axios.delete(`/inboxes/${inboxId}`);
        return Inbox.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getInboxes,
    getInbox,
    createInbox,
    updateInbox,
    deleteInbox,
};
