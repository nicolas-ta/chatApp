import React from 'react';
import {Box, Text} from 'native-base';
import chatStyle from '../../styles/chatStyle';

const MemberList = props => {
  return (
    <Box
      style={[
        {...chatStyle.rightBox},
        {elevation: props.isCurrentScreen ? 3 : 1},
      ]}>
      <Text>TEST</Text>
      <Text>TEST</Text>
      <Text>TEST</Text>
    </Box>
  );
};

export default MemberList;
