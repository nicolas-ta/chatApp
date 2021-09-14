import React from 'react';
import {Box, Text} from 'native-base';
import chatStyle from '../../styles/chat.style';

const MemberList = props => {
  return (
    <Box
      style={[
        {...chatStyle.rightBox},
        // eslint-disable-next-line react-native/no-inline-styles
        {elevation: props.isCurrentScreen ? 3 : 1},
      ]}>
      <Text>TEST</Text>
      <Text>TEST</Text>
      <Text>TEST</Text>
    </Box>
  );
};

export default MemberList;
