import React from 'react';
import {Box, Text} from 'native-base';
import chatStyle from '../styles/chatStyle';

const ChannelSelection = props => {
  return (
    <Box
      style={[chatStyle.leftBox, {elevation: props.isCurrentScreen ? 3 : 1}]}>
      <Text>Channel Seleection</Text>
    </Box>
  );
};

export default ChannelSelection;
