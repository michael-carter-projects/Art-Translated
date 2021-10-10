import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';

import   React, { useState, useEffect, useCallback, useRef }             from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                     from 'react-native-progress';

import { run_predict_tree, load_model_tree } from '../assets/model_tree/ModelTree.js';

import { TitleBar }   from '../helpers/title_bar.js'

import    { hs } from '../styles/home_styles.js';
import * as sc   from '../styles/style_constants.js';

function Crop ({navigation}) {

  const [topLeftX, setTopLeftX] = useState(0);
  const [topLeftY, setTopLeftY] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [zoomScale, setZoomScale] = useState(0);
  const [croppedImageURI, setCroppedImageURI] = useState(null);
  const [ratio, setRatio] = useState(1);

  const selected_image_uri = navigation.state.params.selected_image_uri;
  const [actual_image_width, setActualImageWidth] = useState(navigation.state.params.width);
  const [actual_image_height, setActualImageHeight] = useState(navigation.state.params.height);

  var pixelRatio = 1;



  // COMPONENT FOR SHOWING PICTURE FRAME AND PROGRESS BAR ======================================================================
  function PictureFrame() {
    return (
      <View style={hs.transparent_frame} pointerEvents={'none'}>
        <View style={hs.photo_outline}/>
      </View>
    );
  }

  async function get_cropped_image_uri(event) {

    setImgWidth(event.nativeEvent.contentSize.width);
    setImgHeight(event.nativeEvent.contentSize.height);
    setZoomScale(event.nativeEvent.zoomScale);


    const frameTopLeftX = (sc.screen_width - sc.image_frame_side_length)/2;
    const newX = event.nativeEvent.contentOffset.x + frameTopLeftX;
    setTopLeftX(event.nativeEvent.contentOffset.x);

    const frameTopLeftY = (sc.image_frame_side_length + sc.image_frame_top_offset);
    const newY = event.nativeEvent.contentOffset.y + frameTopLeftY;
    setTopLeftY(event.nativeEvent.contentOffset.y);

    const newWidth = (sc.image_frame_side_length / zoomScale)*ratio;

    console.log(newWidth);

    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX:newX, originY:newY, width:30, height:30}},
       {resize: {width:224}}],
      {base64: true}
    );
    setCroppedImageURI(uri);
  }

  const handleScroll = (event) => {
    get_cropped_image_uri(event);
  };

  function get_initial_zoom_scale() {

   const image_aspect_ratio = actual_image_width / actual_image_height;
   const view_aspect_ratio = sc.screen_width / sc.no_nav_view_height;

   if (image_aspect_ratio > view_aspect_ratio) {
     var pixel_ratio = actual_image_width / sc.screen_width;
     pixelRatio = pixel_ratio;
     var scaled_height = actual_image_height / pixel_ratio;
     var initialZoomScale = sc.no_nav_view_height / scaled_height;
     return initialZoomScale;
   }
   else if (image_aspect_ratio < view_aspect_ratio) {
     var pixel_ratio = actual_image_height / sc.no_nav_view_height;
     pixelRatio = pixel_ratio;
     var scaled_width = actual_image_width / pixel_ratio;
     var initialZoomScale = sc.screen_width / scaled_width;
     return initialZoomScale;
   }
   else {
     pixelRatio = actual_image_width / sc.screen_width;
     return 1;
   }
  }

   /*

   */

  return (
    <View>
      <ScrollView onScroll={handleScroll}
        scrollEventThrottle={64}
        horizontal={true}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={8}
        zoomScale={get_initial_zoom_scale()}
        decelerationRate={0.99}
        style={{position:'absolute', top:sc.status_bar_height+sc.title_bar_height, backgroundColor:sc.black}}
      >
        <Image source={{uri:selected_image_uri}} style={{width:sc.screen_width, height:sc.no_nav_view_height, resizeMode:'contain', marginTop:-100}}/>
        <View height={sc.image_frame_side_length - sc.image_frame_top_offset}/>
      </ScrollView>

      <PictureFrame/>

      <Image source={{uri:croppedImageURI}} style={{position:'absolute', resizeMode:'contain', bottom: 300, alignSelf:'center', width:sc.title_bar_height*3, height:sc.title_bar_height*3, backgroundColor:sc.white, alignItems:'center', justifyContent:'center', borderColor:sc.white, borderWidth:3, borderRadius:5}}/>
      <View style={{position:'absolute', bottom: 220, alignSelf:'center', width:sc.screen_width*0.9, height:sc.title_bar_height*1.5, backgroundColor:sc.white, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, color:sc.teal}}>{"x: "+parseInt(topLeftX)+" y: "+parseInt(topLeftY)}</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, color:sc.teal}}>{"w: "+parseInt(imgWidth)+" h: "+parseInt(imgHeight)}</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, color:sc.teal}}>{"zoom: "+zoomScale}</Text>
      </View>

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

    </View>
  );
}

Crop.navigationOptions = navigation => ({ headerShown: false });

export default Crop;
