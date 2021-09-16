/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {createContext} from 'react';

import {NativeBaseProvider} from 'native-base';
import Login from './src/screens/login';
import {AppContext} from './src/context';
import Chat from './src/screens/chat';
import SendBird from 'sendbird';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const appId = '537DE3CB-FB82-43D2-8CB6-C46CD62394A9';
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
