import { Entypo }    from '@expo/vector-icons';

import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ps } from '../styles/predictions_styles.js';
import * as sc   from '../styles/style_constants.js';


// SHOW ALL RESULTS OF PREDICTION ==============================================================================================
function ShowResults(props) {

  const res1info = props.preds[0].info;
  const res1prob = props.preds[0].prob;

  var results = [
    <TouchableOpacity key={Functions.get_unique_id(res1info.name, 1)} onPress={ () => props.nav.navigate('Movement', {mvmt_info:res1info, uri:props.uri})}>
      <View style={ps.first_result_card}>
        <Image source={res1info.thumbnail} style={ps.first_result_image}/>
        <View style={ps.first_result_name_view}>
          <Text style={ps.first_result_name_text}>{res1info.name}</Text>
        </View>
        <Text style={ps.first_result_period_text}>{res1info.name_timespan}</Text>
        <View style={ps.first_result_description_view}>
          <Text style={ps.first_result_description_text}>{res1info.quick_take}</Text>
        </View>
        <Text style={ps.first_result_probability_text}>{res1prob.toString()}% Match</Text>
        <Text style={ps.first_result_learn_more}>Learn More </Text>
        <View style={ps.first_result_learn_more_arrow}>
          <Entypo name="chevron-right" size={24} color={sc.teal}/>
        </View>
      </View>
    </TouchableOpacity>
  ];
  results.push(
    <View key={888888} style={ps.this_could_also_be_view}>
      <Text style={ps.this_could_also_be_text}>This could also be:</Text>
    </View>
  )
  for (let i=1; i<props.preds.length; i++) {

    var resiinfo = props.preds[i].info;
    var resiprob = props.preds[i].prob;

    results.push(
      <TouchableOpacity key={Functions.get_unique_id(resiinfo.name, i)} onPress={() => props.nav.navigate('Movement', {mvmt_info:props.preds[i].info, uri:props.uri})}>
        <View style={ps.more_results_card}>
          <Image source={resiinfo.thumbnail} style={{width: sc.more_results_height, height: sc.more_results_height}}/>
          <Text style={ps.more_results_name_text}>{resiinfo.name}</Text>
          <View style={ps.more_results_description_view}>
            <Text style={ps.more_results_description_text}>{resiinfo.quick_take}</Text>
          </View>
          <Text style={ps.more_results_probability_text}>{resiprob.toString()}% Match</Text>
          <Text style={ps.small_learn_more}>Learn More </Text>
          <View style={ps.small_learn_more_arrow}>
            <Entypo name="chevron-right" size={20} color={sc.teal}/>
          </View>
        </View>
      </TouchableOpacity>
    );
    results.push(
      <View key={Functions.get_unique_id(resiinfo.name, 2*i)} height={15}/>
    );
  }
  results.push(
    <View key={Functions.get_unique_id(res1info.name, 2)} height={sc.more_results_height}/>
  );
  return results;
}

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation}) {

  // retreive information passed from previous screen --------------------------
  const selected_image_uri = navigation.state.params.selected_image_uri;
  const predictions = navigation.state.params.predictions;

  return (
    <View>
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
      <View style={ps.no_nav_safe_area}>
        <ScrollView style={ps.scroll_view}>
          <ShowResults preds={predictions} nav={navigation} uri={selected_image_uri}/>
        </ScrollView>
      </View>
    </View>
  );
}

Predictions.navigationOptions = navigation => ({ headerShown: false });

export default Predictions;
