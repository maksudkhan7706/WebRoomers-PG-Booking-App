import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';

// Format number to display string (show full number)
const formatNumber = (num: number): string => {
  return num.toString();
};

// Animated Counter Component with spinner effect
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: any;
  trigger?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 500,
  style,
  trigger = true,
}) => {
  const formattedValue = useMemo(() => formatNumber(value), [value]);
  const characters = useMemo(() => formattedValue.split(''), [formattedValue]);

  // Use ref to store animated values and ensure they persist across renders
  const animatedValuesRef = useRef<Animated.Value[]>([]);

  // Initialize animated values array to match character count
  // Use useMemo to ensure we have the right number of animated values
  const animatedValues = useMemo(() => {
    const currentLength = animatedValuesRef.current.length;
    const targetLength = characters.length;

    if (currentLength === targetLength) {
      // Reuse existing animated values
      return animatedValuesRef.current;
    }

    // Create new array with correct length
    const newAnimatedValues: Animated.Value[] = [];
    for (let i = 0; i < targetLength; i++) {
      // Reuse existing animated value if available, otherwise create new one
      newAnimatedValues[i] =
        animatedValuesRef.current[i] || new Animated.Value(0);
    }

    // Clean up old animated values if count decreased
    if (currentLength > targetLength) {
      animatedValuesRef.current.slice(targetLength).forEach(anim => {
        anim.stopAnimation();
      });
    }

    animatedValuesRef.current = newAnimatedValues;
    return newAnimatedValues;
  }, [characters.length]);

  useEffect(() => {
    if (!trigger) return;

    // Reset all animations
    animatedValues.forEach(anim => anim.setValue(0));

    // Create staggered animations for each character with smooth easing
    const animations = animatedValues.map((anim, index) => {
      // Stagger the start time for a cascading effect
      const delay = index * 80;
      const animDuration = Math.max(duration - delay, 800); // Ensure minimum duration

      return Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: animDuration,
          useNativeDriver: true,
        }),
      ]);
    });

    // Start all animations
    const parallelAnimation = Animated.parallel(animations);
    parallelAnimation.start();

    return () => {
      parallelAnimation.stop();
    };
  }, [value, trigger, duration, formattedValue, animatedValues]);

  // Character height for spinner effect
  const CHAR_HEIGHT = 35;

  return (
    <View style={[styles.container, style]}>
      {characters.map((char, index) => {
        if (!animatedValues[index]) return null;

        const translateY = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [CHAR_HEIGHT, 0], // Slide up from bottom
        });

        const opacity = animatedValues[index].interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0, 0.7, 1], // Smooth fade in
        });

        return (
          <View key={`${char}-${index}-${value}`} style={styles.charContainer}>
            <Animated.View
              style={[
                styles.charWrapper,
                {
                  transform: [{ translateY }],
                  opacity,
                },
              ]}
            >
              <Typography
                variant="subheading"
                weight="bold"
                color={colors.white}
                style={styles.charText}
              >
                {char}
              </Typography>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  charContainer: {
    height: 35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 12, // Ensure spacing for characters
  },
  charWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  charText: {
    lineHeight: 35,
    textAlign: 'center',
  },
});

export default AnimatedCounter;
