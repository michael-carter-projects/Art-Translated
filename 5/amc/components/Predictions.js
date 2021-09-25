import { Entypo }    from '@expo/vector-icons';

import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ps } from '../styles/predictions_styles.js';
import * as sc   from '../styles/style_constants.js';

// SHOW ALL RESULTS OF PREDICTION ==============================================================================================
function ShowResults(props) {

  var more_results = [
    <TouchableOpacity key={Functions.get_unique_id(props.preds[0].map.key, 1)} onPress={ () => props.nav.navigate('Movement', {infoMap:props.preds[0].map, color1:sc.grey, color2:sc.grey, uri:props.uri})}>
      <View style={ps.first_result_card}>
        <Image source={props.preds[0].map.img} style={ps.first_result_image}/>
        <View style={ps.first_result_name_view}>
          <Text style={ps.first_result_name_text}>{props.preds[0].map.name}</Text>
        </View>
        <Text style={ps.first_result_period_text}>{props.preds[0].map.dates}</Text>
        <View style={ps.first_result_description_view}>
          <Text style={ps.first_result_description_text}>{props.preds[0].map.style}</Text>
        </View>
        <Text style={ps.first_result_probability_text}>{props.preds[0].prob.toString()}% Match</Text>
        <Text style={ps.first_result_learn_more}>Learn More </Text>
        <View style={ps.first_result_learn_more_arrow}>
          <Entypo name="chevron-right" size={24} color={sc.teal}/>
        </View>
      </View>
    </TouchableOpacity>
  ];
  more_results.push(
    <View key={888888} style={ps.this_could_also_be_view}>
      <Text style={ps.this_could_also_be_text}>This could also be:</Text>
    </View>
  )
  for (let i=1; i<props.preds.length; i++) {
    more_results.push(
      <TouchableOpacity key={Functions.get_unique_id(props.preds[i].map.key, 1)} onPress={() => props.nav.navigate('Movement', {infoMap:props.preds[i].map, color1:sc.grey, color2:sc.grey, uri:props.uri})}>
        <View style={ps.more_results_card}>
          <Image source={props.preds[i].map.img} style={{width: sc.more_results_height, height: sc.more_results_height}}/>
          <Text style={ps.more_results_name_text}>{props.preds[i].map.name}</Text>
          <View style={ps.more_results_description_view}>
            <Text style={ps.more_results_description_text}>{props.preds[i].map.style}</Text>
          </View>
          <Text style={ps.more_results_probability_text}>{props.preds[i].prob.toString()}% Match</Text>
          <Text style={ps.small_learn_more}>Learn More </Text>
          <View style={ps.small_learn_more_arrow}>
            <Entypo name="chevron-right" size={20} color={sc.teal}/>
          </View>
        </View>
      </TouchableOpacity>
    );
    more_results.push(
      <View key={Functions.get_unique_id(props.preds[i].map.key, 12)} height={15}/>
    );
  }
  more_results.push(
    <View key={Functions.get_unique_id(props.preds[0].map.key, 12)} height={sc.more_results_height}/>
  );
  return more_results;
}

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation}) {

  // retreive information passed from previous screen --------------------------
  const selected_image_uri = navigation.state.params.selected_image_uri;
  const predictions = navigation.state.params.predictions;

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: sc.white}}>

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

      <ScrollView style={ps.scroll_view}>
        <ShowResults preds={predictions} nav={navigation} uri={selected_image_uri}/>
      </ScrollView>
    </View>
  );
}

Predictions.navigationOptions = navigation => ({ headerShown: false });

export default Predictions;
