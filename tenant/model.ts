export interface ITenant {
    id: Guid;
    tenantId: Guid;
    tenantName: string;
    version: number;
    name: string;
    lastLoggedInAt: Date;
}
