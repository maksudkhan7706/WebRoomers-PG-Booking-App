import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Typography from '../../../../../ui/Typography';
import colors from '../../../../../constants/colors';
import FilterChip from './FilterChip';

type EnquiryStatus = 'pending' | 'approved' | null;
type ActiveStatus = 'active' | 'inactive' | null;
type CheckoutStatus = 'pending' | 'approved' | 'rejected' | null;

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;

  enquiryStatus: EnquiryStatus;
  onChangeEnquiryStatus: (value: EnquiryStatus) => void;

  activeStatus: ActiveStatus;
  onChangeActiveStatus: (value: ActiveStatus) => void;

  checkoutStatus: CheckoutStatus;
  onChangeCheckoutStatus: (value: CheckoutStatus) => void;

  onReset: () => void;
  onApply: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  visible,
  onClose,
  enquiryStatus,
  onChangeEnquiryStatus,
  activeStatus,
  onChangeActiveStatus,
  checkoutStatus,
  onChangeCheckoutStatus,
  onReset,
  onApply,
}) => {
  const toggleEnquiry = (value: Exclude<EnquiryStatus, null>) => {
    onChangeEnquiryStatus(enquiryStatus === value ? null : value);
  };

  const toggleActive = (value: Exclude<ActiveStatus, null>) => {
    onChangeActiveStatus(activeStatus === value ? null : value);
  };

  const toggleCheckout = (value: Exclude<CheckoutStatus, null>) => {
    onChangeCheckoutStatus(checkoutStatus === value ? null : value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Typography variant="body" weight="bold" style={styles.headerTitle}>
              Filters
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Enquiry Status */}
          <View style={styles.section}>
            <Typography
              variant="caption"
              weight="medium"
              style={styles.sectionLabel}
            >
              Enquiry Status
            </Typography>
            <View style={styles.chipRow}>
              <FilterChip
                label="Pending"
                active={enquiryStatus === 'pending'}
                onPress={() => toggleEnquiry('pending')}
              />
              <FilterChip
                label="Approved"
                active={enquiryStatus === 'approved'}
                onPress={() => toggleEnquiry('approved')}
              />
            </View>
          </View>

          {/* Active Status */}
          <View style={styles.section}>
            <Typography
              variant="caption"
              weight="medium"
              style={styles.sectionLabel}
            >
              Active Status
            </Typography>
            <View style={styles.chipRow}>
              <FilterChip
                label="Active"
                active={activeStatus === 'active'}
                onPress={() => toggleActive('active')}
              />
              <FilterChip
                label="Inactive"
                active={activeStatus === 'inactive'}
                onPress={() => toggleActive('inactive')}
              />
            </View>
          </View>

          {/* Checkout Status */}
          <View style={styles.section}>
            <Typography
              variant="caption"
              weight="medium"
              style={styles.sectionLabel}
            >
              Checkout Status
            </Typography>
            <View style={styles.chipRow}>
              <FilterChip
                label="Pending"
                active={checkoutStatus === 'pending'}
                onPress={() => toggleCheckout('pending')}
              />
              <FilterChip
                label="Approved"
                active={checkoutStatus === 'approved'}
                onPress={() => toggleCheckout('approved')}
              />
              <FilterChip
                label="Rejected"
                active={checkoutStatus === 'rejected'}
                onPress={() => toggleCheckout('rejected')}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
              <Typography
                variant="body"
                weight="medium"
                style={styles.resetText}
              >
                Reset Filters
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onApply();
                onClose();
              }}
            >
              <Typography
                variant="body"
                weight="medium"
                style={styles.applyText}
              >
                Apply Filters
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.textDark || '#111827',
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    color: '#6B7280',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 25,
    marginBottom: 40,
  },
  resetBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.mainColor,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resetText: {
    color: colors.mainColor,
  },
  applyBtn: {
    flex: 1,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainColor,
  },
  applyText: {
    color: colors.white,
  },
});

export default React.memo(FiltersModal);
