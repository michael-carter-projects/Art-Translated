import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';

import   React, { useState, useEffect, useCallback, useRef }             from 'react';
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                     from 'react-native-progress';

import { run_predict_tree } from '../assets/model_tree/ModelTree.js';

import { TitleBar }   from '../helpers/title_bar.js'

import    { hs } from '../styles/home_styles.js';
import * as sc   from '../styles/style_constants.js';

function Crop ({navigation}) {

  const selected_image_uri = navigation.state.params.selected_image_uri;
  const actual_image_width = navigation.state.params.width;
  const actual_image_height = navigation.state.params.height;
  const image_aspect_ratio = actual_image_width / actual_image_height;
  const view_aspect_ratio = sc.screen_width / sc.no_nav_view_height;
  if (image_aspect_ratio > 1) {
    var minimum_zoom_scale = (sc.image_frame_side_length-4) / sc.no_nav_view_height;
  }
  else { var minimum_zoom_scale = 0.9; }
  const maximum_zoom_scale = 8;

  const [topLeftX, setTopLeftX] = useState(0);
  const [topLeftY, setTopLeftY] = useState(0);
  const [newSize,  setNewSize ] = useState(Math.min(actual_image_width-1, actual_image_height-1));
  const [croppedImageURI, setCroppedImageURI] = useState('../assets/icons/no_image.png');
  const [croppedImageB64, setCroppedImageB64] = useState(1);
  const [aa, setAA] = useState(0.1);
  const [bb, setBB] = useState(0.1);


  // COMPONENT FOR SHOWING PICTURE FRAME AND PROGRESS BAR ======================================================================
  function PictureFrame() {
    return (
      <View style={hs.transparent_frame} pointerEvents={'none'}>
        <View style={hs.photo_outline}/>
      </View>
    );
  }
  // RETRIEVES THE DIMENSIONS OF THE IMAGE INSIDE THE SCROLLVIEW ===============================================================
  function get_image_dimensions() {

    if (image_aspect_ratio > view_aspect_ratio) {
      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      return {
        width: initialZoomScale * sc.screen_width,
        height: sc.no_nav_view_height,
      };
    }
    else if (image_aspect_ratio < view_aspect_ratio) {
      var pixel_ratio = actual_image_height / sc.no_nav_view_height;
      var scaled_width = actual_image_width / pixel_ratio;
      var initialZoomScale = sc.screen_width / scaled_width;
      return {
        width: sc.screen_width,
        height: initialZoomScale * sc.no_nav_view_height,
      };
    }
    else {
     return {
       width: sc.screen_width,
       height: sc.no_nav_view_height,
      }
    }
  }
  // RETREIVE VALUES FOR TOP BOTTOM LEFT RIGHT INSETS (BLACK SPACE AROUND IMAGE) ===============================================
  function get_scrollview_inset() {

    if (image_aspect_ratio > view_aspect_ratio) {
      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      return {
        top: sc.title_bar_to_top_of_frame,
        bottom: (sc.no_nav_view_height - sc.image_frame_side_length) - sc.title_bar_to_top_of_frame+4,
        left: ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05,
        right: ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05,
      };
    }
    else {
      var pixel_ratio = actual_image_height / sc.no_nav_view_height;
      var scaled_width = actual_image_width / pixel_ratio;
      var initialZoomScale = sc.screen_width / scaled_width;
      return {
        top: sc.title_bar_to_top_of_frame,
        bottom: (initialZoomScale * sc.no_nav_view_height) - sc.image_frame_side_length - sc.title_bar_to_top_of_frame+4,
        left: sc.screen_width*0.05 +2,
        right: sc.screen_width*0.05 +2,
      };
    }
  }
  // RETREIVE DIMENSIONS OF THE SCROLLVIEW TO BE USED FOR CROPPING =============================================================
  function get_scrollview_dimensions() {

    if (image_aspect_ratio > view_aspect_ratio) {
      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      return {
        width: initialZoomScale * sc.screen_width,
        height: sc.no_nav_view_height,
      };
    }
    else {
      var pixel_ratio = actual_image_height / sc.no_nav_view_height;
      var scaled_width = actual_image_width / pixel_ratio;
      var initialZoomScale = sc.screen_width / scaled_width;
      return {
        width: sc.screen_width,
        height: initialZoomScale * sc.no_nav_view_height,
      };
    }
  }
  // CROP THE IMAGE ACCORDING (HOPEFULLY) TO FRAME, AND UPDATE HOOK TO URI OF NEW IMAGE FOR DISPLAY (DEBUGGING) ================
  async function get_cropped_image_uri(event) {

    // CALCULATE NEW SIZE TO CROP IMAGE TO ACCORDING TO ZOOM SCALE -------------
    const min_zoom = minimum_zoom_scale;
    const max_zoom = maximum_zoom_scale;
    const cur_zoom = event.nativeEvent.zoomScale;
    var scaling_factor = 0;

    if (cur_zoom < 1) {
      scaling_factor = (min_zoom + (1-cur_zoom));
    }
    else if (cur_zoom > 1) {
      var a = (min_zoom - (1 / max_zoom));     setAA(a);
      var b = (cur_zoom - 1) / (max_zoom - 1); setBB(b);
      scaling_factor = min_zoom - (a * b);
    }
    else {
      scaling_factor = min_zoom;
    }

    if (image_aspect_ratio > view_aspect_ratio) {
      var new_size = actual_image_height * scaling_factor;

      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;

      var xOffset = ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05;
      var yOffset = sc.title_bar_to_top_of_frame;
    }
    else {
      var new_size = actual_image_width * scaling_factor;

      var xOffset = sc.screen_width*0.05+2;
      var yOffset = sc.title_bar_to_top_of_frame;
    }

    // CALCULATE X Y OFFSET FOR CROPPING ---------------------------------------
    if (cur_zoom > 1) {
      var width_in_layout = event.nativeEvent.contentSize.width;
      var x_in_layout = (event.nativeEvent.contentOffset.x + (xOffset));
      var x_in_image = (x_in_layout/width_in_layout) * actual_image_width;

      var height_in_layout = event.nativeEvent.contentSize.height;
      var y_in_layout = (event.nativeEvent.contentOffset.y + (yOffset));
      var y_in_image =  (y_in_layout/height_in_layout) * actual_image_height;
    }
    else {
      var width_in_layout = event.nativeEvent.contentSize.width;
      var x_in_layout = (event.nativeEvent.contentOffset.x + xOffset);
      var x_in_image = (x_in_layout/width_in_layout) * actual_image_width;

      var height_in_layout = event.nativeEvent.contentSize.height;
      var y_in_layout = (event.nativeEvent.contentOffset.y + yOffset);
      var y_in_image =  (y_in_layout/height_in_layout) * actual_image_height;
    }

    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX:x_in_image, originY:y_in_image, width:new_size, height:new_size}},
       {resize: {width:224}}],
      {base64: true}
    );
    setCroppedImageURI(uri);
    setCroppedImageB64(base64);
  }

  /*
  const [imgWidth, setImgWidth]   = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  <View style={{position:'absolute', bottom: 220, alignSelf:'center', width:sc.screen_width*0.9, height:sc.title_bar_height*1.5, backgroundColor:sc.white, alignItems:'center', justifyContent:'center', borderColor:sc.orange, borderWidth:3, borderRadius:5}}>
    <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"x: "+parseInt(topLeftX)+" y: "+parseInt(topLeftY)}</Text>
    <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"w: "+parseInt(imgWidth)+" h: "+parseInt(imgHeight)}</Text>
    <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"a: "+aa+" b: "+bb}</Text>
  </View>
  */

  const handleScroll = (event) => {
    get_cropped_image_uri(event);
  };

  async function make_prediction_async(nav) {
    // MAKE PREDICTION ---------------------------------------------------------
    const predictions = await run_predict_tree(croppedImageB64);
    nav.navigate('Predictions', {selected_image_uri: croppedImageURI,
                                 predictions: predictions
                                }
                );
  }

  return (
    <View>
      <ScrollView onScroll={handleScroll}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        bouncesZoom={false}
        scrollEventThrottle={64}
        horizontal={true}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maximum_zoom_scale}
        minimumZoomScale={minimum_zoom_scale}
        decelerationRate={0.99}
        contentInset={get_scrollview_inset()}
        contentContainerStyle={{flexDirection:'column'}}
        style={[{position:'absolute',
                top:sc.status_bar_height+sc.title_bar_height,
                backgroundColor:sc.black,
                alignSelf:'center'},
                get_scrollview_dimensions()]}
      >
        <Image source={{uri:selected_image_uri}} style={[{resizeMode:'contain'}, get_image_dimensions()]}/>
      </ScrollView>

      <PictureFrame/>

      <Image source={{uri:croppedImageURI}} style={{position:'absolute', resizeMode:'contain', bottom: 340, alignSelf:'center', width:sc.screen_width*0.4, height:sc.screen_width*0.4, backgroundColor:sc.black, alignItems:'center', justifyContent:'center', borderColor:sc.white, borderWidth:2, borderRadius:8}}/>

      <TouchableOpacity onPress={() => make_prediction_async(navigation)}>
        <View style={{position:'absolute', bottom:250, alignSelf:'center', width:sc.screen_width*0.7, height:sc.title_bar_height*1.3, backgroundColor:sc.white, alignItems:'center', justifyContent:'center', borderRadius:20}}>
          <Text style={{fontFamily:'ArgentumSansLight', fontSize:26, color:sc.teal}}>Analyze</Text>
        </View>
      </TouchableOpacity>


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
