import axios from 'axios';
import { z } from 'zod';

import { User } from '../user';

const NoteMention = z.object({
    id: z.string().optional(),
    noteId: z.string().optional(),
    userId: z.number(),
});

export type INoteMention = z.infer<typeof NoteMention>;

export const Note = z.object({
    id: z.string(),
    title: z.string().optional(),
    conversationId: z.string().optional(),
    subjectId: z.number().optional(),
    creatorId: z.number().optional(),
    formId: z.number().nullable().optional(),
    mentions: NoteMention.array().optional(),
    creator: User.optional(),
    body: z.string(),
    createdAt: z.string().optional(),
});

export type INote = z.infer<typeof Note>;

const PartialNote = Note.partial({ id: true, authorId: true, createdAt: true });
export type IPartialNote = z.infer<typeof PartialNote>;

const getNoteById = async (id: string) => {
    const { data } = await axios.get(`/notes/${id}`);
    return Note.parse(data);
};

const getNotesByConversationId = async (conversationId: string) => {
    const { data } = await axios.get(`/notes/conversation/${conversationId}`);
    return Note.array().parse(data);
};

const createNote = async (note: IPartialNote) => {
    const parsed = PartialNote.parse(note);
    const { data } = await axios.post('/notes', parsed);
    return Note.parse(data);
};

const getNotesBySubjectId = async (subjectId: number) => {
    const { data } = await axios.get(`/notes/subject/${subjectId}/list`);
    return Note.array().parse(data);
};

const updateNote = async (noteId: string, note: IPartialNote) => {
    const { data } = await axios.put(`/notes/${noteId}`, note);
    return Note.parse(data);
};

export default {
    getNoteById,
    updateNote,
    getNotesByConversationId,
    createNote,
    getNotesBySubjectId,
};
