import { ITenant } from '../tenant';

export interface IStudyPortalRouter {
    tenantId: string;
    studyId: string;
    url: string;
    logoUrl?: string;
    helperText?: string;
    tenant: ITenant;
    favIconUrl: string;
    theme: string;
}
