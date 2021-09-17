# 10CUT Chat App

## Description
10CUT is a chat app offering to meet people in a public channel and create private channels where you can chat and invite people.

## Features
### Main Features
- Login page: enter a nickname and connect. If the nickname has already been used before, the user will see the previous messages linked to the chosen nickname
- Chat page: chat with other member in a public or private channel on this page.
- Member/participant panel: On the right, a list of online participants (in a public channel) or a list of members (in a private channel) is displayed
- Channel panel: On the left, a list of scrollable (if the count is high enough) channel is displayed

### Minor features
- When a message is pressed, its date from now is displayed
- When one or several channels have unread messages, a small icon is displayed over the channel button
- Create a private channel. If the invited members are exactly the same as an other channel, redirect to the existing channel instead
- In a chat, only 25 messages are fetched. To load more, the user has to reach the top end of the current conversation
- In a private channel, the user is able to invite other uninvited members from the right panel.
- See a preview of the last message on a private channel in the channel's list.
- See if a use is online with a small online indicator on the avatar
- Refresh the channel list
- Refresh the member list

## Prerequisites
- finish the installation steps of the react-native CLI environment (not expo)  (https://reactnative.dev/docs/environment-setup)
- either have an Android device, or have an android emulator from Android Studio
- Android 10+
- have node and npm installed
- (recommanded) install yarn : `npm install --global yarn`

## Quickstart
- At the root of the project: `yarn install` or `npm install`
- `react-native start`
- (if a device is attached) In an other tab of the terminal: `react-native run-android` 
- (if using an emulator) The first time, open the project /android with Android Studio, then run the application. 

