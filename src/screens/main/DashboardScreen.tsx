import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, WingBlank, WhiteSpace } from '@ant-design/react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const DashboardScreen = () => {
    const { user, academy } = useAuth();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                    <Card.Header
                        title={<Text style={{ fontWeight: 'bold' }}>{academy?.academy_name || 'Mi Academia'}</Text>}
                        thumbStyle={{ width: 30, height: 30 }}
                        thumb={academy?.logo_url || "https://via.placeholder.com/30"}
                    />
                    <Card.Body>
                        <View style={{ padding: 16 }}>
                            <Text style={{ fontSize: 18 }}>¡Hola, {user?.name}!</Text>
                            <Text style={{ color: 'gray' }}>Bienvenido a tu panel de danza.</Text>
                        </View>
                    </Card.Body>
                    <Card.Footer content={`Rol: ${user?.role}`} extra={user?.plan || 'Plan Base'} />
                </Card>
            </WingBlank>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});