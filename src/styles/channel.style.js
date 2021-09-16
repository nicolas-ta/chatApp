import {StyleSheet} from 'react-native';
import {COLOR} from '../misc/constants';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  // Channel
  channelContainer: {
    height: 75,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: COLOR.darkerBlue,
    paddingHorizontal: 20,
    paddingVertical: 13,
    margin: 2,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    marginRight: 15,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    alignSelf: 'center',
    paddingBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '100',
    color: '#fff',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  propertyContainer: {
    alignItems: 'center',
  },
  unreadMessageCountContainer: {
    minWidth: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: COLOR.orange,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  unreadMessageCount: {
    fontSize: 12,
    color: '#fff',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 4,
  },

  // Channel List
  title: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center',
    margin: 10,
  },
  channelListContentContainer: {flexGrow: 1},
  errorContainer: {
    backgroundColor: COLOR.red,
    color: 'white',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  loading: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
  newButton: {
    margin: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});
