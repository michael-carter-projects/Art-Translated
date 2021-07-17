import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'


// GIVEN A PROBABILITY SCORE, RETURNS JSON: { "MOVEMENT MAP", "PROBABILITY" }
function getMovementInfo(pred, prob, mvmtMap) {

  // LOOP THROUGH PREDICTION TO FIND MOVEMENT WITH GIVEN SCORE ---------------------------------
  for (var i = 0; i < pred.length; i++) {
    if (prob === pred[i].prob)
    {
      // ONCE FOUND, SEARCH MOVEMENT MAP FOR INFO OF MOVEMENT ----------------------------------
      const label = JSON.stringify(pred[i].label);
      for (var j = 0; j < mvmtMap.length; j++) {
        if (mvmtMap[j].key === label.replace(/['"]+/g, '')) {
          return { map:  mvmtMap[j],
                   prob: (parseFloat(prob)*100).toFixed(2)
                 }
        }
      }
    }
  }
}
// GIVEN A PREDICTION FROM THE LOADED MODEL, RETURNS ALL MOVEMENT INFO FOR TOP 3
function getTop3Predictions(pred, mvmtMap) {

  var top3Scores = [0, -1, -2];

  for (var i = 0; i < pred.length; i++)
  {
    var currProb = prediction[i].prob;

    if (currProb > top3Scores[0]) {
      top3Scores[2] = top3Scores[1];
      top3Scores[1] = top3Scores[0];
      top3Scores[0] = currProb;
    }
    else if (currProb > top3Scores[1]) {
      top3Scores[2] = top3Scores[1];
      top3Scores[1] = currProb;
    }
    else if (currProb > top3Scores[2]) {
      top3Scores[2] = currProb;
    }
  }

  console.log('top3:', top3Scores);

  const res1 = getMovementInfo(pred, top3Scores[0], mvmtMap);
  const res2 = getMovementInfo(pred, top3Scores[1], mvmtMap);
  const res3 = getMovementInfo(pred, top3Scores[2], mvmtMap);

  return [ res1, res2, res3 ];
}

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation})
{
  const uri = navigation.state.params.image;
  const top3 = getTop3Predictions(global.prediction, global.movementMap);

  return (
    <ImageBackground source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>

      <View height={25}/>

      <View style={styles.outer_view}>

        <Image source={{uri: uri}} style={styles.image}/>

        <View height={50}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap:top3[0].map, color1:colors.dark1, color2:colors.dark2})}
        >
        <View style={styles.resultbutton1}>

            <View style={styles.result_text}>
              <Text style={styles.button}>{ top3[0].map.name }</Text>
              <Text style={styles.button}>Probability: { top3[0].prob }%</Text>
            </View>
            <View>
              <Icon name="arrow-forward" color="#ffffff" size={40} style={{paddingRight:15, paddingTop:3}}></Icon>
            </View>

        </View>
        </TouchableOpacity>

        <View height={25}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap: top3[1].map, color1: colors.med1, color2: colors.med2})}
        >
          <View style={styles.resultbutton2}>
            <View style={styles.result_text}>
              <Text style={styles.button}>{ top3[1].map.name }</Text>
              <Text style={styles.button}>Probability: { top3[1].prob }%</Text>
            </View>
            <View>
              <Icon name="arrow-forward" color="#ffffff" size={40} style={{paddingRight:15, paddingTop:3}}></Icon>
            </View>
          </View>
        </TouchableOpacity>

        <View height={25}/>

        <TouchableOpacity
          onPress={ () => navigation.navigate('Movement', {infoMap: top3[2].map, color1: colors.lite1, color2: colors.lite2})}
        >
          <View style={styles.resultbutton3}>
            <View style={styles.result_text}>
              <Text style={styles.button}>{ top3[2].map.name }</Text>
              <Text style={styles.button}>Probability: { top3[2].prob }%</Text>
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
