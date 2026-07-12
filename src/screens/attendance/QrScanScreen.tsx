import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { qrService, QrScanResult, QrTodayClass } from '../../services/qr.service';
import { classService } from '../../services/clases.service';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { showErrorToast, showSuccessToast } from '../../utils/feedback';

type Step = 'scanning' | 'confirm' | 'selectClass';

export const QrScanScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();

    const [step, setStep] = useState<Step>('scanning');
    const [scanned, setScanned] = useState<QrScanResult | null>(null);
    const [saving, setSaving] = useState(false);
    const scanLock = useRef(false); // evita disparos múltiples del mismo QR

    const resetToScan = () => {
        setScanned(null);
        setStep('scanning');
        scanLock.current = false;
    };

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanLock.current) return;
        scanLock.current = true;
        try {
            const result = await qrService.scanQr(data);
            setScanned(result);
            setStep('confirm');
        } catch (error: any) {
            showErrorToast(error?.message || t('qr.scan_error'));
            scanLock.current = false; // permite reintentar
        }
    };

    const markAttendance = async (clase: QrTodayClass) => {
        if (!scanned) return;
        setSaving(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            await classService.saveAttendance([
                { class_id: clase.id, student_id: scanned.student_id, date: today, status: 'present' },
            ]);
            showSuccessToast(t('qr.marked_success'), resetToScan);
        } catch (error: any) {
            showErrorToast(error?.message || t('dashboard.attendance.error_save'));
        } finally {
            setSaving(false);
        }
    };

    // ── Permiso de cámara ──────────────────────────────────────────────
    if (!permission) {
        return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
    }
    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <BackHeader title={t('qr.scan_title')} />
                <View style={styles.permissionContent}>
                    <FontAwesome name="camera" size={48} color={theme.colors.primary} />
                    <Text style={[styles.permissionText, { color: theme.colors.textPrimary }]}>
                        {t('qr.camera_permission')}
                    </Text>
                    <Button title={t('qr.grant_permission')} type="primary" onPress={requestPermission} />
                </View>
            </View>
        );
    }

    // ── Paso 1: escaneando ─────────────────────────────────────────────
    if (step === 'scanning') {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
                {/* Overlay: marco guía + botón volver */}
                <View style={[styles.cameraOverlay, { paddingTop: insets.top + 10 }]}>
                    <BackHeader title={t('qr.scan_title')} />
                </View>
                <View style={styles.frameWrapper} pointerEvents="none">
                    <View style={styles.frame} />
                    <Text style={styles.frameHint}>{t('qr.scan_hint')}</Text>
                </View>
            </View>
        );
    }

    // ── Paso 2: confirmación del alumno (obligatorio) ──────────────────
    if (step === 'confirm' && scanned) {
        const initials = scanned.student_name.split(' ').slice(0, 2).map((p) => p[0] ?? '').join('').toUpperCase();
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <BackHeader title={t('qr.scan_title')} onBack={resetToScan} />
                <View style={styles.confirmContent}>
                    {scanned.student_photo ? (
                        <Image source={{ uri: scanned.student_photo }} style={styles.confirmAvatar} />
                    ) : (
                        <View style={[styles.confirmAvatar, styles.avatarFallback, { backgroundColor: theme.colors.primarySoft }]}>
                            <Text style={[styles.avatarInitials, { color: theme.colors.primary }]}>{initials}</Text>
                        </View>
                    )}
                    <Text style={[styles.confirmName, { color: theme.colors.textPrimary }]}>{scanned.student_name}</Text>

                    {scanned.is_active ? (
                        <>
                            <Text style={[styles.confirmQuestion, { color: theme.colors.textSecondary }]}>
                                {t('qr.confirm_student')}
                            </Text>
                            <View style={styles.confirmButtons}>
                                <Button title={t('qr.not_correct')} type="default" variant="outline" onPress={resetToScan} style={styles.flexBtn} />
                                <Button title={t('qr.continue')} type="primary" onPress={() => setStep('selectClass')} style={styles.flexBtn} />
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={[styles.inactiveBadge, { backgroundColor: theme.colors.error + '20' }]}>
                                <FontAwesome name="exclamation-circle" size={16} color={theme.colors.error} />
                                <Text style={[styles.inactiveText, { color: theme.colors.error }]}>
                                    {t('qr.inactive_student')}
                                </Text>
                            </View>
                            <Button title={t('qr.scan_another')} type="primary" onPress={resetToScan} style={{ marginTop: 24 }} />
                        </>
                    )}
                </View>
            </View>
        );
    }

    // ── Paso 3: seleccionar clase de hoy ───────────────────────────────
    if (step === 'selectClass' && scanned) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <BackHeader title={scanned.student_name} subtitle={t('qr.select_class')} onBack={() => setStep('confirm')} />
                <ScrollView contentContainerStyle={styles.classList} showsVerticalScrollIndicator={false}>
                    {scanned.today_classes.length === 0 ? (
                        <EmptyState icon="calendar-o" title={t('qr.no_classes_today')} description={t('common.try_again')} />
                    ) : (
                        scanned.today_classes.map((clase) => (
                            <TouchableOpacity
                                key={clase.id}
                                activeOpacity={0.85}
                                disabled={saving}
                                onPress={() => markAttendance(clase)}
                                style={[styles.classCard, { backgroundColor: theme.colors.surface }]}
                            >
                                <View style={[styles.hourBadge, { backgroundColor: theme.colors.primarySoft }]}>
                                    <Text style={[styles.hourText, { color: theme.colors.primary }]}>{clase.hour}</Text>
                                </View>
                                <View style={styles.classInfo}>
                                    <Text style={[styles.genreText, { color: theme.colors.primary }]}>
                                        {clase.genre?.toUpperCase()} • {clase.level}
                                    </Text>
                                    <Text style={[styles.className, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                                        {clase.name}
                                    </Text>
                                </View>
                                <FontAwesome name="chevron-right" size={14} color={theme.colors.border} />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    cameraContainer: { flex: 1, backgroundColor: '#000' },
    cameraOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
    frameWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    frame: {
        width: 240,
        height: 240,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    frameHint: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 24,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    permissionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: 40,
    },
    permissionText: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
    confirmContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    confirmAvatar: { width: 110, height: 110, borderRadius: 55 },
    avatarFallback: { justifyContent: 'center', alignItems: 'center' },
    avatarInitials: { fontSize: 40, fontWeight: '700' },
    confirmName: { fontSize: 24, fontWeight: '700', marginTop: 20, textAlign: 'center' },
    confirmQuestion: { fontSize: 15, marginTop: 12, marginBottom: 32, textAlign: 'center' },
    confirmButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    flexBtn: { flex: 1 },
    inactiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 20,
    },
    inactiveText: { fontSize: 14, fontWeight: '600' },
    classList: { paddingHorizontal: 20, paddingTop: 16 },
    classCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    hourBadge: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, minWidth: 62, alignItems: 'center' },
    hourText: { fontSize: 13, fontWeight: '700' },
    classInfo: { flex: 1 },
    genreText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    className: { fontSize: 15, fontWeight: '700' },
});
