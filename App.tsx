import React, { useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import colors from './src/constants/colors';
import FlashMessage from 'react-native-flash-message';
import { loadUserFromStorage } from './src/store/authSlice';
import { NavigationContainer } from '@react-navigation/native';

const AppWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();
  const [loadingUser, setLoadingUser] = React.useState(true);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(loadUserFromStorage());
      setLoadingUser(false);
    };
    loadUser();
  }, [dispatch]);

  if (loadingUser) {
    return <View style={{ flex: 1, backgroundColor: colors.white }} />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.mainColor} />
      <View style={{ flex: 1, backgroundColor: colors.logoBg }}>
        <RootNavigator />
      </View>
      <FlashMessage
        position="top"
        style={{
          paddingTop:
            Platform.OS === 'ios'
              ? insets.top + 20
              : (StatusBar.currentHeight ?? 0) + 20,
        }}
      />
    </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <AppWrapper />
    </SafeAreaProvider>
  </Provider>
);

export default App;
