export type { IMessageTemplate } from './api';
export { default as messageTemplateService } from './api';
export {
    useMessageTemplateById,
    useAllMessageTemplates,
    useCreateMessageTemplate,
    useUpdateMessageTemplate,
    useDeleteMessageTemplate,
} from './queries';
