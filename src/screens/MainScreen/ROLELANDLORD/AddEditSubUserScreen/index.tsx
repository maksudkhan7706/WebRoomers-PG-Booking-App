import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import AppCustomDropdown, {
  DropdownItem,
} from '../../../../ui/AppCustomDropdown';
import AppButton from '../../../../ui/AppButton';
import colors from '../../../../constants/colors';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchMyPgList,
  addEditSubUser,
  fetchAllUserPermissions,
} from '../../../../store/mainSlice';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import { RootStackParamList } from '../../../../navigation/NavKeys';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

type AddEditSubUserNavProp = NativeStackNavigationProp<RootStackParamList>;

const defaultRoleOptions: DropdownItem[] = [
  { label: 'Manager', value: 'Manager' },
  { label: 'Warden', value: 'Warden' },
  { label: 'Technician', value: 'Technician' },
  { label: 'Cleaner', value: 'Cleaner' },
];

type FormData = {
  subUserId: number | null;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  assignedPg: string;
  assignedPgId: string;
  password: string;
  status: string;
  permissions: string[];
};

type PermissionOption = {
  id: string;
  key: string;
  label: string;
};

const toStringList = (input: any): string[] => {
  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    return input
      .map(item => {
        if (item === null || item === undefined) {
          return null;
        }
        if (typeof item === 'object') {
          const possibleValue =
            item.permission_id ??
            item.id ??
            item.permission_key ??
            item.key ??
            item.value;
          return possibleValue !== undefined ? possibleValue?.toString() : null;
        }
        return item?.toString?.() ?? null;
      })
      .filter(Boolean) as string[];
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return toStringList(parsed);
      }
    } catch {
      return trimmed
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const initialFormState: FormData = {
  subUserId: null,
  fullName: '',
  email: '',
  mobile: '',
  role: '',
  assignedPg: '',
  assignedPgId: '',
  password: '',
  status: '',
  permissions: [],
};

const AddEditSubUserScreen = () => {
  const navigation = useNavigation<AddEditSubUserNavProp>();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { myPgList, loading, userAllPermissions } = useSelector(
    (state: RootState) => state.main,
  );

  const { subUserData } = (route.params as any) || {};

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchData = useCallback(() => {
    if (userData?.company_id && userData?.user_id) {
      dispatch(
        fetchMyPgList({
          company_id: userData.company_id,
          landlord_id: userData.user_id,
          user_type: userData?.user_type,
          property_id: userData?.assigned_pg_ids,
        }),
      );
      dispatch(fetchAllUserPermissions({ company_id: userData.company_id }));
    }
  }, [dispatch, userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pgOptions = useMemo<DropdownItem[]>(() => {
    const pgListData = (myPgList as any)?.data;
    if (Array.isArray(pgListData) && pgListData.length > 0) {
      return pgListData.map((item: any) => ({
        label: `${item?.property_code || ''} - ${item?.title || ''}`.trim(),
        value: item?.property_id?.toString() || '',
      }));
    }
    return [];
  }, [myPgList]);

  const statusOptions = useMemo<DropdownItem[]>(
    () => [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '0' },
    ],
    [],
  );

  const permissionOptions = useMemo<PermissionOption[]>(() => {
    if (Array.isArray(userAllPermissions) && userAllPermissions.length > 0) {
      return userAllPermissions
        .filter((perm: any) => perm.status === 'Active')
        .map((perm: any, index: number) => ({
          id:
            perm.permission_id?.toString() ||
            perm.id?.toString() ||
            perm.permission_key?.toString() ||
            `${index}`,
          key:
            perm.permission_key?.toString() ||
            perm.key?.toString() ||
            perm.permission_id?.toString() ||
            `${index}`,
          label:
            perm.permission_label ||
            perm.permission_name ||
            perm.label ||
            perm.permission_key ||
            `Permission ${index + 1}`,
        }));
    }
    // Fallback to default if API data not available
    return [
      { id: '1', key: 'add_pg', label: 'Add PG' },
      { id: '2', key: 'payment_details', label: 'Payment Details' },
      { id: '3', key: 'complaint', label: 'Complaint' },
      { id: '4', key: 'edit_pg', label: 'Edit PG' },
      { id: '5', key: 'pg_list', label: 'PG List' },
      { id: '6', key: 'subuser_list', label: 'Subuser List' },
      { id: '7', key: 'enquiry', label: 'Enquiry' },
      { id: '8', key: 'renewal', label: 'Renewal' },
    ];
  }, [userAllPermissions]);

  const permissionKeyToIdMap = useMemo(() => {
    const map = new Map<string, string>();
    permissionOptions.forEach(option => {
      if (option.key) {
        map.set(option.key.toString(), option.id);
      }
    });
    return map;
  }, [permissionOptions]);

  useEffect(() => {
    if (subUserData) {
      // Edit mode - pre-fill form
      const pgId =
        subUserData.pg_id ||
        subUserData.property_id ||
        subUserData.assigned_pg_id;
      const pgCode = subUserData.pg_code || subUserData.property_code;
      const selectedPg = pgOptions.find(
        pg => pg.value === pgId?.toString() || pg.label.includes(pgCode || ''),
      );

      const existingPermissions = (() => {
        const directIds = toStringList(subUserData.user_permissions);
        if (directIds.length > 0) {
          return directIds;
        }

        if (subUserData.permissions) {
          const permissionsList = toStringList(subUserData.permissions);
          if (permissionsList.length > 0) {
            return permissionsList
              .map(value => {
                if (!value) {
                  return null;
                }
                const mapped =
                  permissionKeyToIdMap.get(value) ||
                  permissionKeyToIdMap.get(value.toString());
                return (mapped || value)?.toString();
              })
              .filter(Boolean) as string[];
          }
        }

        return [];
      })();

      setFormData({
        subUserId: subUserData.user_id,
        fullName: subUserData.fullname || '',
        email: subUserData.email || '',
        mobile: subUserData.mobile || '',
        role: subUserData.role || '',
        assignedPg: selectedPg?.label || '',
        assignedPgId: selectedPg?.value || pgId?.toString() || '',
        password: '',
        status: subUserData.status === 'Active' ? '1' : '0',
        permissions: existingPermissions,
      });
    } else {
      // Add mode - reset form
      setFormData(initialFormState);
    }
  }, [subUserData, pgOptions, permissionKeyToIdMap]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[],
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => {
      const currentPermissions = prev.permissions || [];
      const isSelected = currentPermissions.includes(permissionId);
      return {
        ...prev,
        permissions: isSelected
          ? currentPermissions.filter(p => p !== permissionId)
          : [...currentPermissions, permissionId],
      };
    });
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = 'Enter a valid email';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit mobile';
    }

    if (!formData.role) {
      errors.role = 'Select a role';
    }

    if (!formData.assignedPgId) {
      errors.assignedPg = 'Assign at least one PG';
    }

    if (!formData.subUserId) {
      if (!formData.password.trim()) {
        errors.password = 'Password is required';
      } else if (formData.password.trim().length < 6) {
        errors.password = 'Minimum 6 characters required';
      }
    } else if (
      formData.password.trim() &&
      formData.password.trim().length < 6
    ) {
      errors.password = 'Minimum 6 characters required';
    }

    if (!formData.status) {
      errors.status = 'Select status';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setFormSubmitting(true);
    try {
      const numericPermissionIds = (formData.permissions || [])
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));

      const selectedPermissionIds =
        numericPermissionIds.length > 0
          ? numericPermissionIds
          : (formData.permissions || []).map(id => id);
      const permissionsToSend = selectedPermissionIds.join(',');

      const payload: any = {
        sub_user_id: formData.subUserId,
        company_id: userData?.company_id,
        landlord_id: userData?.user_id,
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        role: formData.role.toLowerCase(),
        assigned_pg_id: formData.assignedPgId,
        status: formData.status,
        permissions: permissionsToSend,
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const resultAction = await dispatch(addEditSubUser(payload));
      const response = resultAction?.payload;

      if (response?.success) {
        showSuccessMsg(
          response?.message ||
            (formData.subUserId
              ? 'Sub-user updated successfully'
              : 'Sub-user added successfully'),
        );
        navigation.goBack();
      } else {
        showErrorMsg(
          response?.message || 'Failed to save sub-user. Please try again.',
        );
      }
    } catch (error) {
      showErrorMsg('Unable to save sub user right now.');
    } finally {
      setFormSubmitting(false);
    }
  };
  return (
    <View style={styles.container}>
      <AppHeader
        showBack
        rightIcon={false}
        title={formData.subUserId ? 'Edit Sub User' : 'Add New Sub User'}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppTextInput
            label="Full Name *"
            placeholder="Enter full name"
            value={formData.fullName}
            onChangeText={text => handleInputChange('fullName', text)}
            error={formErrors.fullName}
            autoCapitalize="words"
          />
          <AppTextInput
            label="Email *"
            placeholder="Enter email"
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />
          <AppTextInput
            label="Mobile *"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChangeText={text => handleInputChange('mobile', text)}
            keyboardType="phone-pad"
            maxLength={10}
            error={formErrors.mobile}
          />
          <View style={styles.dropdownWrapper}>
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textDark}
              style={styles.dropdownLabel}
            >
              Role *
            </Typography>
            <AppCustomDropdown
              label=""
              placeholder="Select Role"
              data={defaultRoleOptions}
              selectedValues={formData.role ? [formData.role] : []}
              onSelect={values => handleInputChange('role', values[0] || '')}
              error={formErrors.role}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textDark}
              style={styles.dropdownLabel}
            >
              Assign PG *
            </Typography>
            <AppCustomDropdown
              label=""
              placeholder="Select PG"
              data={pgOptions}
              selectedValues={
                formData.assignedPgId ? [formData.assignedPgId] : []
              }
              onSelect={values => {
                const selectedPg = pgOptions.find(pg => pg.value === values[0]);
                handleInputChange('assignedPgId', values[0] || '');
                handleInputChange('assignedPg', selectedPg?.label || '');
              }}
              showSearch
              error={formErrors.assignedPg}
            />
          </View>
          {!formData.subUserId && (
            <AppTextInput
              label="Password *"
              placeholder="Enter password"
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
              secureTextEntry
              error={formErrors.password}
            />
          )}
          <View style={styles.dropdownWrapper}>
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textDark}
              style={styles.dropdownLabel}
            >
              Status *
            </Typography>
            <AppCustomDropdown
              label=""
              placeholder="Select Status"
              data={statusOptions}
              selectedValues={formData.status ? [formData.status] : []}
              onSelect={values => handleInputChange('status', values[0] || '')}
              error={formErrors.status}
            />
          </View>

          {/* Manage Permissions Section */}
          <View style={styles.permissionsSection}>
            <View style={styles.permissionsHeader}>
              <MaterialIcons name="lock" size={20} color="#D4AF37" />
              <Typography
                variant="body"
                weight="bold"
                style={styles.permissionsTitle}
              >
                Manage Permissions
              </Typography>
            </View>
            <View style={styles.permissionsGrid}>
              {permissionOptions.map(permission => {
                const isSelected = formData.permissions.includes(permission.id);
                return (
                  <TouchableOpacity
                    key={permission.id}
                    style={styles.permissionItem}
                    onPress={() => togglePermission(permission.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={
                        isSelected ? 'check-box' : 'check-box-outline-blank'
                      }
                      size={22}
                      color={isSelected ? colors.mainColor : '#999'}
                    />
                    <Typography
                      variant="label"
                      numberOfLines={1}
                      style={[
                        styles.permissionLabel,
                        isSelected && styles.permissionLabelSelected,
                      ]}
                    >
                      {permission.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <AppButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          style={[styles.footerButton, styles.cancelButton]}
          titleSize="label"
        />
        <AppButton
          title={formData.subUserId ? 'UPDATE SUB USER' : 'Add Sub User'}
          onPress={handleSubmit}
          loading={formSubmitting}
          style={styles.footerButton}
          titleSize="label"
        />
      </View>
    </View>
  );
};

export default AddEditSubUserScreen;
