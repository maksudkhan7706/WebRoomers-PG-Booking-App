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

const TermsConditionsScreen = () => {
  const dispatch = useDispatch<any>();
  const { width } = useWindowDimensions();
  const { userData, settingsData, loading } = useSelector(
    (state: any) => state.main,
  );
  const termsConditions = settingsData?.terms_conditions?.content || '';

  useEffect(() => {
    dispatch(getSettings({ company_id: userData?.company_id}));
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Terms & Conditions" showBack rightIcon={false} />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {termsConditions ? (
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: termsConditions }}
            />
          ) : (
            <Typography>No Terms & Conditions found.</Typography>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default TermsConditionsScreen;
