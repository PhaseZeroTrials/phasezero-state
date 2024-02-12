import { ReactNode } from 'react';

export interface IFormSummary {
    variableId: string;
    title: string;
    type: string;
    uiWidget: string;
    totalTasks: number;

    formResponseStats: IFormResponseStats[];
}

export interface IFormResponseStats {
    value: string;
    totalResponsePerValue: number;
    percentage: number;
    totalRespondents: number;
}

export interface IFormResponseTable {
    columns: {
        dataIndex: string;
        key: string;
        title: any;
        width: number;
        render: (code: any, data: any) => ReactNode;
    }[];
    rows: any[];
    colorMetaData: any[];
    totalRows: number;
}
