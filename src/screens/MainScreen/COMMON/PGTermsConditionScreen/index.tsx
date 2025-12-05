import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RenderHTML from 'react-native-render-html';
import { fetchPGTermsCondition } from '../../../../store/mainSlice';
import Typography from '../../../../ui/Typography';
import AppHeader from '../../../../ui/AppHeader';
import colors from '../../../../constants/colors';
import { useWindowDimensions } from 'react-native';
import styles from './styles';
import { useRoute } from '@react-navigation/native';

const PGTermsConditionScreen = () => {
  const route = useRoute();
  const params = route.params as
    | {
        pgId?: string | number;
        companyId?: string | number;
        userId?: string | number;
        isLandlord?: boolean;
      }
    | undefined;
  const pgId = params?.pgId;
  const companyId = params?.companyId;
  const dispatch = useDispatch<any>();
  const { width } = useWindowDimensions();
  const { loading, pgTermsConditionData, apiUserData } = useSelector(
    (state: any) => state.main,
  );
  const privacyPolicy = pgTermsConditionData?.tnc_html || '';

  const userId =
    apiUserData?.data?.user_id ?? apiUserData?.user_id ?? params?.userId;

  useEffect(() => {
    if (!pgId || !companyId || !userId) {
      return;
    }
    dispatch(
      fetchPGTermsCondition({
        compnay_id: Number(companyId),
        pg_id: Number(pgId),
        user_id: params?.isLandlord ? null : Number(userId) || null,
      }),
    );
  }, [companyId, dispatch, pgId, userId]);

  return (
    <View style={styles.container}>
      <AppHeader title="PG Terms and Conditions" showBack rightIcon={false} />
      {loading ? (
        <View style={styles.loaderContainer}>
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
            <Typography>No Terms and Conditions found.</Typography>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PGTermsConditionScreen;
