import axios from 'axios';
import { z } from 'zod';

import { User } from '@pz/state/user';
import { logger } from '@pz/utils';
import { ZodDocument } from '@pz/state/documents/model';

export enum RecipientRoleType {
    To = '509a2f05-6aa2-4e93-9717-b99a9e0c10c0',
    Cc = '8a8ca460-4822-4b8a-9cdc-60d03e3f7af7',
    Bcc = '3e6f56c4-ecf4-4a9e-bc51-26b6b5f778e6',
}
export const Recipient = z.object({
    messageId: z.string(),
    subjectId: z.number(),
    recipientRoleTypeId: z.string(),
});

export const MessageDocument = z.object({
    id: z.string(),
    messageId: z.string(),
    documentId: z.string(),
    document: ZodDocument,
});

export const Message = z.object({
    id: z.string(),
    conversationId: z.string(),
    creatorId: z.number().optional(),
    creator: User.optional(),
    subjectId: z.number().optional(),
    fromNumber: z.string().optional(),
    body: z.string().optional(),
    snippet: z.string().optional(),
    type: z.number().optional(),
    avatar: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    recipients: z.array(Recipient).optional(),
    messageDocuments: z.array(MessageDocument).optional(),
});

export const MessageQueryParams = z.object({
    status: z.number().optional(),
    creatorId: z.number().optional(),
});

export const PartialMessage = z.object({
    conversationId: z.string(),
    userId: z.number(),
    body: z.string(),
    messageDocuments: z.array(MessageDocument).optional(),
});

export type IMessage = z.infer<typeof Message>;

export type IPartialMessage = z.infer<typeof PartialMessage>;

export type IRecipient = z.infer<typeof Recipient>;

export type IMessageDocument = z.infer<typeof MessageDocument>;

const getMessagesForConversation = async (conversationId: string) => {
    const { data } = await axios.get(`/messages/conversation/${conversationId}/`);
    return Message.array().parse(data);
};

const getMessagesByQueryParams = async (queryParams?: z.infer<typeof MessageQueryParams>) => {
    try {
        const { data } = await axios.get('/messages/', { params: queryParams });
        return Message.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const sendInternalMessage = async (messageDefinition: IPartialMessage) => {
    try {
        const { data } = await axios.post('/messages/send', messageDefinition);
        return Message.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getMessagesForConversation,
    getMessagesByQueryParams,
    sendInternalMessage,
};
