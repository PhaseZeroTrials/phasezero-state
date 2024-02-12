import { z } from 'zod';
import axios from 'axios';
import { User } from '@pz/state/user';

export const ConversationTask = z.object({
    id: z.string(),
    assigneeId: z.number().optional().nullable(),
    assignee: User.optional(),
    inboxId: z.string().optional(),
    conversationId: z.string().optional(),
    conversationStatus: z.string().optional(),
    resolvedAt: z.string().nullable().optional(),
    nextConversationId: z.string().optional(),
});

export type IConversationTask = z.infer<typeof ConversationTask>;

export const getConversationTaskById = async (conversationTaskId: string): Promise<IConversationTask> => {
    try {
        const { data } = await axios.get(`/conversationTasks/${conversationTaskId}`);
        return ConversationTask.parse(data);
    } catch (error) {
        console.error('Error fetching ConversationTask by ID:', error);
        throw error;
    }
};

export const updateConversationTask = async (conversationTask: IConversationTask): Promise<IConversationTask> => {
    try {
        const { data } = await axios.put(`/conversationTasks`, conversationTask);
        return ConversationTask.parse(data);
    } catch (error) {
        console.error('Error updating ConversationTask:', error);
        throw error;
    }
};

export const getOpenConversationTaskCountByUserId = async (userId: number): Promise<number> => {
    try {
        const { data } = await axios.get(`/conversationTasks/user/${userId}/open-conversations-count`);
        return data;
    } catch (error) {
        console.error('Error fetching open conversation count for user:', error);
        throw error;
    }
};

export default {
    getConversationTaskById,
    getOpenConversationTaskCountByUserId,
    updateConversationTask,
};
