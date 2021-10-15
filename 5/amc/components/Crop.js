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

  const selected_image_uri  = navigation.state.params.selected_image_uri;
  const actual_image_width  = navigation.state.params.width;
  const actual_image_height = navigation.state.params.height;

  const image_aspect_ratio  = actual_image_width / actual_image_height;
  const view_aspect_ratio   = sc.screen_width / sc.no_nav_view_height;
  const frame_to_view_height_ratio = (sc.image_frame_side_length-4) / sc.no_nav_view_height;
  const frame_to_view_width_ratio  = (sc.image_frame_side_length-4) / sc.screen_width;

  // CALCULATE THE ZOOM SCALE THAT LIMITS THE USER TO STAY WITHIN BOUNDARIES OF THE IMAGE ======================================
  if (image_aspect_ratio >= 1) {
    var minimum_zoom_scale = frame_to_view_height_ratio;
  }
  else {
    if (image_aspect_ratio >= view_aspect_ratio) {
      var pixel_ratio = sc.no_nav_view_height / actual_image_height;
      var scaled_width = pixel_ratio * actual_image_width;
      var minimum_zoom_scale = (sc.image_frame_side_length-4) / scaled_width;
    }
    else {
      var minimum_zoom_scale = frame_to_view_width_ratio;
    }
  }

  // STORE MAXIMUM ZOOM SCALE ==================================================================================================
  const maximum_zoom_scale = 8;
  const yOffset = sc.title_bar_to_top_of_frame;

  function get_initial_cropping_dimensions() {
    // CALCULATE THE INITIAL X AND Y OFFSETS OF THE IMAGE FRAME ==================================================================
    const scaling_factor = minimum_zoom_scale / 1;

    if (image_aspect_ratio > view_aspect_ratio) {
      if (actual_image_width > actual_image_height) {
        var new_size = actual_image_height * scaling_factor;
      }
      else {
        var new_size = actual_image_width * scaling_factor;
      }
      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      var xOffset = ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05;
    }
    else {
      var new_size = actual_image_width * scaling_factor;
      var xOffset = sc.screen_width*0.05+2;
    }

    return {
      top_left_x: parseInt((xOffset/get_image_dimensions().width) * actual_image_width),
      top_left_y: parseInt((yOffset/get_image_dimensions().height) * actual_image_height),
      side_size:  new_size
    }
  }

  var initial_crop_dimensions = get_initial_cropping_dimensions();

  // HOOKS FOR STORING CROP INFO OF SUB-IMAGE CURRENTLY SITUATED WITHIN THE ON-SCREEN FRAME ====================================
  const [topLeftX, setTopLeftX] = useState(initial_crop_dimensions.top_left_x);
  const [topLeftY, setTopLeftY] = useState(initial_crop_dimensions.top_left_y);
  const [newSize,  setNewSize ] = useState(initial_crop_dimensions.side_size);

  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  //const [croppedImageURI, setCroppedImageURI] = useState('../assets/icons/no_image.png');

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
        left:  (((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05)+2,
        right: (((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05)+2,
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
  // UPDATE HOOKS THAT STORE CROP INFO OF SUB-IMAGE CURRENTLY SITUATED WITHIN THE ON-SCREEN FRAMEE =============================
  async function update_crop_info_hooks_async(event) {

    // CALCULATE NEW SIZE TO CROP IMAGE TO ACCORDING TO ZOOM SCALE -------------
    const scaling_factor = minimum_zoom_scale / event.nativeEvent.zoomScale;

    if (image_aspect_ratio > view_aspect_ratio) {
      if (actual_image_width > actual_image_height) {
        var new_size = actual_image_height * scaling_factor;
      }
      else {
        var new_size = actual_image_width * scaling_factor;
      }
      setNewSize(new_size);

      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      var xOffset = ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05;
    }
    else {
      var new_size = parseInt(actual_image_width * scaling_factor);
      setNewSize(new_size);
      var xOffset = sc.screen_width*0.05+2;
    }

    // CALCULATE X Y OFFSET FOR CROPPING ---------------------------------------------------------------------------------------
    var width_in_layout = sc.screen_width;
    var height_in_layout = sc.no_nav_view_height;

    if (event.nativeEvent.zoomScale > 1) {
      if (event.nativeEvent.contentSize.width !== 0) { width_in_layout = event.nativeEvent.contentSize.width; }
      var x_in_layout = event.nativeEvent.contentOffset.x + xOffset;
      var x_in_image = parseInt((x_in_layout/width_in_layout) * actual_image_width);
      setTopLeftX(x_in_image);

      if (event.nativeEvent.contentSize.height !== 0) { height_in_layout = event.nativeEvent.contentSize.height; }
      var y_in_layout = event.nativeEvent.contentOffset.y + yOffset;
      var y_in_image = parseInt((y_in_layout/height_in_layout) * actual_image_height);
      setTopLeftY(y_in_image);
    }
    else {
      if (event.nativeEvent.contentSize.width !== 0) { width_in_layout = event.nativeEvent.contentSize.width; }
      var x_in_layout = event.nativeEvent.contentOffset.x + xOffset;
      var x_in_image = parseInt((x_in_layout/width_in_layout) * actual_image_width);
      setTopLeftX(x_in_image);

      if (event.nativeEvent.contentSize.height !== 0) { height_in_layout = event.nativeEvent.contentSize.height; }
      var y_in_layout = event.nativeEvent.contentOffset.y + yOffset;
      var y_in_image = parseInt((y_in_layout/height_in_layout) * actual_image_height);
      setTopLeftY(y_in_image);
    }

    /*const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX:x_in_image, originY:y_in_image, width:new_size, height:new_size}},
       {resize: {width:224}}],
      {base64: false}
    );
    setCroppedImageURI(uri);

    <Image source={{uri:croppedImageURI}} style={hs.preview_window}/>
    */
  }
  // ALLOWS ASYNC FUNCTION TO BE CALLED ONSCROLL ===============================================================================
  const handleScroll = (event) => {
    update_crop_info_hooks_async(event);
    setHasBeenScrolled(true);
  };

  // CALLED WHEN THE USER PRESSES ANALYZE BUTTON: CROPS IMAGE, MAKES PREDICTION, NAVIGATES TO PREDICTIONS PAGE =================
  async function make_prediction_async(nav) {

    // IF THE USER HAS NOT YET SCROLLED WITHIN THE CROP PAGE: ------------------------------------------------------------------
    if (!hasBeenScrolled) {
      // GET THE CROP DIMENSIONS OF THE FRAME BEFORE THE USER HAS BEGUN SCROLLING ----------------------------------------------
      initial_crop_dimensions = get_initial_cropping_dimensions();

      // CROP THE IMAGE ACCORDING TO AFOREMENTIONED DIMENSIONS -----------------------------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        selected_image_uri,
        [{crop:   {originX: initial_crop_dimensions.top_left_x,
                   originY: initial_crop_dimensions.top_left_y,
                   width:   initial_crop_dimensions.side_size,
                   height:  initial_crop_dimensions.side_size}},
         {resize: {width:224}}],
        {base64: true}
      );

      // MAKE PREDICTION AND NAVIGATE ------------------------------------------------------------------------------------------
      const predictions = await run_predict_tree(base64);
      nav.navigate('Predictions', { selected_image_uri: uri,
                                    predictions: predictions
                                  });
    }
    // IF THE USER HAS SCROLLED WITHIN THE CROP PAGE: --------------------------------------------------------------------------
    else {
      // CROP IMAGE ACCORDING TO HOOK VAlUES -----------------------------------------------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        selected_image_uri,
        [{crop:   {originX: topLeftX,
                   originY: topLeftY,
                   width:   newSize,
                   height:  newSize}},
         {resize: {width:224}}],
        {base64: true}
      );

      // MAKE PREDICTION AND NAVIGATE ------------------------------------------------------------------------------------------
      const predictions = await run_predict_tree(base64);
      nav.navigate('Predictions', { selected_image_uri: uri,
                                    predictions: predictions
                                  });
    }
  }

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
        style={[hs.crop_scroll_view, get_scrollview_dimensions()]}
      >
        <Image source={{uri:selected_image_uri}} style={[{resizeMode:'contain'}, get_image_dimensions()]}/>
      </ScrollView>

      <PictureFrame/>

      <TouchableOpacity onPress={() => make_prediction_async(navigation)}>
        <View style={hs.analyze_button}>
          <Text style={hs.analyze_text}>Analyze</Text>
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
