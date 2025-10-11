// App.tsx
import React, { useState } from 'react';
import { StatusBar, View, Platform } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import colors from './src/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {/* Android ke liye StatusBar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.mainColor}
      />
      {/* SafeAreaView iOS ke liye */}
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainColor }}>
        {/* Ek wrapper view agar iOS me background cover karna ho */}
        <View style={{ flex: 1, backgroundColor: colors.logoBg }}>
          <RootNavigator isAuth={isAuth} setIsAuth={setIsAuth} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
