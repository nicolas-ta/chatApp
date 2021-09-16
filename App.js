/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {NativeBaseProvider} from 'native-base';
import {AppContext} from '@src/context';
import {Chat, Login} from '@screens';
import SendBird from 'sendbird';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SENDBIRD_APPID} from '@misc/config';

const appId = SENDBIRD_APPID;
const sendbird = new SendBird({appId});
sendbird.setErrorFirstCallback(true);
const Stack = createStackNavigator();

const initialState = {
  sendbird,
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AppContext.Provider value={initialState}>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </AppContext.Provider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
