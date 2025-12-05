import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import AppTextInput from '../../../../ui/AppTextInput';
import DeleteModal from '../../../../ui/DeleteModal';
import styles from './styles';
import colors from '../../../../constants/colors';
import { AppDispatch, RootState } from '../../../../store';
import {
  deleteSubUser,
  fetchLandlordSubUser,
} from '../../../../store/mainSlice';
import AppButton from '../../../../ui/AppButton';
import { showErrorMsg, showSuccessMsg } from '../../../../utils/appMessages';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../../../navigation/NavKeys';
import { NAV_KEYS } from '../../../../navigation/NavKeys';
import { appLog } from '../../../../utils/appLog';

type SubUserNavProp = NativeStackNavigationProp<RootStackParamList>;

interface SubUserItem {
  password?: string;
  user_id: string;
  fullname?: string;
  email?: string;
  mobile?: string;
  role?: string;
  pg_code?: string;
  pg_name?: string;
  status?: string;
}

const SubUserScreen = () => {
  const navigation = useNavigation<SubUserNavProp>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { subUserList, loading } = useSelector(
    (state: RootState) => state.main,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SubUserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (userData?.company_id && userData?.user_id && isFocused) {
      const payload = {
        company_id: userData.company_id,
        landlord_id: userData.user_id,
        user_type: userData?.user_type,
        property_id: userData?.assigned_pg_ids,
      };
      dispatch(fetchLandlordSubUser(payload));
    }
  }, [dispatch, userData, isFocused]);

  const filteredSubUsers = (subUserList || []).filter((user: SubUserItem) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobile?.includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      user.pg_code?.toLowerCase().includes(query) ||
      user.pg_name?.toLowerCase().includes(query)
    );
  });

  const handleEdit = (item: any) => {
    navigation.navigate(NAV_KEYS.AddEditSubUserScreen, {
      subUserData: item,
    });
  };

  const renderHeaderAction = () => (
    <View style={styles.headerActionWrapper}>
      <AppButton
        title="+ Add New"
        titleSize="label"
        onPress={() => {
          navigation.navigate(NAV_KEYS.AddEditSubUserScreen, {});
        }}
        style={styles.headerActionBtn}
      />
    </View>
  );

  const openDeleteModal = (user: SubUserItem) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser?.user_id) {
      setDeleteModalVisible(false);
      return;
    }
    try {
      setDeleting(true);
      const payload = {
        user_id: selectedUser.user_id,
        company_id: userData?.company_id,
      };
      const resultAction = await dispatch(deleteSubUser(payload));
      const response = resultAction?.payload;
      if (response?.success) {
        showSuccessMsg(response?.message || 'User deleted successfully');
        dispatch(
          fetchLandlordSubUser({
            company_id: userData?.company_id,
            landlord_id: userData?.user_id,
            user_type: userData?.user_type,
            property_id: userData?.assigned_pg_ids,
          }),
        );
        setDeleteModalVisible(false);
      } else {
        showErrorMsg(response?.message || 'Failed to delete user');
      }
    } catch (error) {
      showErrorMsg('Something went wrong while deleting');
    } finally {
      setDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: SubUserItem }) => {
    const status = item.status || 'Inactive';
    const statusColor = status === 'Active' ? colors.succes : colors.red;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Typography
              variant="heading"
              weight="bold"
              style={styles.avatarText}
            >
              {item.fullname?.charAt(0)?.toUpperCase() || 'U'}
            </Typography>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Typography
              variant="subheading"
              weight="bold"
              style={styles.cardName}
            >
              {item.fullname || '-'}
            </Typography>
            <Typography variant="caption" style={styles.cardEmail}>
              {item.email || '-'}
            </Typography>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + '20' },
            ]}
          >
            <Typography
              variant="caption"
              weight="medium"
              style={[styles.statusText, { color: statusColor }]}
            >
              {status}
            </Typography>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardDetails}>
          <View style={styles.cardDetailItem}>
            <Feather name="briefcase" size={16} color={colors.gray} />
            <Typography variant="caption" style={styles.cardDetailText}>
              {item.role || '-'}
            </Typography>
          </View>
          <View style={styles.cardDetailItem}>
            <Feather name="phone" size={16} color={colors.gray} />
            <Typography variant="caption" style={styles.cardDetailText}>
              {item.mobile || '-'}
            </Typography>
          </View>
        </View>

        {(item.pg_code || item.pg_name) && (
          <View style={styles.cardDetailRow}>
            <View style={styles.cardDetailItem}>
              <Feather name="home" size={16} color={colors.gray} />
              <Typography variant="caption" style={styles.cardDetailText}>
                {item.pg_code || ''} {item.pg_name ? `- ${item.pg_name}` : ''}
              </Typography>
            </View>
            <View style={styles.cardDetailItem}>
              <Feather name="lock" size={16} color={colors.gray} />
              <Typography variant="caption" style={styles.cardDetailText}>
                {item?.password || '-'}
              </Typography>
            </View>
          </View>
        )}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            hitSlop={10}
            activeOpacity={0.7}
            onPress={() => handleEdit(item)}
          >
            <Feather name="edit" size={18} color={colors.mainColor} />
            <Typography
              variant="caption"
              weight="medium"
              style={[styles.actionText, { color: colors.mainColor }]}
            >
              Edit
            </Typography>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionButton}
            hitSlop={10}
            activeOpacity={0.7}
            onPress={() => openDeleteModal(item)}
          >
            <FontAwesome5 name="trash-alt" size={16} color={colors.error} />
            <Typography
              variant="caption"
              weight="medium"
              style={[styles.actionText, { color: colors.error }]}
            >
              Delete
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        showBack
        title="My Sub Users"
        rightIcon={renderHeaderAction()}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AppTextInput
          placeholder="Search by name, email, mobile, role, or PG..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInputContainer}
          style={styles.searchInput}
          leftIcon={<Feather name="search" size={20} color={colors.gray} />}
          rightIcon={
            searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={10}
                activeOpacity={0.7}
              >
                <Feather name="x" size={20} color={colors.gray} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.mainColor} />
        </View>
      ) : (
        <FlatList
          data={filteredSubUsers}
          keyExtractor={(item: SubUserItem) => item.user_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="users" size={64} color={colors.gray} />
              <Typography variant="body" style={styles.emptyText}>
                {searchQuery
                  ? 'No sub users found matching your search.'
                  : 'No Sub Users found.'}
              </Typography>
            </View>
          }
        />
      )}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Sub User?"
        subtitle={`Are you sure you want to delete ${
          selectedUser?.fullname || 'this sub user'
        }?`}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </View>
  );
};

export default SubUserScreen;
