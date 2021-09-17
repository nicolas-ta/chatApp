import React from 'react';
import {Box, Text, FlatList} from 'native-base';
import {Dimensions, RefreshControl} from 'react-native';
import Channel from '@components/channel';
import {COLOR} from '@constants';
import {channelStyle} from '@styles';

const ChannelList = props => {
  const {currentChannel, setUnreadChannel} = props;
  return (
    <Box>
      <Text style={channelStyle.title}>{props.title}</Text>
      <FlatList
        maxHeight={Dimensions.get('window').height - 300}
        data={props.channels}
        renderItem={({item}) => (
          <Channel
            isCurrentChannel={currentChannel.url === item.url}
            key={item.url}
            channel={item}
            setUnreadChannel={setUnreadChannel}
            onPress={channel => props.switchChannel(channel)}
          />
        )}
        keyExtractor={item => item.url}
        refreshControl={
          <RefreshControl
            refreshing={props.loading}
            colors={[COLOR.yellow]}
            tintColor={COLOR.orange}
            onRefresh={props.refresh}
          />
        }
        contentContainerStyle={channelStyle.channelListContentContainer}
        ListHeaderComponent={
          props.error && (
            <Box style={channelStyle.errorContainer}>
              <Text style={channelStyle.error}>{props.error}</Text>
            </Box>
          )
        }
        ListEmptyComponent={
          <Box style={channelStyle.emptyContainer}>
            <Text style={channelStyle.empty}>{props.empty}</Text>
          </Box>
        }
        onEndReached={() => props.next()}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};

export default ChannelList;
