import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { StyleSheet, Text, View, Image, ImageBackground} from 'react-native'
import { Button, Card, Icon, ListItem } from 'react-native-elements'
import AwesomeButton from "react-native-really-awesome-button";

function padding(a, b, c, d) {
  return {
    paddingTop: a,
    paddingRight: b ? b : a,
    paddingBottom: c ? c : a,
    paddingLeft: d ? d : (b ? b : a)
  }
}

function getMovementInfo(index) {

  const key = JSON.stringify(global.prediction[index].label)
  const num = JSON.stringify(global.prediction[index].prob)

  for (var i = 0; i < global.numMovements; i++) {
    if (global.movementMap[i].key === key.replace(/['"]+/g, '')) {
      return {
        map:  global.movementMap[i],
        prob: (parseFloat(num)*100).toFixed(2)
      }
    }
  }
}


function Predictions ({route, navigation})
{
  const photo = navigation.state.params.img;

  var top2 = [ getMovementInfo(0), getMovementInfo(1) ];

  return (
    <View style={styles.container}>

        <AwesomeButton
          disabled
          height={330}
          width={330}
          backgroundDarker={'#222222'}
          borderRadius={15}
          textSize={18}
          fontFamily={'System'}
        >
        <ImageBackground source={{uri: photo && photo.uri}} style = {{flex: 1}}>
          <View style={{height: 330, width: 330, ...padding(0, 15, 0, 15)}}></View>
        </ImageBackground>


      </AwesomeButton>

      <View {...padding(15, 0, 0, 0)}></View>

      <AwesomeButton
        height={120}
        width={330}
        backgroundColor={'#323264'}
        backgroundDarker={'#161632'}
        borderRadius={15}
        textSize={18}
        fontFamily={'System'}
        onPress={ () => navigation.navigate('Movement', {movemeentInfo: top2[0]})}
      >
      <View style={styles.resultbutton1}>
        <Text style={styles.button}>Prediction: { top2[0].map.name }</Text>
        <Text style={styles.buttonasd}>Probability: { top2[0].prob }%</Text>
        <Text style={styles.button}>SEE DETAILS <Icon name="arrow-forward" color="#ffffff"></Icon> </Text>
      </View>

    </AwesomeButton>

      <View {...padding(15, 0, 0, 0)}></View>

      <AwesomeButton
        height={120}
        width={330}
        backgroundColor={'#525284'}
        backgroundDarker={'#363652'}
        borderRadius={15}
        textSize={18}
        fontFamily={'System'}
        onPress={ () => navigation.navigate('Movement', {movemeentInfo: top2[1]})}
      >
        <View style={styles.resultbutton2}>
          <Text style={styles.button}>Prediction: { top2[1].map.name }</Text>
          <Text style={styles.buttonasd}>Probability: { top2[1].prob }%</Text>
          <Text style={styles.button}>SEE DETAILS <Icon name="arrow-forward" color="#ffffff"></Icon> </Text>
        </View>
      </AwesomeButton>

      <StatusBar style="light" />
    </View>
  );
}

Predictions.navigationOptions = navigation => ({
  title: "Predictions",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});

const styles = StyleSheet.create({
  container: {
    ...padding(30, 0, 0, 0),
    flex: 1,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultbutton1: {
    ...padding(15, 0, 0, 30),
    flex: 1,
    backgroundColor: '#323264',
    textAlign: 'left',
    justifyContent: 'center'
  },
  resultbutton2: {
    ...padding(15, 0, 0, 30),
    flex: 1,
    backgroundColor: '#525284',
    textAlign: 'left',
    justifyContent: 'center'
  },
  button: {
    fontSize: 20,
    fontFamily: 'System',
    color: '#fff'
  },
  buttonasd: {
    fontSize: 20,
    paddingBottom: 10,
    fontFamily: 'System',
    color: '#fff'
  },
})


export default Predictions;
