import {StyleSheet, Dimensions} from 'react-native';
import {COLOR} from '../misc/constants';

export default StyleSheet.create({
  background: {
    backgroundColor: COLOR.darkerBlue,
    width: '100%',
    height: '100%',
    elevation: 2,
    position: 'absolute',
  },
  leftBox: {
    marginRight: Dimensions.get('window').width - 295,
    width: 295,
    marginTop: 5,
    height: Dimensions.get('window').height - 10,
    position: 'absolute',
    backgroundColor: COLOR.darkBlue,
    borderRadius: 10,
  },
  rightBox: {
    marginLeft: Dimensions.get('window').width - 295,
    width: 295,
    marginTop: 5,
    height: Dimensions.get('window').height - 10,
    position: 'absolute',
    backgroundColor: COLOR.darkBlue,
    borderRadius: 10,
  },

  // Current Chat
  header: {
    borderRadius: 10,
    height: 70,
    width: '100%',
    backgroundColor: COLOR.darkerBlue,
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  badge: {
    width: 10,
    height: 10,
    backgroundColor: COLOR.blue,
    borderRadius: 5,
    position: 'absolute',
  },
  headerButton: {
    margin: 10,
  },
  headerName: {
    color: 'white',
    marginTop: 10,
    maxWidth: Dimensions.get('window').width - 150,
    fontSize: 20,
    fontWeight: '100',
  },
  middleBox: {
    display: 'flex',
    elevation: 4,
    borderRadius: 10,
    margin: 5,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 10,
    backgroundColor: COLOR.darkBlue,
  },
  overlay: {
    backgroundColor: 'black',
    opacity: 0.5,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },

  input: {
    paddingVertical: 0,
    textAlignVertical: 'top',
    marginBottom: 10,
    marginLeft: 10,
    color: 'white',
    backgroundColor: COLOR.darkerBlue,
    borderWidth: 0,
    borderColor: COLOR.blue,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: COLOR.red,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  contentContainer: {
    padding: 0,
    flexGrow: 1,
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
});
