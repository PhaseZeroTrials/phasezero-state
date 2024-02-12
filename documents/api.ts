import axios, { AxiosResponse } from 'axios';
import { IDocument } from './model';

async function uploadDocument(record: IDocument, tenantId: string | null, fileData: string): Promise<AxiosResponse> {
    const params = new URLSearchParams();

    if (record.studyId !== undefined) {
        params.append('studyId', String(record.studyId));
    }

    if (record.formId) {
        params.append('formId', String(record.formId));
    }

    if (record.subjectId) {
        params.append('subjectId', String(record.subjectId));
    }

    if (tenantId) {
        params.append('tenantId', tenantId);
    }

    const baseUrl = '/Documents/Upload' + (params.toString() ? `?${params.toString()}` : '');

    return await axios.post(baseUrl, fileData);
}

async function uploadPublicDocument(fileData: FormData): Promise<string> {
    const { data } = await axios.post(`/Documents/UploadPublic`, fileData);
    return data;
}

async function downloadDocument(documentId: string): Promise<AxiosResponse> {
    return await axios.get(`/Documents/${documentId}/Download`, { responseType: 'arraybuffer' });
}

async function uploadDocumentWithUrl(url: string, fileData: any): Promise<AxiosResponse> {
    return await axios.post(url, fileData);
}

async function uploadDocumentWithRelativePath(
    studyId: number,
    relativePath: string,
    fileData: any,
): Promise<AxiosResponse> {
    return await axios.post(`/Documents/Study/${studyId}/Path/${encodeURIComponent(relativePath)}/Upload`, fileData);
}

async function deleteDocumentWithRelativePath(studyId: number, relativePath: string): Promise<AxiosResponse> {
    return await axios.delete(`/Documents/Study/${studyId}/Path/${encodeURIComponent(relativePath)}/Delete`);
}

async function deleteDocument(id: string): Promise<AxiosResponse> {
    return await axios.delete(`/Documents/${id}`);
}

async function getPresignedUrl(id: string): Promise<AxiosResponse> {
    return await axios.get(`/Documents/${id}/Url`);
}

async function listDocumentsInStudy(studyId: number, path: string | undefined): Promise<AxiosResponse> {
    if (path) {
        return await axios.get(`/Documents/study/${studyId}?path=${path}`);
    }
    return await axios.get(`/Documents/study/${studyId}`);
}

async function searchDocumentsInStudyByName(studyId: number, name: string): Promise<AxiosResponse> {
    return await axios.get(`/Documents/study/${studyId}/search?name=${name}`);
}

async function createFolderWithPath(path: string): Promise<AxiosResponse> {
    return await axios.post(`/Documents/Path/${encodeURIComponent(path)}/CreateFolder`);
}

async function getDocumentDataByPath(studyId: number, path: string): Promise<AxiosResponse> {
    return await axios.get(`/Documents/Study/${studyId}/Path/${encodeURIComponent(path)}/Download`, {
        responseType: 'arraybuffer',
    });
}

function returnUploadDocumentUrl(record: IDocument, tenantId: string | undefined): string {
    const params = new URLSearchParams();
    if (record.studyId) {
        params.append('studyId', String(record.studyId));
    }

    if (record.formId) {
        params.append('formId', String(record.formId));
    }

    if (record.subjectId) {
        params.append('subjectId', String(record.subjectId));
    }

    if (record.formVisitId) {
        params.append('formVisitId', record.formVisitId);
    }

    if (tenantId) {
        params.append('tenantId', tenantId);
    }

    const baseUrl = `${import.meta.env.VITE_API_URL}/Documents/Upload?${params.toString()}`;
    return baseUrl;
}

function returnDownloadDocumentUrl(documentId: number): string {
    return `${import.meta.env.VITE_API_URL}/Documents/${documentId}/Download`;
}

function returnPresignedUrl(documentId: number): string {
    return `${import.meta.env.VITE_API_URL}/Documents/${documentId}/Url`;
}

export default {
    deleteDocumentWithRelativePath,
    uploadDocumentWithRelativePath,
    uploadPublicDocument,
    getDocumentDataByPath,
    createFolderWithPath,
    getPresignedUrl,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    listDocumentsInStudy,
    searchDocumentsInStudyByName,
    uploadDocumentWithUrl,
    returnUploadDocumentUrl,
    returnDownloadDocumentUrl,
    returnPresignedUrl,
};
