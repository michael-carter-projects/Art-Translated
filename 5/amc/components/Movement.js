import { StatusBar } from 'expo-status-bar'
import { Ionicons }  from '@expo/vector-icons';

import React                                                                       from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card, Icon }                                                              from 'react-native-elements'

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ms } from '../styles/movement_styles.js';
import * as sc   from '../styles/style_constants.js';



function ShowDetails(props) {

  var details = [];

  for (var field in props.mvmt_info) {
    if (field !== 'name' && field != 'key_timespan' && field != 'quick_take' && field != 'image') {
      if (Object.prototype.hasOwnProperty.call(props.mvmt_info, field)) {
        details.push(<Card.Title id={Functions.get_unique_id(field, 1)} style={ms.section_title}>{Functions.capitalize(field)}</Card.Title>);
        details.push(<Text id={Functions.get_unique_id(field, 2)} style={ms.section_content}>{props.mvmt_info[field]}</Text>);
        details.push(<Card.Divider id={Functions.get_unique_id(field, 3)} />);
      }
    }
  }
  return details;
}

function Movement ({navigation})
{
  const mvmt_info = navigation.state.params.mvmt_info;
  const selected_image_uri = mvmt_info.img;

  return (
    <View style={ms.movement_page_container}>

      <TitleBar
        bgColor={sc.white}
        buttonColor={sc.teal}
        statusColor={'dark'}
        left={'back'}
        leftPress={() => navigation.navigate('Predictions')}
        middle={'logo'}
        right={'camera'}
        rightPress={() => navigation.navigate('Home')}
      />

      <ScrollView style={ms.scroll_view}>
          <Image source={selected_image_uri} style={ms.movement_image}/>
          <Text style={ms.movement_name_text}>{mvmt_info.name}</Text>
          <Text style={ms.movement_period_text}>{mvmt_info.key_timespan}</Text>
          <View style={ms.movement_description_view}>
            <Text style={ms.movement_description_text}>{mvmt_info.quick_take}</Text>
          </View>

        <Text style={{height:30}}/>

        <ShowDetails mvmt_info={mvmt_info}/>

        <View style={{height:30}}/>

      </ScrollView>
    </View>
  );
}

Movement.navigationOptions = navigation => ({ headerShown: false });

export default Movement;
