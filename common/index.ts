import { z } from 'zod';

// This allows dates to be either a string or a date, and parses them
// to the same type.
export const DateOrString = z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);

    return arg;
}, z.date());

export interface QueryOptions {
    onError?: () => void;
    onSuccess?: (data: any) => void;
    staleTime?: number;
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
}
