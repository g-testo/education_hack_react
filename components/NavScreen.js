import React from 'react';
import { Platform, Button, ScrollView, StyleSheet, Text, TouchableOpacity, } from "react-native";
import { DrawerNavigator, TabNavigator, } from 'react-navigation';

export class NavScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    const banner = this.props.banner;
    return (
      <ScrollView style={styles.container}>
        <Button
          onPress={() => navigate('DrawerOpen')}
          title="Menu"
        />
        <Text>{banner}</Text>
      </ScrollView>
    )
  }
};
const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
