import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const UniversalDatePicker = (props: any) => {
  if (Platform.OS === 'web') {
    return (
      <input 
        type="date" 
        value={props.value.toISOString().split('T')[0]}
        onChange={(e) => props.onChange(null, new Date(e.target.value))}
        style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
      />
    );
  }

  return <DateTimePicker {...props} />;
};

export default UniversalDatePicker;