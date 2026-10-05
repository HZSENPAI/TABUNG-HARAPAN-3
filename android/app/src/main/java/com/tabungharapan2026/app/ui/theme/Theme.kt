package com.tabungharapan2026.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = RosePrimary,
    onPrimary = RoseOnPrimary,
    primaryContainer = RosePrimaryContainer,
    onPrimaryContainer = RoseOnPrimaryContainer,
    background = RoseBackground,
    surface = RoseSurface,
    surfaceVariant = RoseSurfaceVariant,
    onSurface = RoseTextMain,
    onSurfaceVariant = RoseTextMuted
)

@Composable
fun TabungHarapanTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
