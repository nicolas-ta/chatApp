import React, {useReducer} from 'react';

import {loginReducer} from '../reducer/login';
import loginStyle from '../styles/loginStyle';
import {withAppContext} from '../context';
import {Animated} from 'react-native';
import {Heading, Box, Input, Button, Spinner, Text} from 'native-base';
import {COLOR} from '../misc/constants';

const Login = props => {
  const CHANNEL_URL =
    'sendbird_open_channel_20029_336b5fc119f6b2a0edfb5629382bdf63eb9700ca';

  const {navigation, sendbird} = props;
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });

  const showErrorFadeDuration = 200;
  const showErrorDuration = 3500;

  const fade = new Animated.Value(0);
  const showError = message => {
    dispatch({type: 'error', payload: {error: message}});
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: showErrorFadeDuration,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        delay: showErrorDuration,
        duration: showErrorFadeDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const login = () => {
    if (state.connecting) {
      return;
    }
    dispatch({type: 'start-connection'});
    sendbird
      .connect(state.nickname, (error, user) => {
        if (error) {
          showError(error.message);
          dispatch({type: 'end-connection'});
          return;
          // Handle error.
        }
        sendbird
          .updateCurrentUserInfo(state.nickname, '', (err, currentUser) => {
            if (err) {
              showError(err.message);
              dispatch({type: 'end-connection'});
              return;
              // Handle error.
            }
            enterHomeChannel(currentUser);
          })
          .catch(err => {
            showError(err.message);
          });

        // The user is connected to Sendbird server.
      })
      .catch(error => {
        showError(error.message);
      });
  };

  const enterHomeChannel = currentUser => {
    sendbird.OpenChannel.getChannel(CHANNEL_URL, (error, channel) => {
      if (error) {
        console.error(error.message);
        // Handle error.
      }

      // Call the instance method of the result object in the "openChannel" parameter of the callback function.
      channel.enter((err, response) => {
        if (err) {
          console.error(err.message);
          // Handle error.
        }
        // The current user successfully enters the open channel,
        // and can chat with other users in the channel by using APIs.
        dispatch({type: 'end-connection'});

        navigation.navigate('Chat', {currentUser, channel});
      });
    });
  };

  return (
    <Box style={loginStyle.container} safeArea>
      <Box style={loginStyle.mainWrapper}>
        <Heading size="4xl" style={loginStyle.logoTitle}>
          10CUT
        </Heading>
        <Input
          md="10"
          maxLength={16}
          value={state.username}
          onChangeText={content => {
            dispatch({type: 'edit-nickname', payload: {content}});
            dispatch({type: 'edit-userId', payload: {content}});
          }}
          variant="filled"
          placeholder="Username (16 char max)"
          _light={{
            placeholderTextColor: 'blueGray.400',
          }}
          blurOnSubmit
          autoFocus
          _dark={{
            placeholderTextColor: 'blueGray.50',
          }}
        />

        <Button
          disabled={state.connecting}
          style={loginStyle.loginButton}
          onPress={() => login()}>
          Join
        </Button>
        {state.connecting ? (
          <Spinner
            style={loginStyle.spinner}
            animating={state.connecting}
            size="large"
            color={COLOR.yellow}
          />
        ) : undefined}
        <Animated.View style={fade}>
          <Text style={loginStyle.loginError}>{state.error}</Text>
        </Animated.View>
      </Box>
    </Box>
  );
};

export default withAppContext(Login);
