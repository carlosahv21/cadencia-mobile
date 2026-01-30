import api from './api';

export const kpiService = {
    async getKpis() {
        try {
            const response = await api.get('/reports/kpi');
            return response.data;
        } catch (error) {
            console.error("Error al cargar KPIs:", error);
            throw error;
        }
    }
};