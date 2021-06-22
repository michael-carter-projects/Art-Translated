import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Card, Icon, ListItem } from 'react-native-elements'
import AwesomeButton from "react-native-really-awesome-button";


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

function Predictions ({navigation})
{
  const uri = navigation.state.params.image;

  const res1 = getMovementInfo(0);
  const res2 = getMovementInfo(1);
  var top2 = [ res1, res2 ];
  if (res1.prob < res2.prob) {
    top2 = [ res2, res1 ];
  }

  return (
    <ScrollView style={{backgroundColor:'#444444'}}>
      <View style={styles.outer_view}>
        <View height={25}/>

        <View style={outer_rounded_box('#aaaaaa')}>
            <Image source={{uri: uri}} style={styles.image}/>
        </View>

        <View height={25}/>

        <AwesomeButton
          height={120}
          width={get_width()}
          backgroundColor={'#323264'}
          backgroundDarker={'#161632'}
          borderRadius={15}
          textSize={18}
          fontFamily={'System'}
          onPress={ () => navigation.navigate('Movement', {infoMap: top2[0].map, color1: '#323264', color2: '#161632'})}
        >
        <View style={styles.resultbutton1}>
          <Text style={styles.button}>Best Prediction: { top2[0].map.name }</Text>
          <Text style={styles.buttonasd}>Probability: { top2[0].prob }%</Text>
          <Text style={styles.button}>SEE DETAILS <Icon name="arrow-forward" color="#ffffff"></Icon> </Text>
        </View>

      </AwesomeButton>

        <View height={25}/>

        <AwesomeButton
          height={120}
          width={get_width()}
          backgroundColor={'#525284'}
          backgroundDarker={'#363652'}
          borderRadius={15}
          textSize={18}
          fontFamily={'System'}
          onPress={ () => navigation.navigate('Movement', {infoMap: top2[1].map, color1: '#525284', color2: '#363652'})}
        >
          <View style={styles.resultbutton2}>
            <Text style={styles.button}>2nd Best: { top2[1].map.name }</Text>
            <Text style={styles.buttonasd}>Probability: { top2[1].prob }%</Text>
            <Text style={styles.button}>SEE DETAILS <Icon name="arrow-forward" color="#ffffff"></Icon> </Text>
          </View>
        </AwesomeButton>

      </View>
      <StatusBar style="light" />
    </ScrollView>
  );
}

Predictions.navigationOptions = navigation => ({
  title: "Predictions",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});

const win = Dimensions.get('window');
const image_side = win.width*0.8;

const styles = StyleSheet.create({
  outer_view: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444444',
    flex: 1,
    paddingLeft:   15,
    paddingRight:  15,
    paddingTop:    15,
    paddingBottom: 15,
  },
  image: {
      alignSelf: 'stretch',
      width: image_side,
      height: image_side,
      borderTopLeftRadius:     15,
      borderTopRightRadius:    15,
      borderBottomLeftRadius:  15,
      borderBottomRightRadius: 15
  },
  resultbutton1: {
    ...padding(10, 10, 0, 30),
    flex: 1,
    backgroundColor: '#323264',
    textAlign: 'left',
    justifyContent: 'center'
  },
  resultbutton2: {
    ...padding(10, 10, 0, 30),
    flex: 1,
    backgroundColor: '#525284',
    textAlign: 'left',
    justifyContent: 'center'
  },
  button: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#fff'
  },
  buttonasd: {
    fontSize: 18,
    paddingBottom: 10,
    fontFamily: 'System',
    color: '#fff'
  },
})

function get_width() {
  return image_side;
}

function padding(a, b, c, d) {
  return {
    paddingTop: a,
    paddingRight: b ? b : a,
    paddingBottom: c ? c : a,
    paddingLeft: d ? d : (b ? b : a)
  }
}

function inner_rounded_box (color) {
  return {
    backgroundColor: color,
    paddingLeft:  15,
    paddingRight: 15,
    borderTopLeftRadius:     15,
    borderTopRightRadius:    15,
    borderBottomLeftRadius:  15,
    borderBottomRightRadius: 15
   }
}
function outer_rounded_box (color) {
  return {
    backgroundColor: color,
    paddingTop:    10,
    paddingBottom: 10,
    paddingLeft:   10,
    paddingRight:  10,
    borderTopLeftRadius:     25,
    borderTopRightRadius:    25,
    borderBottomLeftRadius:  25,
    borderBottomRightRadius: 25
  }
}

export default Predictions;
