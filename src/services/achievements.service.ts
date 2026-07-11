import api from './api';

export interface AchievementCatalogItem {
    id: number;
    name: string;
    description: string;
    icon_url: string | null;
    trigger_type: string;
    trigger_value: number;
    points: number;
    earned: boolean;
    unlocked_at: string | null;
    progress: number | null;
}

export const achievementsService = {
    /**
     * Catálogo de logros del usuario autenticado (ganados y pendientes).
     * Devuelve [] si el módulo 'achievements' está inactivo (403) o falla.
     */
    async getMyCatalog(): Promise<AchievementCatalogItem[]> {
        try {
            const response = await api.get('/user-achievements/catalog/me');
            return response.data?.data || [];
        } catch {
            return [];
        }
    },
};
