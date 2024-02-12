import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import api, { IPartialNote } from './api';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import { QueryOptions } from '@pz/state/common';

const noteQueryKeys = {
    id: (id: string) => ['note', id] as const,
    conversation: (conversationId: string) => ['notes', 'conversation', conversationId] as const,
    subject: (subjectId: number) => ['notes', 'subject', subjectId] as const,
};

export const useNote = (id: string, options?: QueryOptions) => {
    return useQuery(
        noteQueryKeys.id(id),
        () => {
            return api.getNoteById(id);
        },
        options,
    );
};

export const useNotesByConversation = (conversationId: string, options?: QueryOptions) => {
    return useQuery(
        noteQueryKeys.conversation(conversationId),
        () => {
            return api.getNotesByConversationId(conversationId);
        },
        options,
    );
};

export const useNotesBySubject = (subjectId: number, options?: QueryOptions) => {
    return useQuery(
        noteQueryKeys.subject(subjectId), // Define a new query key for subject
        () => {
            return api.getNotesBySubjectId(subjectId); // Call the new API function to fetch notes by subject
        },
        options,
    );
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation((note: IPartialNote) => api.createNote(note), {
        onSuccess: (newNote) => {
            queryClient.setQueryData(noteQueryKeys.id(newNote.id), newNote);
            if (newNote.conversationId) {
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(newNote.conversationId));
                queryClient.invalidateQueries(noteQueryKeys.conversation(newNote.conversationId));
            } else if (newNote.subjectId) {
                queryClient.invalidateQueries(noteQueryKeys.subject(newNote.subjectId));
            }
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation((params: { noteId: string; note: IPartialNote }) => api.updateNote(params.noteId, params.note), {
        onSuccess: (updatedNote) => {
            // Update the specific note in the cache
            // queryClient.setQueryData(noteQueryKeys.id(updatedNote.id), updatedNote);
        },
    });
};
