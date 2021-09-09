import React, {useState} from 'react';
import {Box, Button} from 'native-base';
import {Animated} from 'react-native';
import chatStyle from '../styles/chatStyle';
import {VALUE} from '../misc/constants';

import ChannelSelection from '../components/chanelSelection';
import CurrentChat from '../components/currentChat';
import MemberList from '../components/memberList';

const Chat = props => {
  const {navigation, sendbird} = props;
  const [padding, setPadding] = useState(new Animated.Value(0));
  const [currentScreen, setCurrentScreen] = useState(1);

  /** Open the left panel showing the channels */
  const openMenu = () => {
    setCurrentScreen(0);
    Animated.timing(padding, {
      toValue: VALUE.chatPanOffset,
      duration: VALUE.chatPanDuration,
      useNativeDriver: false,
    }).start();
  };

  /** Open the right panel showing the connected members */
  const openOnlineMember = () => {
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

  /** Define the left panel */
  const channelPanel = (
    <ChannelSelection isCurrentScreen={currentScreen === 0} />
  );

  /** Define the main chat view */
  const currentChat = (
    <Animated.View style={[chatStyle.middleBox, {marginLeft: padding}]}>
      <CurrentChat
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
  const memberPanel = <MemberList isCurrentScreen={currentScreen === 2} />;

  /** Define the background, behind the chat view, and in front of the left or right panel
   * depending on the selected screen
   */
  const bg = <Box style={chatStyle.background} />;

  return (
    <Box>
      {bg}
      {channelPanel}
      {memberPanel}
      {currentChat}
    </Box>
  );
};

export default Chat;
