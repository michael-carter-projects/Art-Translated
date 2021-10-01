import { StatusBar } from 'expo-status-bar'
import { Ionicons }  from '@expo/vector-icons';

import React                                                                       from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card, Icon }                                                              from 'react-native-elements'

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ms } from '../styles/movement_styles.js';
import * as sc   from '../styles/style_constants.js';


function Movement ({navigation})
{
  const infoMap = navigation.state.params.infoMap;
  const color1  = navigation.state.params.color1;
  const color2  = navigation.state.params.color2;
  const selected_image_uri = infoMap.img;

  return (
    <View style={ms.movement_page_container}>

      <TitleBar
        bgColor={sc.white}
        buttonColor={sc.teal}
        statusColor={'dark'}
        left={'back'}
        leftPress={() => navigation.navigate('Home')}
        middle={'logo'}
        right={'camera'}
        rightPress={() => navigation.navigate('Home')}
      />


      <ScrollView style={ms.scroll_view}>
          <Image source={selected_image_uri} style={ms.movement_image}/>
          <Text style={ms.movement_name_text}>{infoMap.name}</Text>
          <Text style={ms.movement_period_text}>{infoMap.dates}</Text>
          <View style={ms.movement_description_view}>
            <Text style={ms.movement_description_text}>{infoMap.style}</Text>
          </View>

        <Text style={{height:30}}/>

        <Card.Title style={ms.section_title}>Commentary</Card.Title>
        <Text style={ms.section_content}>{infoMap.commentary}</Text>
        <Card.Divider/>

        <Card.Title style={ms.section_title}>Themes</Card.Title>
        <Text style={ms.section_content}>{infoMap.themes}</Text>
        <Card.Divider/>

        <Card.Title style={ms.section_title}>Origin</Card.Title>
        <Text style={ms.section_content}>{infoMap.start_reason}</Text>
        <Card.Divider/>

        <Card.Title style={ms.section_title}>Fate</Card.Title>
        <Text style={ms.section_content}>{infoMap.end_reason}</Text>

        <View style={{height:30}}/>

      </ScrollView>
    </View>
  );
}

Movement.navigationOptions = navigation => ({ headerShown: false });

export default Movement;
