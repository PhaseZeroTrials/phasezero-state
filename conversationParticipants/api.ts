import axios from 'axios';
import { z } from 'zod';
import { User } from '../user';
import { logger } from '@pz/utils';
import { Subject } from '@pz/state/subjects';

export const ConversationParticipant = z.object({
    id: z.string(),
    conversationId: z.string(),
    userId: z.number().optional(),
    user: User.optional(),
    subjectId: z.number().optional(),
    subject: Subject.optional(),
    phoneNumber: z.string().optional(),
});
export type IConversationParticipant = z.infer<typeof ConversationParticipant>;

// PartialConversationParticipant is used for updating a conversation participant
export const PartialConversationParticipant = ConversationParticipant.partial().omit({
    id: true,
});

export type IPartialConversationParticipant = z.infer<typeof PartialConversationParticipant>;

const getConversationParticipants = async (conversationId: string) => {
    try {
        const { data } = await axios.get(`/ConversationParticipants/conversation/${conversationId}`);
        return ConversationParticipant.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};
const inviteConversationParticipant = async (conversationParticipant: IPartialConversationParticipant) => {
    try {
        const { data } = await axios.post(
            `/ConversationParticipants/conversation/${conversationParticipant.conversationId}/invite`,
            {
                ...conversationParticipant,
            },
        );

        return ConversationParticipant.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getConversationParticipants,
    inviteConversationParticipant,
};
