import React, {useState, useLayoutEffect} from 'react';
import {Box, Button, Text, HamburgerIcon, Icon} from 'native-base';
import {Animated, Platform} from 'react-native';
import chatStyle from '../styles/chatStyle';
import {COLOR} from '../misc/constants';
// import {Ionicons} from '@expo/vector-icons';

const Chat = props => {
  const {navigation, sendbird} = props;
  const [padding, setPadding] = useState(new Animated.Value(0));
  const [currentScreen, setCurrentScreen] = useState(1);

  const openMenu = () => {
    setCurrentScreen(0);
    Animated.timing(padding, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const openOnlineMember = () => {
    setCurrentScreen(2);
    Animated.timing(padding, {
      toValue: -300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const reset = () => {
    Animated.timing(padding, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentScreen(1);
    });
  };

  const leftBox = (
    <Box style={[chatStyle.leftBox, {elevation: currentScreen == 0 ? 3 : 1}]} />
  );

  const middleBox = (
    <Animated.View
      // style={chatStyle.middleBox}
      style={[chatStyle.middleBox, {marginLeft: padding}]}>
      <Box style={chatStyle.header}>
        <Button
          variant="link"
          style={chatStyle.headerButton}
          onPress={openMenu}>
          <HamburgerIcon color="white" />
        </Button>
        <Box style={{flex: 1}} />
        <Button
          variant="outline"
          size="xs"
          style={chatStyle.headerButton}
          onPress={openOnlineMember}>
          <Text color="white">Online (1)</Text>
        </Button>
      </Box>

      {currentScreen != 1 ? (
        <Button
          onPress={reset}
          style={{
            backgroundColor: 'black',
            opacity: 0.4,
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
        />
      ) : undefined}
    </Animated.View>
  );

  const rightBox = (
    <Box style={[chatStyle.rightBox, {elevation: currentScreen == 2 ? 3 : 1}]}>
      <Text>Connected member</Text>
    </Box>
  );

  const bg = <Box style={chatStyle.background}></Box>;

  return (
    <Box>
      <Box style={chatStyle.container}>
        {bg}
        {leftBox}
        {rightBox}
        {middleBox}
      </Box>
    </Box>
  );
};

export default Chat;
