import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';

type HabitIconProps = {
  icon: string;
  color: string;
  size?: number;
};

export function HabitIcon({ icon, color, size = 40 }: HabitIconProps) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.3, backgroundColor: `${color}1F` },
      ]}>
      <Icon source={icon} size={size * 0.55} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
