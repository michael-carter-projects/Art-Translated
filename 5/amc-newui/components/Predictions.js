import { StatusBar } from 'expo-status-bar';
import { Ionicons }  from '@expo/vector-icons';
import { Entypo }    from '@expo/vector-icons';

import React from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';


// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;

const screen_dimensions = Dimensions.get('window');
const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812

const card_width = screen_dimensions.width*0.95;

const more_results_height = 120;

const title_bar_height = screen_height*0.11;

const styles = StyleSheet.create({
  // PREDICTION PAGE TITLE BAR STYLE -------------------------------------------
  prediction_title_bar: {
    height: title_bar_height,
    width: screen_width,
    backgroundColor: white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close_icon: {
    position: 'absolute',
    left: title_bar_height*0.3,
    bottom: title_bar_height*-0.55,
    fontSize: 55,
    color: teal
  },
  art_translate_logo: {
    alignSelf:'center',
    top: 25,
    resizeMode: 'contain',
    width:title_bar_height/1.6
  },
  camera_icon: {
    position: 'absolute',
    right: title_bar_height*0.3,
    bottom: title_bar_height*-0.48,
    fontSize:42,
    color: teal
  },
  // SCROLL VIEW STYLE ---------------------------------------------------------
  scroll_view: {
    paddingTop: 20,
    width: screen_width,
    flex: 1,
  },
  // FIRST RESULT STYLES -------------------------------------------------------
  first_result_card: {
    alignSelf: 'center',
    width: card_width,
    height: card_width*1.15,
    backgroundColor: white,
    shadowOffset: {
      width: -7,
      height: 7
    },
    shadowOpacity: 0.35,
    shadowRadius: 13
  },
  first_result_image: {
    alignSelf: 'stretch',
    width: card_width,
    height: card_width/2,
  },
  first_result_name_view: {
    width: card_width*0.6
  },
  first_result_name_text: {
    left: card_width/30,
    top: card_width/25,
    fontSize: 30,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_period_text: {
    left: card_width/30,
    top: card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_description_view: {
    paddingLeft: card_width/30,
    width: card_width*0.9,
    height:card_width*0.26,
  },
  first_result_description_text: {
    paddingTop: 12,
    top: card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_probability_text: {
    position: 'absolute',
    right: card_width*0.04,
    top: card_width*0.57,
    fontSize: 16,
    fontFamily: 'ArgentumSansRegular',
    color: teal,
  },
  first_result_learn_more: {
    position: 'absolute',
    right: card_width*0.07,
    bottom: card_width/28,
    fontSize: 16,
    fontFamily: 'ArgentumSansRegular',
    color: teal,
  },
  first_result_learn_more_arrow: {
    position: 'absolute',
    right: card_width*0.025,
    bottom: card_width/37,
  },
  // THIS COULD ALSO BE STYLES -------------------------------------------------
  this_could_also_be_view: {
    alignSelf: 'center',
    width: card_width
  },
  this_could_also_be_text: {
    paddingTop: 25,
    paddingBottom: 10,
    fontSize:28,
    color:black,
    fontFamily:'ArgentumSansLight'
  },
  // MORE RESULTS STYLES -------------------------------------------------------
  more_results_card: {
    alignSelf: 'center',
    width: card_width,
    height: more_results_height,
    fontSize: 18,
    backgroundColor: white,
    flexDirection: 'row',
    shadowOffset: {
      width: -7,
      height: 7
    },
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  more_results_name_text: {
    left: card_width*0.04,
    top: card_width*0.02,
    fontSize: 20,
    fontFamily: 'ArgentumSansLight',
  },
  more_results_description_view: {
    position: 'absolute',
    top: more_results_height*0.32,
    left: more_results_height+card_width*0.04,
    width: card_width-more_results_height-30,
    height: more_results_height*0.5,
  },
  more_results_description_text: {
    fontSize: 14,
    fontFamily: 'ArgentumSansLight',
  },
  more_results_probability_text: {
    position: 'absolute',
    left: card_width*0.04 + more_results_height,
    bottom: card_width*0.02,
    fontSize: 14,
    fontFamily: 'ArgentumSansRegular',
    color: teal,
  },
  small_learn_more: {
    position: 'absolute',
    right: card_width*0.065,
    bottom: card_width*0.02,
    fontSize: 14,
    fontFamily: 'ArgentumSansRegular',
    color: teal,
  },
  small_learn_more_arrow: {
    position: 'absolute',
    right: card_width*0.025,
    bottom: card_width*0.014,
  },
})

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation})
{
  const selected_image_uri = navigation.state.params.selected_image_uri;
  const predictions = navigation.state.params.predictions;

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: white}}>

      <View style={styles.prediction_title_bar}>
        <View>
          <TouchableOpacity style={{alignItems:'center'}}>
            <Ionicons name="ios-close" style={styles.close_icon}/>
          </TouchableOpacity>
        </View>
        <View>
          <Image source={require('../assets/icons/AT.png')} style={styles.art_translate_logo}/>
        </View>
        <View>
          <TouchableOpacity style={{alignItems:'center'}} onPress={ () => navigation.navigate('Home')}>
            <Ionicons name="ios-camera" style={styles.camera_icon}/>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </View>



      <ScrollView style={styles.scroll_view}>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap:predictions[0].map, color1:grey, color2:grey, uri:selected_image_uri})}>
          <View style={styles.first_result_card}>
            <Image source={{uri: selected_image_uri}} style={styles.first_result_image}/>
            <View style={styles.first_result_name_view}>
              <Text style={styles.first_result_name_text}>{predictions[0].map.name}</Text>
            </View>
            <Text style={styles.first_result_period_text}>{predictions[0].map.dates}</Text>
            <View style={styles.first_result_description_view}>
              <Text style={styles.first_result_description_text}>{predictions[0].map.style}</Text>
            </View>
            <Text style={styles.first_result_probability_text}>{parseInt(predictions[0].prob).toString()}% Match</Text>
            <Text style={styles.first_result_learn_more}>Learn More </Text>
            <View style={styles.first_result_learn_more_arrow}>
              <Entypo name="chevron-right" size={24} color={teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.this_could_also_be_view}>
          <Text style={styles.this_could_also_be_text}>This could also be:</Text>
        </View>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap:predictions[1].map, color1:grey, color2:grey, uri:selected_image_uri})}>
          <View style={styles.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: more_results_height, height: more_results_height}}/>
            <Text style={styles.more_results_name_text}>{predictions[1].map.name}</Text>
            <View style={styles.more_results_description_view}>
              <Text style={styles.more_results_description_text}>{predictions[1].map.style}</Text>
            </View>
            <Text style={styles.more_results_probability_text}>{parseInt(predictions[1].prob).toString()}% Match</Text>
            <Text style={styles.small_learn_more}>Learn More </Text>
            <View style={styles.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View height={15}/>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap: predictions[2].map, color1: grey, color2: grey, uri:selected_image_uri})}>
          <View style={styles.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: more_results_height, height: more_results_height}}/>
            <Text style={styles.more_results_name_text}>{predictions[2].map.name}</Text>
            <View style={styles.more_results_description_view}>
              <Text style={styles.more_results_description_text}>{predictions[2].map.style}</Text>
            </View>
            <Text style={styles.more_results_probability_text}>{parseInt(predictions[2].prob).toString()}% Match</Text>
            <Text style={styles.small_learn_more}>Learn More </Text>
            <View style={styles.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View height={15}/>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap: predictions[3].map, color1: grey, color2: grey})}>
          <View style={styles.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: more_results_height, height: more_results_height}}/>
            <Text style={styles.more_results_name_text}>{predictions[3].map.name}</Text>
            <View style={styles.more_results_description_view}>
              <Text style={styles.more_results_description_text}>{predictions[3].map.style}</Text>
            </View>
            <Text style={styles.more_results_probability_text}>{parseInt(predictions[3].prob).toString()}% Match</Text>
            <Text style={styles.small_learn_more}>Learn More </Text>
            <View style={styles.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={teal}/>
            </View>
          </View>
        </TouchableOpacity>


        <View height={more_results_height}/>

      </ScrollView>

    </View>
  );
}

Predictions.navigationOptions = navigation => ({ headerShown: false });

export default Predictions;
