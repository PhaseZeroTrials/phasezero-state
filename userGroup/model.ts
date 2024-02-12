import { IStudy } from '@pz/state';
import { IUserGroupAssociation } from '@pz/state';

export interface IUserGroup {
    id?: Guid;
    name: string;
    description?: string;
    studyId?: number;
    study?: IStudy;
    userGroupAssociations?: IUserGroupAssociation[];
    totalUserGroupAssociations?: number;
    createdAt?: string;
    updatedAt?: string;
}
