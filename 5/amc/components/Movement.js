import { StatusBar } from 'expo-status-bar'
import { Ionicons }  from '@expo/vector-icons';

import React                                                                       from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card, Icon }                                                              from 'react-native-elements'

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ms } from '../styles/movement_styles.js';
import * as sc   from '../styles/style_constants.js';

function ExampleImageViews(props) {
  // urilist = props.mvmt_info.images;
  const urilist = ['25fgku3f41', '123d15n23d', '1v254h31562', '12268733v2', '123cv23412', '34b4n26yb', '135dfg6v1', '134vc3r3'];

  var image_views = [];

  for (var uri in urilist) {
    image_views.push(
      <View key={Functions.get_unique_id(uri, 1)} style={{width:sc.card_width/4-26, height:sc.card_width/4-26, marginTop:5, marginLeft:5, backgroundColor:'#bbb'}}/>
    );
  }
  return image_views;
}

function ExampleImages(props) {
  return (
    <View style={{width:sc.screen_width*0.9, height:sc.card_width/4, borderColor:sc.teal, borderWidth:5, alignSelf:'center'}}>
      <View style={{width:sc.screen_width*0.9-10, height:sc.card_width/4 -10, borderColor:sc.orange, borderWidth:3}}>
        <ScrollView horizontal={true}>
          <ExampleImageViews/>
        </ScrollView>
      </View>
    </View>
  )
}

function ShowDetails(props) {

  var details = [];

  for (var field in props.mvmt_info) {
    if (field !== 'name'
     && field !== 'key_timespan'
     && field !== 'quick_take'
     && field !== 'image'
     && field !== 'thumbnail') {
      if (Object.prototype.hasOwnProperty.call(props.mvmt_info, field)) {
        details.push(<Card.Title key={Functions.get_unique_id(field, 1)} style={ms.section_title}>{Functions.capitalize(field)}</Card.Title>);
        details.push(<Text key={Functions.get_unique_id(field, 2)} style={ms.section_content}>{props.mvmt_info[field]}</Text>);
        details.push(<Card.Divider style={{width:sc.screen_width*0.9, alignSelf:'center'}}key={Functions.get_unique_id(field, 3)} />);
      }
    }
  }
  return details;
}

function Movement ({navigation})
{
  const mvmt_info = navigation.state.params.mvmt_info;
  const movement_thumbnail = mvmt_info.thumbnail;

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
        <Image source={movement_thumbnail} style={ms.movement_image}/>
        <Text style={ms.movement_name_text}>{mvmt_info.name}</Text>
        <Text style={ms.movement_period_text}>{mvmt_info.key_timespan}</Text>
        <View style={ms.movement_description_view}>
          <Text style={ms.movement_description_text}>{mvmt_info.quick_take}</Text>
        </View>
        <Text style={{height:30}}/>
        <ExampleImages/>

        <Text style={{height:20}}/>

        <ShowDetails mvmt_info={mvmt_info}/>

        <View style={{height:30}}/>

      </ScrollView>
    </View>
  );
}

Movement.navigationOptions = navigation => ({ headerShown: false });

export default Movement;
