import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/auth.service';
import { validation } from '../../utils/validation';
import { BackHeader } from '../../components/common/BackHeader';
import { Divider } from '../../components/common/Divider';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { showSuccessToast, showErrorToast } from '../../utils/feedback';

export const ChangePasswordScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        const newErrors: Record<string, string | null> = {
            current: current ? null : t('change_password.errors.required'),
            newPass: validation.getPasswordError(newPass),
            confirm: newPass === confirm ? null : t('change_password.errors.mismatch'),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setSaving(true);
        try {
            await authService.changePassword(current, newPass);
            showSuccessToast(t('change_password.success'), () => navigation.goBack());
        } catch (error: any) {
            // 400/401 del backend: contraseña actual incorrecta u otra validación
            showErrorToast(error?.message || t('common.error_loading'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackHeader title={t('profile.options.change_password')} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                        {t('change_password.sections.verify')}
                    </Text>

                    <FormInput
                        label={t('change_password.current')}
                        value={current}
                        onChangeText={(v) => { setCurrent(v); setErrors((e) => ({ ...e, current: null })); }}
                        icon="lock-closed-outline"
                        placeholder="••••••••"
                        secure
                        error={errors.current}
                    />
                    <Divider marginVertical={8} />
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginTop: 12 }]}>
                        {t('change_password.sections.new')}
                    </Text>

                    <FormInput
                        label={t('change_password.new')}
                        value={newPass}
                        onChangeText={(v) => { setNewPass(v); setErrors((e) => ({ ...e, newPass: null })); }}
                        icon="key-outline"
                        placeholder="••••••••"
                        secure
                        error={errors.newPass}
                        hint={t('change_password.hint')}
                    />
                    <FormInput
                        label={t('change_password.confirm')}
                        value={confirm}
                        onChangeText={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: null })); }}
                        icon="key-outline"
                        placeholder="••••••••"
                        secure
                        error={errors.confirm}
                    />

                </ScrollView>

                {/* Botón siempre visible al fondo */}
                <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
                    <Button
                        title={t('change_password.submit')}
                        onPress={handleSubmit}
                        type="primary"
                        variant="solid"
                        size="lg"
                        fullWidth
                        loading={saving}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 14,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
});
