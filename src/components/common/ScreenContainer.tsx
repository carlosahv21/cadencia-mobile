import React from 'react';
import { 
    StyleSheet, 
    ScrollView, 
    RefreshControl, 
    ViewProps, 
    ViewStyle,
    ScrollViewProps
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

interface ScreenContainerProps {
    children: React.ReactNode;
    refreshing?: boolean;
    onRefresh?: () => void;
    withScroll?: boolean;
    edges?: Edge[];
    style?: ViewStyle;
    scrollViewProps?: ScrollViewProps;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    refreshing = false,
    onRefresh,
    withScroll = true,
    edges = ['top'],
    style,
    scrollViewProps
}) => {
    const { theme } = useTheme();

    const containerStyle = [
        styles.container, 
        { backgroundColor: theme.colors.background },
        style
    ];

    const content = withScroll ? (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
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
            {...scrollViewProps}
        >
            {children}
        </ScrollView>
    ) : (
        children
    );

    return (
        <SafeAreaView style={containerStyle} edges={edges}>
            {content}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
});