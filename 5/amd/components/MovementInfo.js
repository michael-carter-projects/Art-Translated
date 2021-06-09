import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

export default class MovementInfo extends React.Component {
  render() {
    const prediction = this.props.navigation.getParam('pred')

    return (
      <View style={styles.container}>
        <Text>MOVEMENT INFO:</Text>
        <Text></Text>
        <Text>
          Movement: {JSON.stringify(global.prediction[0].label)}
        </Text>
        <Text>
          Probability: {JSON.stringify(global.prediction[0].prob)}
        </Text>
        <Text></Text>
        <Text>
          Movement: {JSON.stringify(global.prediction[1].label)}
          </Text>
        <Text>
          Probability: {JSON.stringify(global.prediction[1].prob)}
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
