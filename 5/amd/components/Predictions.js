import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'
import { Button, Card, Icon, ListItem } from 'react-native-elements'
import AwesomeButton from "react-native-really-awesome-button";


function getMovementInfo(index) {

  const key = JSON.stringify(global.prediction[index].label)
  const num = JSON.stringify(global.prediction[index].prob)

  for (var i = 0; i < global.numMovements; i++) {
    if (global.movementMap[i].key === key.replace(/['"]+/g, '')) {
      return global.movementMap[i];
    }
  }
}


function Predictions ({navigation})
{

  var top3 = [ getMovementInfo(0), getMovementInfo(1) ]; // etcetera

  console.log(top3)

  return (
    <View style={styles.container}>

      <Text style={{fontSize: 20}}>{" "}</Text>

      <AwesomeButton
          height={300}
          width={350}
          backgroundColor={'#323264'}
          backgroundDarker={'#161632'}
          borderRadius={20}
          textSize={18}
          fontFamily={'System'}
        >

        <View style={styles.resultbutton1}>
          <Text style={styles.button}> Movement: { top3[0].name }</Text>
          <Text style={styles.button}> Probability: { top3[0].prob }%</Text>
          <Text style={styles.button}> SEE DETAILS</Text>
        </View>
      </AwesomeButton>

      <Text style={{fontSize: 20}}>{" "}</Text>

      <AwesomeButton
          height={300}
          width={350}
          backgroundColor={'#525284'}
          backgroundDarker={'#363652'}
          borderRadius={20}
          textSize={18}
          fontFamily={'System'}
        >

        <View style={styles.resultbutton2}>
          <Text style={styles.button}> Movement: { top3[1].name }</Text>
          <Text style={styles.button}> Probability: { top3[1].prob }%</Text>
          <Text style={styles.button}> SEE DETAILS</Text>
        </View>
      </AwesomeButton>


      <StatusBar style="light" />
    </View>
  );
}

Predictions.navigationOptions = navigation => ({
  title: "Predictions",
  headerStyle: {
    backgroundColor: '#333333', //'#444444',
  },
  headerTintColor: '#fff',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultbutton1: {
    flex: 1,
    backgroundColor: '#323264',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultbutton2: {
    flex: 1,
    backgroundColor: '#525284',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    fontSize: 20,
    alignItems: 'baseline',
    fontFamily: 'System',
    color: '#fff'
  },
})


export default Predictions;
