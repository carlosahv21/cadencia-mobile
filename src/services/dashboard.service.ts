import api from './api';

export const dashboardService = {
    async getKpis() {
        try {
            const response = await api.get('/reports/kpi');
            return response.data;
        } catch (error) {
            console.error("Error al cargar KPIs:", error);
            throw error;
        }
    },

    async getUsersRisk() {
        try {
            const response = await api.get('/reports/users-at-risk');
            return response.data;
        } catch (error) {
            console.error("Error al cargar riesgo de usuarios:", error);
            throw error;
        }
    }
};