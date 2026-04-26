declare module 'react-native' {
  import * as React from 'react';

  export const Animated: {
    Value: new (value: number) => { setValue: (value: number) => void };
    View: React.ComponentType<any>;
    timing: (
      value: { setValue: (next: number) => void },
      config: { toValue: number; duration: number; useNativeDriver: boolean },
    ) => { start: (cb?: () => void) => void };
  };

  export type PanResponderGestureState = {
    dy: number;
    vy: number;
  };

  export const PanResponder: {
    create: (config: Record<string, unknown>) => { panHandlers: Record<string, unknown> };
  };

  export const Dimensions: {
    get: (name: 'window' | 'screen') => { width: number; height: number };
  };

  export const StyleSheet: {
    create: <T extends Record<string, unknown>>(styles: T) => T;
    hairlineWidth: number;
  };

  export const SafeAreaView: React.ComponentType<any>;
  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Pressable: React.ComponentType<any>;
  export const ActivityIndicator: React.ComponentType<any>;
}
