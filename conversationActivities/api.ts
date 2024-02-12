import { z } from 'zod';
import axios from 'axios';
import { Message } from '@pz/state/messages';
import { DateOrString } from '@pz/state/common';
import { logger } from '@pz/utils';
import { Note } from '@pz/state/notes/api';
import { CallActivity } from '@pz/state/callActivity/api';

const TicketActivity = z.object({
    id: z.string(),
    ticketActivityTypeId: z.string(),
    userId: z.number().optional().nullable(),
    inboxId: z.string().optional().nullable(),
    creatorId: z.number().optional().nullable(),
});

export type ITicketActivity = z.infer<typeof TicketActivity>;

const VoicemailActivity = z.object({
    id: z.string(),
    recordingUrl: z.string().optional(),
    transcriptionText: z.string().optional(),
});

export type IVoicemailActivity = z.infer<typeof VoicemailActivity>;

const FormActivity = z.object({
    id: z.string(),
    subjectTrialTaskFormResponseId: z.string(),
});

export type IFormActivity = z.infer<typeof FormActivity>;

const ConversationActivity = z.object({
    message: Message.optional(),
    note: Note.optional(),
    ticketActivity: TicketActivity.optional(),
    callActivity: CallActivity.optional(),
    formActivity: FormActivity.optional(),
    voicemail: VoicemailActivity.optional(),
    conversationId: z.string(),
    conversationActivityType: z.string(),
    createdAt: DateOrString,
});

export type IConversationActivity = z.infer<typeof ConversationActivity>;

const getConversationActivitiesForConversation = async (conversationId: string): Promise<IConversationActivity[]> => {
    try {
        const { data } = await axios.get(`ConversationActivities/conversation/${conversationId}`);
        return ConversationActivity.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getConversationActivitiesForConversation,
};
