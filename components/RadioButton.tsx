import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

interface RadioButtonProps<T> {
  label: string;
  value: T; // The unique value of this button (e.g., 'option_a' or 'red')
  selectedValue: T | null | undefined; // The currently selected value
  onSelect: (value: T) => void; // Callback when the button is pressed
}

const RadioButton = <T,>({ label, value, selectedValue, onSelect }: RadioButtonProps<T>) => {
  const isSelected = value === selectedValue;

  return (
    <Pressable
      style={styles.radioButtonContainer}
      onPress={() => onSelect(value)}
      // Accessibility properties for screen readers
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={label}
    >
      {/* Outer Circle View */}
      <View style={[
          styles.radioOuterCircle,
          isSelected && styles.radioOuterCircleSelected // Apply border color change when selected
      ]}>
        {/* Inner Circle (Dot) View - Only visible if selected */}
        {isSelected && <View style={styles.radioInnerCircle} />}
      </View>
      
      {/* Label Text */}
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9CA3AF', // Gray-400 border by default
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterCircleSelected: {
    borderColor: '#3B82F6', // Blue-500 when selected
  },
  radioInnerCircle: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#3B82F6', // Blue-500 fill when selected
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  }
});