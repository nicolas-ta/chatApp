import React from 'react';
import {
  Box,
  Button,
  Text,
  HamburgerIcon,
  Input,
  KeyboardAvoidingView,
  Spacer,
} from 'native-base';
import {Platform} from 'react-native';
import chatStyle from '../styles/chatStyle';
import {COLOR} from '../misc/constants';

const CurrentChat = props => {
  const header = (
    <Box style={chatStyle.header}>
      <Button
        variant="link"
        style={chatStyle.headerButton}
        onPress={props.openMenu}>
        <HamburgerIcon color={COLOR.red} />
      </Button>
      <Spacer />
      <Button
        variant="filled"
        size="xs"
        style={chatStyle.headerButton}
        onPress={props.openOnlineMember}>
        <Text color={COLOR.red}>Online (1000)</Text>
      </Button>
    </Box>
  );

  const input = (
    <Input
      type="text"
      borderColor={COLOR.blue}
      borderWidth={0}
      roundedRight={0}
      mt={10}
      style={chatStyle.input}
      InputRightElement={
        <Button
          ml={0}
          style={chatStyle.sendButton}
          borderWidth={2}
          borderColor={COLOR.red}
          roundedLeft={0}
          roundedRight="md">
          Send
        </Button>
      }
      placeholder="Type your message here"
    />
  );
  return (
    <KeyboardAvoidingView
      height="100%"
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {header}
      <Spacer />
      {input}
      {props.overlay}
    </KeyboardAvoidingView>
  );
};

export default CurrentChat;
