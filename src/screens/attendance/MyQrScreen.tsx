import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { qrService, MyQrResponse } from '../../services/qr.service';
import { BackHeader } from '../../components/common/BackHeader';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';

export const MyQrScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [qr, setQr] = useState<MyQrResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        qrService.getMyQr()
            .then(setQr)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingState />;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackHeader title={t('qr.my_qr_title')} />

            {error || !qr ? (
                <EmptyState icon="qrcode" title={t('common.error_loading')} description={t('common.try_again')} />
            ) : (
                <View style={styles.content}>
                    {/* Card blanca fija: el QR necesita fondo claro para leerse en cualquier tema */}
                    <View style={styles.qrCard}>
                        <QRCode value={qr.token} size={230} backgroundColor="#fff" color="#000" />
                    </View>

                    <View style={[
                        styles.badge,
                        { backgroundColor: qr.is_active ? theme.colors.success + '20' : theme.colors.border },
                    ]}>
                        <FontAwesome
                            name={qr.is_active ? 'check-circle' : 'times-circle'}
                            size={14}
                            color={qr.is_active ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <Text style={[
                            styles.badgeText,
                            { color: qr.is_active ? theme.colors.success : theme.colors.textSecondary },
                        ]}>
                            {qr.is_active ? t('qr.active') : t('qr.inactive')}
                        </Text>
                    </View>

                    <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
                        {qr.is_active ? t('qr.my_qr_hint') : t('qr.inactive_hint')}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    qrCard: {
        backgroundColor: '#fff',
        padding: 28,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 12,
        marginTop: 28,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '700',
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 20,
    },
});
