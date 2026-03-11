import type { ResponseError, ResponseSingle } from "@/types/response";

const API_PATH = import.meta.env.VITE_BACKEND_API_PATH || '/api/v2';
export const fetchFromBackend = async (path: string, options?: RequestInit): Promise<Response> => {
    const baseURL = import.meta.env.VITE_BACKEND_API_URL || '';
    if (!options) {
        options = {}
    }
    options = ({
        ...options,
        credentials: 'include',
    })
    const res = await fetch(`${baseURL}${path}`, options)
    return res
}
export async function fetchAPIFromBackendSingleWithErrorHandling<T>(path: string, req?: RequestInit): Promise<ResponseSingle<T> | ResponseError> {
    try {
        console.log(`${API_PATH}${path}`, req)
        const res = await fetchFromBackend(`${API_PATH}${path}`, req)
        if (!res.ok) {
            const errorText = await res.text();
            return { detail: errorText, status: res.status };
        }
        return await res.json();
    } catch (e) {
        return {
            detail: (e as Error).message
        }
    }

}