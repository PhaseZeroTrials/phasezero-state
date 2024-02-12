export { default as formPropertyService } from './api';
export type { IFormProperty, IFormPropertyDefinition } from './model';
export {
    useFormPropertiesForForm,
    useFormPropertiesForTask,
    useFormPropertiesForAllCustomAttributes,
    useBulkCreateOrUpdateFormProperties,
} from './queries';
