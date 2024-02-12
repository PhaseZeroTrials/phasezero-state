import axios from 'axios';
import { z } from 'zod';

import { User } from '../user';
import { QueueTask } from '../queue';

export const Comment = z.object({
    id: z.string(),
    creatorId: z.number(),
    creator: User.optional(),
    taskId: z.string(),
    task: QueueTask.optional(),
    body: z.string(),
    avatarUrl: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export type IComment = z.infer<typeof Comment>;

// When creating a comment we want the Comment type, minus an id since
// it hasn't been created yet.
const PartialComment = Comment.partial({ id: true, creatorId: true });
export type IPartialComment = z.infer<typeof PartialComment>;

const getAllComments = async () => {
    const { data } = await axios.get(`/Comments`);
    return Comment.array().parse(data);
};

const getCommentById = async (id: Guid) => {
    const { data } = await axios.get(`/Comments/${id}`);
    return Comment.parse(data);
};

const getCommentsByUserId = async (userId: number) => {
    const { data } = await axios.get(`Comments/user/${userId}`);
    return Comment.array().parse(data);
};

const getCommentsByTaskId = async (taskId: Guid) => {
    const { data } = await axios.get(`Comments/task/${taskId}`);
    return Comment.array().parse(data);
};

const createComment = async (comment: IPartialComment) => {
    const partial = PartialComment.parse(comment);
    const { data } = await axios.post(`Comments/`, partial);
    return Comment.parse(data);
};

const updateComment = async (comment: IComment) => {
    const { data } = await axios.put(`Comments/`, comment);
    return Comment.parse(data);
};

const deleteComment = async (id: Guid) => {
    const { data } = await axios.delete(`Comments/${id}`);
    return Comment.parse(data);
};

export default {
    createComment,
    updateComment,
    deleteComment,
    getAllComments,
    getCommentById,
    getCommentsByUserId,
    getCommentsByTaskId,
};
