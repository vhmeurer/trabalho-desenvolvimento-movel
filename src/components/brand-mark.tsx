import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export function BrandMark() {
  const theme = useTheme();
  const color = theme.colors.primary;
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.node, { backgroundColor: color, borderColor: color }]} />
      <View style={[styles.link, { backgroundColor: color }]} />
      <View style={[styles.node, { backgroundColor: color, borderColor: color }]} />
      <View style={[styles.link, { backgroundColor: color }]} />
      <View style={[styles.node, styles.open, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
  },
  open: {
    borderStyle: 'dashed',
  },
  link: {
    width: 18,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
