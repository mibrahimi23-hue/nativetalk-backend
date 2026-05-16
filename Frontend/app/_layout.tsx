import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import 'react-native-reanimated';

import { UserProvider } from '@/contexts/user-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const baseTextStyle = { fontFamily: 'Outfit', color: '#28221B' };

// Monkey-patch the default text & input to use the Outfit font everywhere.
// We patch both `defaultProps` (older RN) and `render` (forwardRef-based RN)
// so the override survives across versions.
applyDefaultStyle(Text);
applyDefaultStyle(TextInput);

function applyDefaultStyle(Component: any) {
  if (!Component) return;
  if (Component.__nativetalkPatched) return;
  Component.__nativetalkPatched = true;

  if (Component.defaultProps) {
    Component.defaultProps.style = [baseTextStyle, Component.defaultProps.style];
  } else {
    Component.defaultProps = { style: baseTextStyle };
  }

  const oldRender = Component.render;
  if (typeof oldRender === 'function') {
    Component.render = function (...args: any[]) {
      const result = oldRender.apply(this, args);
      if (!result) return result;
      return React.cloneElement(result, {
        style: [baseTextStyle, result.props.style],
      });
    };
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Domine: require('../assets/fonts/Domine-Regular.ttf'),
    Outfit: require('../assets/fonts/Outfit-Regular.ttf'),
    Epilogue: require('../assets/fonts/Epilogue-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFBFA',
        }}
      >
        <ActivityIndicator color="#FF9E6D" />
      </View>
    );
  }

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
