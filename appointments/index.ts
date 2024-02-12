export type { IAppointment, IAppointmentTask } from './api';
export { AppointmentStatus } from './api';
export {
    useAllAppointments,
    useAppointmentById,
    useCreateAppointment,
    useUpdateAppointment,
    useDeleteAppointment,
} from './queries';
export { AppointmentQueryKeys } from './queries';
