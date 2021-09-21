import { StatusBar } from 'expo-status-bar';
import { Ionicons }  from '@expo/vector-icons';
import { Entypo }    from '@expo/vector-icons';

import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import    { ps } from '../styles/predictions_styles.js';
import * as sc   from '../styles/style_constants.js';

// RENDER PREDICTION PAGE ======================================================================================================
function Predictions ({navigation})
{
  // retreive information passed from previous screen --------------------------
  const selected_image_uri = navigation.state.params.selected_image_uri;
  const predictions = navigation.state.params.predictions;

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: sc.white}}>

      <View style={ps.prediction_title_bar}>
        <View>
          <TouchableOpacity style={{alignItems:'center'}}>
            <Ionicons name="ios-close" style={ps.close_icon}/>
          </TouchableOpacity>
        </View>
        <View>
          <Image source={require('../assets/icons/AT.png')} style={ps.art_translate_logo}/>
        </View>
        <View>
          <TouchableOpacity style={{alignItems:'center'}} onPress={ () => navigation.navigate('Home')}>
            <Ionicons name="ios-camera" style={ps.camera_icon}/>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </View>



      <ScrollView style={ps.scroll_view}>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap:predictions[0].map, color1:sc.grey, color2:sc.grey, uri:selected_image_uri})}>
          <View style={ps.first_result_card}>
            <Image source={{uri: selected_image_uri}} style={ps.first_result_image}/>
            <View style={ps.first_result_name_view}>
              <Text style={ps.first_result_name_text}>{predictions[0].map.name}</Text>
            </View>
            <Text style={ps.first_result_period_text}>{predictions[0].map.dates}</Text>
            <View style={ps.first_result_description_view}>
              <Text style={ps.first_result_description_text}>{predictions[0].map.style}</Text>
            </View>
            <Text style={ps.first_result_probability_text}>{parseInt(predictions[0].prob).toString()}% Match</Text>
            <Text style={ps.first_result_learn_more}>Learn More </Text>
            <View style={ps.first_result_learn_more_arrow}>
              <Entypo name="chevron-right" size={24} color={sc.teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View style={ps.this_could_also_be_view}>
          <Text style={ps.this_could_also_be_text}>This could also be:</Text>
        </View>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap:predictions[1].map, color1:sc.grey, color2:sc.grey, uri:selected_image_uri})}>
          <View style={ps.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: sc.more_results_height, height: sc.more_results_height}}/>
            <Text style={ps.more_results_name_text}>{predictions[1].map.name}</Text>
            <View style={ps.more_results_description_view}>
              <Text style={ps.more_results_description_text}>{predictions[1].map.style}</Text>
            </View>
            <Text style={ps.more_results_probability_text}>{parseInt(predictions[1].prob).toString()}% Match</Text>
            <Text style={ps.small_learn_more}>Learn More </Text>
            <View style={ps.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={sc.teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View height={15}/>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap: predictions[2].map, color1: sc.grey, color2: sc.grey, uri:selected_image_uri})}>
          <View style={ps.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: sc.more_results_height, height: sc.more_results_height}}/>
            <Text style={ps.more_results_name_text}>{predictions[2].map.name}</Text>
            <View style={ps.more_results_description_view}>
              <Text style={ps.more_results_description_text}>{predictions[2].map.style}</Text>
            </View>
            <Text style={ps.more_results_probability_text}>{parseInt(predictions[2].prob).toString()}% Match</Text>
            <Text style={ps.small_learn_more}>Learn More </Text>
            <View style={ps.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={sc.teal}/>
            </View>
          </View>
        </TouchableOpacity>

        <View height={15}/>

        <TouchableOpacity onPress={ () => navigation.navigate('Movement', {infoMap: predictions[3].map, color1: sc.grey, color2: sc.grey, uri:selected_image_uri})}>
          <View style={ps.more_results_card}>
            <Image source={{uri: selected_image_uri}} style={{width: sc.more_results_height, height: sc.more_results_height}}/>
            <Text style={ps.more_results_name_text}>{predictions[3].map.name}</Text>
            <View style={ps.more_results_description_view}>
              <Text style={ps.more_results_description_text}>{predictions[3].map.style}</Text>
            </View>
            <Text style={ps.more_results_probability_text}>{parseInt(predictions[3].prob).toString()}% Match</Text>
            <Text style={ps.small_learn_more}>Learn More </Text>
            <View style={ps.small_learn_more_arrow}>
              <Entypo name="chevron-right" size={20} color={sc.teal}/>
            </View>
          </View>
        </TouchableOpacity>


        <View height={sc.more_results_height}/>

      </ScrollView>

    </View>
  );
}

Predictions.navigationOptions = navigation => ({ headerShown: false });

export default Predictions;
