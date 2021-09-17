import React, {useState} from 'react';
import {Box, Button} from 'native-base';
import {Animated, Keyboard} from 'react-native';
import {withAppContext} from '../context';
import {VALUE} from '@constants';
import {chatStyle} from '@styles';
import {MemberList, CurrentChat, ChannelSelection} from '@screens';

const Chat = props => {
  const [padding] = useState(new Animated.Value(0));
  const {route} = props;
  const [currentScreen, setCurrentScreen] = useState(1);

  /** Open the left panel showing the channels */
  const openMenu = () => {
    Keyboard.dismiss();
    setCurrentScreen(0);
    Animated.timing(padding, {
      toValue: VALUE.chatPanOffset,
      duration: VALUE.chatPanDuration,
      useNativeDriver: false,
    }).start();
  };

  /** Open the right panel showing the connected members */
  const openOnlineMember = () => {
    Keyboard.dismiss();
    setCurrentScreen(2);
    Animated.timing(padding, {
      toValue: -VALUE.chatPanOffset,
      duration: VALUE.chatPanDuration,
      useNativeDriver: false,
    }).start();
  };

  /** Return to the main chat screen */
  const reset = () => {
    Animated.timing(padding, {
      toValue: 0,
      duration: VALUE.chatPanDuration,
      useNativeDriver: false,
    }).start(() => {
      setCurrentScreen(1);
    });
  };

  /** UI */
  /** Define the left panel */
  const channelPanel = (
    <ChannelSelection
      {...props}
      isCurrentScreen={currentScreen === 0}
      goToChat={newChannel => {
        reset();
        route.params.channel = newChannel;
      }}
    />
  );

  /** Define the main chat view */
  const currentChat = (
    <Animated.View style={[chatStyle.middleBox, {marginLeft: padding}]}>
      <CurrentChat
        isCurrentScreen={currentScreen === 1}
        {...props}
        openMenu={openMenu}
        openOnlineMember={openOnlineMember}
        overlay={
          currentScreen !== 1 ? (
            <Button onPress={reset} style={chatStyle.overlay} />
          ) : undefined
        }
      />
    </Animated.View>
  );

  /** Define the right panel */
  const memberPanel = (
    <MemberList
      {...props}
      isCurrentScreen={currentScreen === 2}
      resetPannel={reset}
    />
  );

  /** Define the background, behind the chat view, and in front of the left or right panel
   * depending on the selected screen
   */
  const bg = <Box style={chatStyle.background} />;

  return (
    <Box>
      {bg}
      {channelPanel}
      {currentScreen === 2 ? memberPanel : undefined}
      {currentChat}
    </Box>
  );
};

export default withAppContext(Chat);
