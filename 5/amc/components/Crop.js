import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';

import   React, { useState, useEffect, useCallback, useRef }             from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                     from 'react-native-progress';

import { run_predict_tree, load_model_tree } from '../assets/model_tree/ModelTree.js';

import { TitleBar }   from '../helpers/title_bar.js'

import    { hs } from '../styles/home_styles.js';
import * as sc   from '../styles/style_constants.js';

function Crop ({navigation}) {

  const selected_image_uri = navigation.state.params.selected_image_uri;

  console.log(selected_image_uri);

  // COMPONENT FOR SHOWING PICTURE FRAME AND PROGRESS BAR ======================================================================
  function PictureFrame() {
    return (
      <View style={hs.transparent_frame} pointerEvents={'none'}>
        <View style={hs.photo_outline}/>
      </View>
    );
  }

  return (
    <View>
      <ScrollView horizontal={true}
                pinchGestureEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                maximumZoomScale={8}
                decelerationRate={0.99}
                style={{position:'absolute', top:sc.status_bar_height+sc.title_bar_height}}
      >
        <Image source={{uri:selected_image_uri}}  style={{width:sc.screen_width, height:sc.screen_height}}/>
      </ScrollView>

      <PictureFrame/>

      <TitleBar
        bgColor={sc.white}
        buttonColor={sc.teal}
        statusColor={'dark'}
        left={'back'}
        leftPress={() => navigation.navigate('Home')}
        middle={'Crop'}
        right={'camera'}
        rightPress={() => navigation.navigate('Home')}
      />

      <TouchableOpacity>
        <View style={{position:'absolute', bottom: 300, alignSelf:'center', width:sc.screen_width*0.8, height:sc.title_bar_height*1.2, borderRadius:20, backgroundColor:sc.white, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, color:sc.teal}}>Crop and Analyze</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

Crop.navigationOptions = navigation => ({ headerShown: false });

export default Crop;
