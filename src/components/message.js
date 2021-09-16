import React from 'react';
import {withAppContext} from '@src/context';
import {UserMessage, AdminMessage} from '@components';

const Message = props => {
  const {message} = props;
  let component = null;
  if (message.isUserMessage()) {
    component = <UserMessage {...props} />;
  } else if (message.isAdminMessage()) {
    component = <AdminMessage {...props} />;
  }
  return component;
};

export default withAppContext(Message);
