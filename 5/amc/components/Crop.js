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
  const [newSize, setNewSize] = useState(0);
  const [croppedImageURI, setCroppedImageURI] = useState(null);
  const [ratio, setRatio] = useState(1);

  const selected_image_uri = navigation.state.params.selected_image_uri;
  const [actual_image_width,  setActualImageWidth ] = useState(navigation.state.params.width);
  const [actual_image_height, setActualImageHeight] = useState(navigation.state.params.height);

  const [aa, setAA] = useState(34);
  const [bb, setBB] = useState(56);

  const image_aspect_ratio = actual_image_width / actual_image_height;
  const view_aspect_ratio = sc.screen_width / sc.no_nav_view_height;

  const maximum_zoom_scale = 8;

  var xOffset = 0;
  var yOffset = 0;

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
  // RETREIVES THE AMOUNT A USER WILL BE ABLE TO ZOOM OUT ON AN IMAGE ==========================================================
  function get_minimum_zoom_scale() {
    if (image_aspect_ratio > 1) {
      return (sc.image_frame_side_length-4) / sc.no_nav_view_height;
    }
    else {
      return 0.9;
    }
  }
  // RETREIVE VALUES FOR TOP BOTTOM LEFT RIGHT INSETS (BLACK SPACE AROUND IMAGE) ===============================================
  function get_scrollview_inset() {

    if (image_aspect_ratio > view_aspect_ratio) {
      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;

      xOffset = ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05;
      yOffset = sc.title_bar_to_top_of_frame;

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

      xOffset = sc.screen_width*0.05+2;
      yOffset = sc.title_bar_to_top_of_frame;

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

    console.log(actual_image_width)

    const min_zoom = get_minimum_zoom_scale();
    const max_zoom = maximum_zoom_scale;
    const cur_zoom = event.nativeEvent.zoomScale;


    //console.log("=====================================")
    console.log("min_zoom: ", min_zoom);
    //console.log("max_zoom: ", max_zoom);
    //console.log("cur_zoom: ", cur_zoom);

    console.log("image_frame_side_length: ", sc.image_frame_side_length);
    console.log("no_nav_view_height: ", sc.no_nav_view_height);
    console.log("image / height: ", sc.image_frame_side_length / sc.no_nav_view_height);

    var scaling_factor = 0; //(1 - ((cur_zoom-min_zoom)/(max_zoom-min_zoom)));

    if (cur_zoom < 1) {
      scaling_factor = (min_zoom + (1-cur_zoom));
    }
    else if (cur_zoom > 1) {
      var a = (min_zoom - (1 / max_zoom));
      setAA(a);
      var b = (cur_zoom - 1) / (max_zoom - 1);
      setBB(b);
      scaling_factor = min_zoom - (a * b);
    }
    else {
      scaling_factor = min_zoom;
    }

    console.log("scaling_factor: ", scaling_factor);

    var new_size = 0;
    if (image_aspect_ratio > view_aspect_ratio) {
      //const min_height = (actual_image_height/maximum_zoom_scale);
      //const height_def = actual_image_height - min_height;
      //console.log("min_height: ", min_height);
      //console.log("height_def: ", height_def);
      //new_size = min_height + (height_def * scaling_factor);
      new_size = actual_image_height * scaling_factor;
    }
    else {
      //const min_width = (actual_image_width /maximum_zoom_scale);
      //const width_def = actual_image_width - min_width;
      //console.log("min_width: ", min_width);
      //console.log("width_def: ", width_def);
      //new_size = min_width + (width_def * scaling_factor);
      new_size = actual_image_width * scaling_factor;
    }
    console.log("new_size: ", new_size)

    setNewSize(parseInt(new_size));

    console.log(event.nativeEvent);

    setImgWidth(event.nativeEvent.contentSize.width);
    setImgHeight(event.nativeEvent.contentSize.height);
    setTopLeftX((event.nativeEvent.contentOffset.x + xOffset)/cur_zoom);
    setTopLeftY((event.nativeEvent.contentOffset.y + yOffset)/cur_zoom);


    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX:topLeftX, originY:topLeftY, width:new_size, height:new_size}},
       {resize: {width:224}}],
      {base64: true}
    );
    setCroppedImageURI(uri);
  }

  // <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"a: "+aa+" b: "+bb}</Text>
  

  const handleScroll = (event) => {
    get_cropped_image_uri(event);
  };

  return (
    <View>
      <ScrollView onScroll={handleScroll}
        scrollEventThrottle={64}
        horizontal={true}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maximum_zoom_scale}
        minimumZoomScale={get_minimum_zoom_scale()}
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

      <Image source={{uri:croppedImageURI}} style={{position:'absolute', resizeMode:'contain', bottom: 300, alignSelf:'center', width:sc.title_bar_height*3, height:sc.title_bar_height*3, backgroundColor:sc.white, alignItems:'center', justifyContent:'center', borderColor:sc.orange, borderWidth:3, borderRadius:5}}/>
      <View style={{position:'absolute', bottom: 220, alignSelf:'center', width:sc.screen_width*0.9, height:sc.title_bar_height*1.5, backgroundColor:sc.white, alignItems:'center', justifyContent:'center', borderColor:sc.orange, borderWidth:3, borderRadius:5}}>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"x: "+parseInt(topLeftX)+" y: "+parseInt(topLeftY)}</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"w: "+parseInt(imgWidth)+" h: "+parseInt(imgHeight)}</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:18, color:sc.teal}}>{"new_size: "+newSize}</Text>
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
