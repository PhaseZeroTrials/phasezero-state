import axios from 'axios';
import { z } from 'zod';

import { IUser, User } from '../user';
import { QueueTask } from '../queue';
import { Subject } from '@pz/state/subjects';
import { Message } from '@pz/state/messages';
import { ConversationParticipant } from '@pz/state/conversationParticipants/api';
import { logger } from '@pz/utils';
import { ConversationTask } from '@pz/state/conversationTasks/api';

export const ConversationType = z.object({
    id: z.string(),
    value: z.string(),
});
export type IConversationType = z.infer<typeof ConversationType>;

export enum ConversationTypeEnum {
    Gmail = '8e2a3333-f41a-40b4-95aa-740b52950abe',
    Sms = '4bb071b6-0002-4505-b210-048999d362e7',
    InApp = '6634b639-ff4a-412c-9616-1b65d8c9d3b0',
    EmailDKIM = 'd6a7e222-e0c4-4f03-8182-e1d1b2c9f7e5',
    InternalChannel = 'add4d3a5-17a7-4c05-b5f1-0adcf4d7c8c1',
}

export type ConversationQueryParams = {
    status?: string;
    archived?: boolean;
    pageNumber?: number;
    pageSize?: number;
};

export const Conversation = z.object({
    id: z.string(),
    taskId: z.string().optional(),
    subjectId: z.number().optional(),
    inboxId: z.string().optional(),
    channelId: z.string().optional(),
    creatorId: z.number().optional(),
    name: z.string().optional(),
    subject: Subject.optional(),
    creator: User.optional(),
    task: QueueTask.optional(),
    acsThreadId: z.string().optional(),
    lastMessage: Message.optional(),
    avatar: z.string().optional(), // For now this is always null
    conversationType: ConversationType.optional(),
    conversationTypeId: z.string().optional(),
    conversationParticipants: ConversationParticipant.array().optional(),
    conversationTaskId: z.string().optional(),
    conversationTask: ConversationTask.optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type IConversation = z.infer<typeof Conversation>;

// When creating a comment we want the Comment type, minus an id since
// it hasn't been created yet.
const PartialConversation = Conversation.partial({ id: true, createdAt: true, updatedAt: true });
export type IPartialConversation = z.infer<typeof PartialConversation>;

export interface IUserConversation {
    conversation: IConversation;
    user: IUser;
    AccessToken: string;
}

const getAllConversations = async () => {
    const { data } = await axios.get(`/Conversations`);
    return Conversation.array().parse(data);
};

const getConversationById = async (id: Guid) => {
    const { data } = await axios.get(`/Conversations/${id}`);
    return Conversation.parse(data);
};

const getConversationBySubjectId = async (subjectId: number) => {
    const { data } = await axios.get(`/Conversations/Subject/${subjectId}`);
    if (!data) {
        return null;
    }
    return Conversation.parse(data);
};

const getConversationsByInboxId = async (inboxId: Guid, queryParams?: ConversationQueryParams) => {
    try {
        const { data } = await axios.get(`/Conversations/Inbox/${inboxId}`, { params: queryParams });
        if (!data) {
            return null;
        }
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updateConversation = async (conversationId: string, conversationData: IPartialConversation) => {
    try {
        const { data } = await axios.put(`/Conversations/${conversationId}`, conversationData);
        return Conversation.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getV2ConversationsBySubjectId = async (subjectId: number) => {
    try {
        const { data } = await axios.get(`/Conversations/subjectv2/${subjectId}`);
        if (!data) {
            return null;
        }
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const createConversationForSubject = async (subjectId: number) => {
    const { data } = await axios.post(`/Conversations/Subject/${subjectId}`);
    return Conversation.parse(data);
};

const getJoinConversationInfo = async (conversationId: Guid): Promise<IUserConversation> => {
    const { data } = await axios.get(`/Conversations/${conversationId}/join`);
    return data;
};

const getMessageCount = async (conversationId: Guid) => {
    const { data } = await axios.get(`/Conversations/${conversationId}/message/count`);
    return data;
};

const getConversationForStudy = async (studyId: number) => {
    const { data } = await axios.get(`/Conversations/Study/${studyId}`);
    return Conversation.array().parse(data);
};

const getConversationForUser = async (userId: number, queryParams?: ConversationQueryParams) => {
    try {
        const { data } = await axios.get(`/Conversations/User/${userId}`, { params: queryParams });
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export type ConversationBulkRequest = {
    ConversationIds: string[];
};

const bulkArchiveConversations = async (request: ConversationBulkRequest) => {
    await axios.post(`/Conversations/archive/bulk`, request);
};

const bulkUnarchiveConversations = async (request: ConversationBulkRequest) => {
    await axios.post(`/Conversations/unarchive/bulk`, request);
};

const searchConversations = async (keyword?: string, status?: string, assignee?: string) => {
    try {
        const { data } = await axios.get(`/Conversations/search`, {
            params: {
                keyword,
                status,
                assignee,
            },
        });
        if (!data) {
            return null;
        }
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

// Function to get internal channel conversations
const getInternalChannelConversations = async () => {
    try {
        const { data } = await axios.get('/Conversations/internal-channels');
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

// Function to create a new internal channel conversation
const createInternalChannelConversation = async (name: string) => {
    try {
        const { data } = await axios.post(`/Conversations/internal-channel/${name}`);
        return Conversation.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const findOrCreateDirectConversation = async (userIds: number[]): Promise<IConversation | null> => {
    try {
        const { data } = await axios.post('/Conversations/direct-conversation', userIds);
        return Conversation.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getMentionedConversations = async (userId: number, queryParams?: ConversationQueryParams) => {
    try {
        const { data } = await axios.get(`/Conversations/user/${userId}/mentioned-conversations`, {
            params: queryParams,
        });
        if (!data) {
            return null;
        }
        return Conversation.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getAllConversations,
    getV2ConversationsBySubjectId,
    getConversationForStudy,
    getConversationById,
    getConversationBySubjectId,
    getConversationsByInboxId,
    getJoinConversationInfo,
    createConversationForSubject,
    getMessageCount,
    getConversationForUser,
    bulkArchiveConversations,
    bulkUnarchiveConversations,
    searchConversations,
    getInternalChannelConversations,
    createInternalChannelConversation,
    updateConversation,
    findOrCreateDirectConversation,
    getMentionedConversations,
};
