import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation})
{
  const selected_image_uri = navigation.state.params.selected_image_uri;
  //const predictions = global.predictions_info;
  const predictions = navigation.state.params.predictions;

  return (
    <ImageBackground source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>

      <View height={25}/>

      <View style={styles.outer_view}>

        <Image source={{uri: selected_image_uri}} style={styles.image}/>

        <View height={50}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap:predictions[0].map, color1:colors.dark1, color2:colors.dark2})}
        >
        <View style={styles.resultbutton1}>

            <View style={styles.result_text}>
              <Text style={styles.button}>{ predictions[0].map.name }</Text>
              <Text style={styles.button}>Probability: { predictions[0].prob }%</Text>
            </View>
            <View>
              <Icon name="arrow-forward" color="#ffffff" size={40} style={{paddingRight:15, paddingTop:3}}></Icon>
            </View>

        </View>
        </TouchableOpacity>

        <View height={25}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap: predictions[1].map, color1: colors.med1, color2: colors.med2})}
        >
          <View style={styles.resultbutton2}>
            <View style={styles.result_text}>
              <Text style={styles.button}>{ predictions[1].map.name }</Text>
              <Text style={styles.button}>Probability: { predictions[1].prob }%</Text>
            </View>
            <View>
              <Icon name="arrow-forward" color="#ffffff" size={40} style={{paddingRight:15, paddingTop:3}}></Icon>
            </View>
          </View>
        </TouchableOpacity>

        <View height={25}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap: predictions[2].map, color1: colors.lite1, color2: colors.lite2})}
        >
          <View style={styles.resultbutton3}>
            <View style={styles.result_text}>
              <Text style={styles.button}>{ predictions[2].map.name }</Text>
              <Text style={styles.button}>Probability: { predictions[2].prob }%</Text>
            </View>
            <View>
              <Icon name="arrow-forward" color="#ffffff" size={40} style={{paddingRight:15, paddingTop:3}}></Icon>
            </View>
          </View>
        </TouchableOpacity>

      </View>
      <StatusBar style="light" />
    </ImageBackground>
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

const colors = ({
  dark1: '#202042',
  dark2: '#080816',
  med1:  '#323264',
  med2:  '#161632',
  lite1: '#484880',
  lite2: '#282852',
});

const buttons = ({
  height: 75,
  width: image_side,
  radius: 15,
  textSize: 18,
  bcolor: 'rgba(255, 255, 255, 0)',
  bwidth: 5
});

const styles = StyleSheet.create({
  outer_view: {
    alignItems: 'center',
    flex: 1,
  },
  image: {
      alignSelf: 'stretch',
      width: image_side,
      height: image_side,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 5,
      borderRadius: 15,
  },
  result_text: {
    textAlign: 'left',
  },
  resultbutton1: {
    width:        buttons.width,
    height:       buttons.height,
    borderRadius: buttons.radius,
    borderWidth:  buttons.bwidth,
    fontSize:     buttons.textSize,
    backgroundColor: colors.dark1,
    borderColor:     colors.dark2,
    paddingLeft: 20,
    paddingBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultbutton2: {
    width:        buttons.width,
    height:       buttons.height,
    borderRadius: buttons.radius,
    borderWidth:  buttons.bwidth,
    fontSize:     buttons.textSize,
    backgroundColor: colors.med1,
    borderColor:     colors.med2,
    paddingLeft: 20,
    paddingBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultbutton3: {
    width:        buttons.width,
    height:       buttons.height,
    borderRadius: buttons.radius,
    borderWidth:  buttons.bwidth,
    fontSize:     buttons.textSize,
    backgroundColor: colors.lite1,
    borderColor:     colors.lite2,
    paddingLeft: 20,
    paddingBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#fff'
  },
})

export default Predictions;
