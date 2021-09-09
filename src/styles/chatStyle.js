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
  header: {
    borderRadius: 10,
    height: 70,
    backgroundColor: COLOR.darkerBlue,
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  headerButton: {
    margin: 10,
    // backgroundColor: COLOR.red,
  },
  middleBox: {
    display: 'flex',
    elevation: 4,
    // marginLeft: '-90%',
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
  input: {
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
});
