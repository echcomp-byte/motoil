// Onboarding animation primitives. Implemented on top of React Native's
// built-in Animated API as a stand-in for react-native-reanimated, which
// lands in the Day-15 deps PR (2026-06-12). Screen code imports from
// @/lib/animations — never from `react-native-reanimated` directly — so
// the swap is invisible to callers.

import { Animated } from "react-native";
import { useEffect, useState } from "react";

export const AnimatedView = Animated.View;

type EnterOptions = { delay?: number; duration?: number; offsetY?: number };

export function useEnterAnimation(opts: EnterOptions = {}) {
  const { delay = 0, duration = 500, offsetY = 16 } = opts;
  // useState lazy init gives a stable Animated.Value across re-renders without
  // tripping the React-19 react-hooks/refs rule that bans .current reads in render.
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(offsetY));

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [opacity, translateY, delay, duration]);

  return { opacity, transform: [{ translateY }] };
}
