import { Theme } from './theme';

/**
 * Generates an Ant Design theme object based on our application theme.
 * This ensures Ant Design components (Buttons, InputItems, etc.) match our UI/UX standards.
 */
export const getAntdTheme = (theme: Theme) => {
    return {
        // Colors
        brand_primary: theme.colors.primary,
        brand_primary_tap: theme.colors.primary + 'CC',
        
        // Background & Borders
        fill_base: theme.colors.surface,
        fill_body: theme.colors.background,
        border_color_base: theme.colors.border,
        
        // Text
        color_text_base: theme.colors.textPrimary,
        color_text_secondary: theme.colors.textSecondary,
        color_text_placeholder: theme.colors.textSecondary,
        
        // Font Weight (Standardizing as requested)
        font_weight_medium: theme.typography.fontWeight.medium, // 500
        
        // Radius (Standardizing to 16px for main components)
        radius_xs: theme.borderRadius.sm,
        radius_sm: theme.borderRadius.md,
        radius_md: theme.borderRadius.lg,
        radius_lg: theme.borderRadius.xl, // 16px - Nuestro estandar
        
        // Spacing
        h_spacing_lg: theme.spacing.section, // 20px
    };
};
