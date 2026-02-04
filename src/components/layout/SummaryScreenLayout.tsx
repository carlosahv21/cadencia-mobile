import React, { ReactNode } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

interface SummaryScreenLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
    contentContainerStyle?: ViewStyle;
}

export const SummaryScreenLayout: React.FC<SummaryScreenLayoutProps> = ({
    children,
    header,
    footer,
    refreshing = false,
    onRefresh,
    contentContainerStyle
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {header && (
                <Animated.View entering={FadeIn.duration(600).delay(200)}>
                    {header}
                </Animated.View>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    footer ? styles.withFooter : null,
                    contentContainerStyle
                ]}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    ) : undefined
                }
            >
                {React.Children.map(children, (child, index) => {
                    if (!React.isValidElement(child)) return child;

                    return (
                        <Animated.View
                            entering={FadeInDown.duration(600).delay(300 + (index * 150))}
                            style={styles.section}
                        >
                            {child}
                        </Animated.View>
                    );
                })}
            </ScrollView>

            {footer && (
                <View style={styles.footer}>
                    {footer}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    withFooter: {
        paddingBottom: 100,
    },
    section: {
        marginBottom: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
    },
});
