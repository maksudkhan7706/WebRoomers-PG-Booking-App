import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Animated,
  Easing,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors';
import Typography from './Typography';

export interface DropdownItem {
  label: string;
  value: string;
}

interface AppCustomDropdownProps {
  label: string;
  data: DropdownItem[];
  selectedValues?: string[];
  onSelect?: (values: string[]) => void;
  showSearch?: boolean;
  multiSelect?: boolean;
  placeholder?: string;
  error?: string;
  inputWrapperStyle?: ViewStyle;
}

const AppCustomDropdown: React.FC<AppCustomDropdownProps> = ({
  label,
  data = [],
  selectedValues = [],
  onSelect,
  showSearch = false,
  multiSelect = false,
  placeholder = '',
  error,
  inputWrapperStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedValues);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  // Sync internal state when parent updates (for reset)
  useEffect(() => {
    if (JSON.stringify(selectedValues) !== JSON.stringify(selected)) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  // Update parent when selected changes
  useEffect(() => {
    if (onSelect) {
      onSelect(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Handle select by VALUE instead of label
  const handleSelect = (item: DropdownItem) => {
    if (multiSelect) {
      if (selected.includes(item.value)) {
        setSelected(selected.filter(i => i !== item.value));
      } else {
        setSelected([...selected, item.value]);
      }
    } else {
      if (selected[0] === item.value) setSelected([]);
      else setSelected([item.value]);
      setVisible(false);
    }
  };

  const openModal = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const filteredData = data.filter(i =>
    i.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }: { item: DropdownItem }) => {
    const isSelected = selected.includes(item.value);
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleSelect(item)}
      >
        <Text
          style={[
            styles.itemText,
            { color: isSelected ? colors.mainColor : '#333' },
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <FontAwesome name="check" size={16} color={colors.mainColor} />
        )}
      </TouchableOpacity>
    );
  };

  // ✅ Display label(s) based on selected value(s)
  const selectedLabels = data
    .filter(i => selected.includes(i.value))
    .map(i => i.label)
    .join(', ');

  return (
    <>
      <TouchableOpacity
        style={[
          styles.inputWrapper,
          { marginBottom: error ? 5 : 16, ...inputWrapperStyle },
        ]}
        onPress={openModal}
      >
        <Typography style={{ color: selected.length ? '#000' : '#999' }}>
          {selected.length ? selectedLabels : placeholder || label}
        </Typography>
        <FontAwesome name="angle-down" size={18} color={colors.lightGary} />
      </TouchableOpacity>

      {error ? (
        <Typography variant="label" style={{ color: 'red', marginBottom: 10 }}>
          {error}
        </Typography>
      ) : null}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={styles.overlay}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Typography
              variant="body"
              weight="bold"
              style={styles.dropdownLabel}
            >
              {label}
            </Typography>
            {showSearch && (
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search..."
                placeholderTextColor={colors.gray}
                style={styles.searchInput}
              />
            )}
            {filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) => item.value + index}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>No results found</Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default React.memo(AppCustomDropdown);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    maxHeight: '70%',
  },
  dropdownLabel: {
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 14,
  },
  noResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noResultText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
