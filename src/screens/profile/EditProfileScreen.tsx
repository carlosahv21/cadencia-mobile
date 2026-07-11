import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { BackHeader } from '../../components/common/BackHeader';
import { Divider } from '../../components/common/Divider';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { showSuccessToast, showErrorToast } from '../../utils/feedback';

const GENDERS = ['Male', 'Female', 'Other'] as const;

const isValidDate = (s: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s);
    return !isNaN(d.getTime()) && d < new Date();
};

export const EditProfileScreen = () => {
    const { theme } = useTheme();
    const { user, refreshUser } = useAuth();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [birthdate, setBirthdate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // La sesión trae el nombre combinado; el usuario crudo lo trae separado
    useEffect(() => {
        if (!user?.id) return;
        userService.getById(user.id)
            .then((res) => {
                const u = res.data;
                setFirstName(u?.first_name ?? '');
                setLastName(u?.last_name ?? '');
                setPhone(u?.phone ?? '');
                setGender(u?.gender ?? null);
                setBirthdate(u?.birthdate ? String(u.birthdate).slice(0, 10) : '');
            })
            .catch(() => showErrorToast(t('common.error_loading')))
            .finally(() => setLoading(false));
    }, [user?.id]);

    const handleSave = async () => {
        const newErrors: Record<string, string | null> = {
            firstName: firstName.trim() ? null : t('edit_profile.errors.required'),
            lastName: lastName.trim() ? null : t('edit_profile.errors.required'),
            birthdate: !birthdate || isValidDate(birthdate) ? null : t('edit_profile.errors.invalid_date'),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setSaving(true);
        try {
            await userService.updateProfile(user!.id, {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim() || null,
                gender,
                birthdate: birthdate || null,
            });
            await refreshUser();
            showSuccessToast(t('edit_profile.success'), () => navigation.goBack());
        } catch (error: any) {
            showErrorToast(error?.message || t('common.error_loading'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingState />;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackHeader title={t('profile.options.edit_profile')} subtitle={user?.email} />

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
                        {t('edit_profile.sections.personal')}
                    </Text>

                    <FormInput
                        label={t('edit_profile.first_name')}
                        value={firstName}
                        onChangeText={(v) => { setFirstName(v); setErrors((e) => ({ ...e, firstName: null })); }}
                        icon="person-outline"
                        placeholder={t('edit_profile.placeholders.first_name')}
                        error={errors.firstName}
                        autoCapitalize="words"
                    />
                    <FormInput
                        label={t('edit_profile.last_name')}
                        value={lastName}
                        onChangeText={(v) => { setLastName(v); setErrors((e) => ({ ...e, lastName: null })); }}
                        icon="person-outline"
                        placeholder={t('edit_profile.placeholders.last_name')}
                        error={errors.lastName}
                        autoCapitalize="words"
                    />
                    <FormInput
                        label={t('edit_profile.email')}
                        value={user?.email ?? ''}
                        onChangeText={() => { }}
                        icon="mail-outline"
                        editable={false}
                    />
                    <FormInput
                        label={t('edit_profile.phone')}
                        value={phone}
                        onChangeText={setPhone}
                        icon="call-outline"
                        placeholder={t('edit_profile.placeholders.phone')}
                        keyboardType="phone-pad"
                    />

                    <Divider marginVertical={8} />
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginTop: 12 }]}>
                        {t('edit_profile.sections.additional')}
                    </Text>

                    {/* Género */}
                    <View style={styles.labelRow}>
                        <Ionicons name="male-female-outline" size={15} color={theme.colors.primary} />
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                            {t('edit_profile.gender')}
                        </Text>
                    </View>
                    <View style={styles.genderRow}>
                        {GENDERS.map((g) => {
                            const active = gender === g;
                            return (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => setGender(active ? null : g)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.genderPill,
                                        { backgroundColor: active ? theme.colors.primary : theme.colors.primarySoft },
                                    ]}
                                >
                                    <Text style={[styles.genderText, { color: active ? '#fff' : theme.colors.primary }]}>
                                        {t(`edit_profile.genders.${g.toLowerCase()}`)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Fecha de nacimiento: picker nativo (texto libre solo en web) */}
                    {Platform.OS === 'web' ? (
                        <FormInput
                            label={t('edit_profile.birthdate')}
                            value={birthdate}
                            onChangeText={(v) => { setBirthdate(v); setErrors((e) => ({ ...e, birthdate: null })); }}
                            placeholder="1990-01-31"
                            icon="calendar-outline"
                            error={errors.birthdate}
                            autoCapitalize="none"
                        />
                    ) : (
                        <View style={styles.field}>
                            <View style={styles.labelRow}>
                                <Ionicons name="calendar-outline" size={15} color={theme.colors.primary} />
                                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                                    {t('edit_profile.birthdate')}
                                </Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setShowDatePicker(!showDatePicker)}
                                style={[styles.dateField, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                            >
                                <Text style={{
                                    fontSize: 15,
                                    color: birthdate ? theme.colors.textPrimary : theme.colors.textSecondary + '99',
                                }}>
                                    {birthdate
                                        ? new Date(birthdate).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' })
                                        : t('edit_profile.birthdate_placeholder')}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={birthdate ? new Date(birthdate) : new Date(2000, 0, 1)}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    maximumDate={new Date()}
                                    onChange={(_, date) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (date) setBirthdate(date.toISOString().slice(0, 10));
                                    }}
                                />
                            )}
                        </View>
                    )}

                </ScrollView>

                {/* Botón siempre visible al fondo */}
                <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
                    <Button
                        title={t('edit_profile.save')}
                        onPress={handleSave}
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
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 14,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    field: {
        marginBottom: 16,
    },
    dateField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    genderPill: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 12,
    },
    genderText: {
        fontSize: 13,
        fontWeight: '700',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
});
