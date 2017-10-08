import React from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerNavigator, TabNavigator, } from 'react-navigation';

import QuizDataComp from './components/QuizDataComp';

const items = ({ navigation }) => (
  <QuizDataComp category={'d'} banner={'Items'} navigation={navigation} />
);

const ImageTabScreen = TabNavigator({
  Items: {
    screen: items
  }
}, {
  tabBarPosition: 'bottom',
  lazyLoad: true,
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});
ImageTabScreen.navigationOptions = {
  title: 'Image Quiz'
};

const Drawer = DrawerNavigator({
  ImageTab: {
    path: '/ImageTabs',
    screen: ImageTabScreen
  }
}, {
  initialRouteName: 'ImageTab',
  contentOptions: {
    activeTintColor: '#e91e63',
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default class App extends React.Component {
  render() {
    return (
      <Drawer />
    );
  }
}
