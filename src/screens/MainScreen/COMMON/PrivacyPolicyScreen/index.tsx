import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RenderHTML from 'react-native-render-html';
import { getSettings } from '../../../../store/mainSlice';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import styles from './styles';
import colors from '../../../../constants/colors';
import { useWindowDimensions } from 'react-native';

const PrivacyPolicyScreen = () => {
  const dispatch = useDispatch<any>();
  const { width } = useWindowDimensions();
  const { userData } = useSelector((state: any) => state.auth);
  const { settingsData, loading } = useSelector((state: any) => state.main);

  useEffect(() => {
    dispatch(getSettings({ company_id: userData?.company_id }));
  }, []);

  const privacyPolicy = settingsData?.privacy_policy?.content || '';
  console.log('PrivacyPolicyScreen userData ============', userData);

  return (
    <View style={styles.container}>
      <AppHeader title="Privacy Policy" showBack />

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {privacyPolicy ? (
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: privacyPolicy }}
            />
          ) : (
            <Typography>No Privacy Policy found.</Typography>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PrivacyPolicyScreen;
