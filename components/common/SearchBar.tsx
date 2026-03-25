import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  onClearPress?: () => void;
}

export default function SearchBar({
  placeholder = 'Buscar productos...',
  value,
  onChangeText,
  onFilterPress,
  onClearPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClearPress}>
            <MaterialIcons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <MaterialIcons name="tune" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.dark,
  },
  filterBtn: {
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
});
