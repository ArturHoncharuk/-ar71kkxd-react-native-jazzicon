import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import MersenneTwister from 'mersenne-twister';
import Color from 'color';
import type { StyleProp, ViewStyle } from 'react-native';

export type JazziconProps = {
  size?: number;
  address?: string;
  seed?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const COLORS = [
  '#01888C',
  '#FC7500',
  '#034F5D',
  '#F73F01',
  '#FC1960',
  '#C7144C',
  '#F3C100',
  '#1598F2',
  '#2465E1',
  '#F19E02',
];

const WOBBLE = 30;
const SHAPE_COUNT = 3;

export function computeSeed(address?: string, seed?: number): number | undefined {
  if (address) {
    const lower = address.toLowerCase();
    if (lower.startsWith('0x')) return parseInt(lower.slice(2, 10), 16);
  }
  return seed;
}

export function computeColors(seed?: number): string[] {
  const gen = new MersenneTwister(seed);
  const amount = gen.random() * WOBBLE - WOBBLE / 2;
  return COLORS.map((hex) => new Color(hex).rotate(amount).hex());
}

export function Jazzicon({
  size = 16,
  address,
  seed,
  containerStyle,
}: JazziconProps) {
  const { bgColor, shapes } = useMemo(() => {
    const resolvedSeed = computeSeed(address, seed);
    const gen = new MersenneTwister(resolvedSeed);
    const amount = gen.random() * WOBBLE - WOBBLE / 2;
    const colors = COLORS.map((hex) => new Color(hex).rotate(amount).hex());

    const rnd = () => gen.random();
    const pickColor = () => {
      rnd();
      return colors.splice(Math.floor(colors.length * rnd()), 1)[0] ?? '#000000';
    };

    const bg = pickColor();
    const shapeList = Array.from({ length: SHAPE_COUNT }, (_, index) => {
      const firstRot = rnd();
      const velocity =
        (size / SHAPE_COUNT) * rnd() + (index * size) / SHAPE_COUNT;
      const tx = Math.cos(Math.PI * 2 * firstRot) * velocity;
      const ty = Math.sin(Math.PI * 2 * firstRot) * velocity;
      const secondRot = rnd();
      const rot = firstRot * 360 + secondRot * 180;
      return { tx, ty, rot, color: pickColor() };
    });

    return { bgColor: bg, shapes: shapeList };
  }, [address, seed, size]);

  const center = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: bgColor,
          borderRadius: center,
        },
        containerStyle,
      ]}
    >
      <Svg width={size} height={size}>
        {shapes.map(({ tx, ty, rot, color }, index) => (
          <Rect
            key={`shape_${index}`}
            x={0}
            y={0}
            width={size}
            height={size}
            fill={color}
            transform={`translate(${tx} ${ty}) rotate(${rot.toFixed(1)} ${center} ${center})`}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
