import { StatusBar } from 'expo-status-bar'
import { Ionicons }  from '@expo/vector-icons';

import React                                                                       from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card, Icon }                                                              from 'react-native-elements'

// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;

const screen_dimensions = Dimensions.get('window');
const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812

const card_width = screen_dimensions.width;

const more_results_height = 100;

const title_bar_height = screen_height*0.11;
const text_color = '#ffffff'

const styles = StyleSheet.create({
  // MOVEMENT PAGE TITLE BAR STYLE ---------------------------------------------
  movement_title_bar: {
    height: title_bar_height,
    width: screen_width,
    backgroundColor: white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back_icon: {
    position: 'absolute',
    left: title_bar_height*0.3,
    bottom: title_bar_height*-0.45,
    fontSize: 37,
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
  // SROLL VIEW STYLE ----------------------------------------------------------
  scroll_view: {
    paddingTop: 20,
    width: screen_width,
    flex: 1,
  },
  // MORE RESULTS STYLES -------------------------------------------------------
  movement_card: {
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
  // MORE RESULTS STYLES -------------------------------------------------------
  movement_card: {
    alignSelf: 'center',
    width: card_width,
    height: card_width,
    fontSize: 18,
    backgroundColor: white,
    flexDirection: 'row',
  },
  movement_image: {
    alignSelf: 'stretch',
    width: card_width,
    height: card_width/2,
  },
  movement_name_view: {
    width: card_width*0.6
  },
  movement_name_text: {
    left: card_width*0.05,
    top: card_width/25,
    fontSize: 30,
    fontFamily: 'ArgentumSansLight',
    color: black
  },
  movement_period_text: {
    left: card_width*0.05,
    top: card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
    color: black
  },
  movement_description_view: {
    left: card_width*0.05,
    width: card_width*0.9,
    height:card_width*0.26,
  },
  movement_description_text: {
    paddingTop: 12,
    top: card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  section_title: {
    left: card_width*0.05,
    fontFamily: 'ArgentumSansLight',
    fontSize: 24,
    textAlign: 'left',
    color: black
  },
  section_content: {
    left: card_width*0.05,
    fontFamily: 'ArgentumSansLight',
    color: black,
    fontSize: 18,
    paddingBottom: 15,
    textAlign: 'left',
  },
})

function Movement ({navigation})
{
  const infoMap = navigation.state.params.infoMap;
  const color1  = navigation.state.params.color1;
  const color2  = navigation.state.params.color2;
  const selected_image_uri = navigation.state.params.uri;

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: white}}>

      <View style={styles.movement_title_bar}>
        <View>
          <TouchableOpacity style={{alignItems:'center'}} onPress={ () => navigation.navigate('Predictions')}>
            <Ionicons name="ios-arrow-back" style={styles.back_icon}/>
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
          <Image source={{uri: selected_image_uri}} style={styles.movement_image}/>
          <Text style={styles.movement_name_text}>{infoMap.name}</Text>
          <Text style={styles.movement_period_text}>{infoMap.dates}</Text>
          <View style={styles.movement_description_view}>
            <Text style={styles.movement_description_text}>{infoMap.style}</Text>
          </View>

        <Text style={{height:30}}/>

        <Card.Title style={styles.section_title}>Commentary</Card.Title>
        <Text style={styles.section_content}>{infoMap.commentary}</Text>
        <Card.Divider/>

        <Card.Title style={styles.section_title}>Themes</Card.Title>
        <Text style={styles.section_content}>{infoMap.themes}</Text>
        <Card.Divider/>

        <Card.Title style={styles.section_title}>Origin</Card.Title>
        <Text style={styles.section_content}>{infoMap.start_reason}</Text>
        <Card.Divider/>

        <Card.Title style={styles.section_title}>Fate</Card.Title>
        <Text style={styles.section_content}>{infoMap.end_reason}</Text>

        <View style={{padding:30}}/>

      </ScrollView>
    </View>
  );
}

Movement.navigationOptions = navigation => ({ headerShown: false });

export default Movement;
