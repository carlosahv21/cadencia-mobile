import api from './api';

export interface MyQrResponse {
    token: string;
    is_active: boolean;
}

export interface QrTodayClass {
    id: number;
    name: string;
    hour: string;
    level: string;
    genre: string;
}

export interface QrScanResult {
    student_id: string;
    student_name: string;
    student_photo: string | null;
    is_active: boolean;
    today_classes: QrTodayClass[];
}

export const qrService = {
    /** QR del usuario autenticado (alumno) */
    async getMyQr(): Promise<MyQrResponse> {
        try {
            const response = await api.get('/users/me/qr-code');
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al cargar el QR', statusCode: 0 };
        }
    },

    /** Identifica al alumno por su token de QR (recepción) */
    async scanQr(token: string): Promise<QrScanResult> {
        try {
            const response = await api.post('/attendances/qr-scan', { token });
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data) throw error.response.data;
            throw { message: 'Error al escanear el QR', statusCode: 0 };
        }
    },
};
