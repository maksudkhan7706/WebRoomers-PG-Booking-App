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
  label?: string;
  data: DropdownItem[];
  selectedValues?: string[];
  onSelect?: (values: string[]) => void;
  showSearch?: boolean;
  multiSelect?: boolean;
  placeholder?: string;
  error?: string;
  inputWrapperStyle?: ViewStyle;
  editable?: boolean; // ✅ added prop
  dropdownContainerStyle?: ViewStyle;
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
  dropdownContainerStyle,
  editable = true, // ✅ default true
}) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedValues);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  // Sync internal state when parent updates
  useEffect(() => {
    if (JSON.stringify(selectedValues) !== JSON.stringify(selected)) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  // Update parent when selected changes
  useEffect(() => {
    if (onSelect) onSelect(selected);
  }, [selected]);

  const handleSelect = (item: DropdownItem) => {
    if (!editable) return; // ✅ prevent selection if not editable
    if (multiSelect) {
      if (selected.includes(item.value))
        setSelected(selected.filter(i => i !== item.value));
      else setSelected([...selected, item.value]);
    } else {
      if (selected[0] === item.value) setSelected([]);
      else setSelected([item.value]);
      setVisible(false);
    }
  };

  const openModal = () => {
    if (!editable) return; // ✅ disable opening
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

  const selectedLabels = data
    .filter(i => selected.includes(i.value))
    .map(i => i.label)
    .join(', ');

  return (
    <>
      <View style={styles.container}>
        {label && (
          <Typography
            variant="caption"
            weight="medium"
            color={colors.textDark}
            style={styles.label}
          >
            {label}
          </Typography>
        )}
        <TouchableOpacity
          style={[
            styles.inputWrapper,
            {
              marginBottom: error ? 5 : 0,
              backgroundColor: editable ? colors.white : '#f5f5f5', // grey background if not editable
              borderColor: editable ? colors.mainColor : '#ccc', //light border if not editable
              ...inputWrapperStyle,
            },
          ]}
          onPress={openModal}
          activeOpacity={editable ? 0.7 : 1} //disable press effect
        >
          <Typography
            numberOfLines={multiSelect ? 2 : 1}
            variant={multiSelect ? 'label' : 'body'}
            style={{ color: selected.length ? '#000' : '#999', width: '95%' }}
          >
            {selected.length ? selectedLabels : placeholder || '-- SELECT --'}
          </Typography>
          {editable ? (
            <FontAwesome
              name="angle-down"
              size={18}
              color={colors.lightGary} //greyed arrow
            />
          ) : null}
        </TouchableOpacity>

        {error ? (
          <Typography variant="caption" color={colors.error} style={styles.error}>
            {error}
          </Typography>
        ) : null}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={styles.overlay}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              !showSearch && styles.dropdownContainerNoSearch,
              showSearch && styles.dropdownContainerWithSearch,
              dropdownContainerStyle,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {showSearch && (
              <Typography
                variant="body"
                weight="bold"
                style={styles.dropdownLabel}
              >
                {label}
              </Typography>
            )}
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
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 45,
    justifyContent: 'space-between',
  },
  error: {
    marginTop: 4,
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
  dropdownContainerNoSearch: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingHorizontal: 15,
  },
  dropdownContainerWithSearch: {
    paddingTop: 0,
    paddingBottom: 8,
    paddingHorizontal: 15,
  },
  dropdownLabel: {
    marginBottom: 0,
  },
  dropdownLabelNoSearch: {
    marginBottom: 0,
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: colors.mainColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 0,
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
