import api from './api';

export const searchService = {
    async global(q: string) {
        try {
            const response = await api.get('/search', { params: { q } });
            return response.data;
        } catch (error) {
            console.error("Error al buscar global:", error);
            throw error;
        }
    }
};