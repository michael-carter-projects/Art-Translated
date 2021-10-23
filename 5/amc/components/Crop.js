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
  const actual_image_width  = navigation.state.params.width_actual;
  const actual_image_height = navigation.state.params.height_actual;
  const image_width_in_view  = navigation.state.params.width_in_view;
  const image_height_in_view = navigation.state.params.height_in_view;
  const minimum_zoom_scale = navigation.state.params.minimum_zoom_scale;
  const top_left_x = navigation.state.params.top_left_x;
  const top_left_y = navigation.state.params.top_left_y;
  const side_size = navigation.state.params.side_size;

  const image_aspect_ratio  = actual_image_width / actual_image_height;


  // HOOKS FOR STORING CROP INFO OF SUB-IMAGE CURRENTLY SITUATED WITHIN THE ON-SCREEN FRAME ====================================
  const [topLeftX, setTopLeftX] = useState(top_left_x);
  const [topLeftY, setTopLeftY] = useState(top_left_y);
  const [sideSize, setSideSize] = useState(side_size);

  const [readyToAnalyze,  setReadyToAnalyze ] = useState(true);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  useEffect(() => {

    setTopLeftX(top_left_x);
    setTopLeftY(top_left_y);
    setSideSize(side_size);
    setReadyToAnalyze(true);
  }, []);

  // RETREIVE VALUES FOR TOP BOTTOM LEFT RIGHT INSETS (BLACK SPACE AROUND IMAGE) ===============================================
  function get_scrollview_inset() {

    if (image_aspect_ratio > sc.crop_view_aspect_ratio) {
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

    if (image_aspect_ratio > sc.crop_view_aspect_ratio) {
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
  function update_crop_info_hooks(event) {

    // CALCULATE NEW SIZE TO CROP IMAGE TO ACCORDING TO ZOOM SCALE -------------
    const scaling_factor = minimum_zoom_scale / event.nativeEvent.zoomScale;

    if (image_aspect_ratio > sc.crop_view_aspect_ratio) {
      if (actual_image_width > actual_image_height) {
        var new_size = actual_image_height * scaling_factor;
      }
      else {
        var new_size = actual_image_width * scaling_factor;
      }
      setSideSize(new_size);

      var pixel_ratio = actual_image_width / sc.screen_width;
      var scaled_height = actual_image_height / pixel_ratio;
      var initialZoomScale = sc.no_nav_view_height / scaled_height;
      var xOffset = ((initialZoomScale * sc.screen_width - sc.screen_width) / 2) + sc.screen_width*0.05;
    }
    else {
      var new_size = parseInt(actual_image_width * scaling_factor);
      setSideSize(new_size);
      var xOffset = sc.screen_width*0.05+2;
    }

    // CALCULATE X Y OFFSET FOR CROPPING ---------------------------------------------------------------------------------------
    if (event.nativeEvent.zoomScale > 1 && event.nativeEvent.contentSize.width > 0 && event.nativeEvent.contentSize.height > 0)
    {
      var width_in_layout = event.nativeEvent.contentSize.width;
      var x_in_layout = event.nativeEvent.contentOffset.x + xOffset;
      var x_in_image = parseInt((x_in_layout/width_in_layout) * actual_image_width);
      setTopLeftX(x_in_image);

      var height_in_layout = event.nativeEvent.contentSize.height;
      var y_in_layout = event.nativeEvent.contentOffset.y + sc.universal_y_offset;
      var y_in_image = parseInt((y_in_layout/height_in_layout) * actual_image_height);
      setTopLeftY(y_in_image);

      setHasBeenScrolled(true);
    }
    else if (event.nativeEvent.zoomScale <= 1 && event.nativeEvent.contentSize.width > 0 && event.nativeEvent.contentSize.height > 0)
    {
      var width_in_layout = event.nativeEvent.contentSize.width;
      var x_in_layout = event.nativeEvent.contentOffset.x + xOffset;
      var x_in_image = parseInt((x_in_layout/width_in_layout) * actual_image_width);
      setTopLeftX(x_in_image);

      var height_in_layout = event.nativeEvent.contentSize.height;
      var y_in_layout = event.nativeEvent.contentOffset.y + sc.universal_y_offset;
      var y_in_image = parseInt((y_in_layout/height_in_layout) * actual_image_height);
      setTopLeftY(y_in_image);

      setHasBeenScrolled(true);
    }

    /* CROP THE IMAGE ACCORDING TO AFOREMENTIONED DIMENSIONS -----------------------------------------------------------------
    //const [croppedImageURI, setCroppedImageURI] = useState(null);
    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX: topLeftX,
                 originY: topLeftY,
                 width:   sideSize,
                 height:  sideSize}},
       {resize: {width:224}}],
      {base64: true}
    );
    setCroppedImageURI(uri);
    <Image source={{uri:croppedImageURI}} style={{alignSelf:'center', width:150, height:150, position:'absolute', bottom:350, borderWidth:1, borderColor:sc.white}}/>
    */
  }
  // ALLOWS ASYNC FUNCTION TO BE CALLED ONSCROLL ===============================================================================
  const handleScroll = (event) => {
    update_crop_info_hooks(event);
  };

  // CALLED WHEN THE USER PRESSES ANALYZE BUTTON: CROPS IMAGE, MAKES PREDICTION, NAVIGATES TO PREDICTIONS PAGE =================
  async function make_prediction_async(nav) {

    // CROP THE IMAGE ACCORDING TO AFOREMENTIONED DIMENSIONS -----------------------------------------------------------------
    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      selected_image_uri,
      [{crop:   {originX: topLeftX,
                 originY: topLeftY,
                 width:   sideSize,
                 height:  sideSize}},
       {resize: {width:224}}],
      {base64: true}
    );

    // MAKE PREDICTION AND NAVIGATE ------------------------------------------------------------------------------------------
    const predictions = await run_predict_tree(base64);
    nav.navigate('Predictions', { selected_image_uri: uri,
                                  predictions: predictions
                                });
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
        scrollEventThrottle={8}
        horizontal={true}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={sc.maximum_zoom_scale}
        minimumZoomScale={minimum_zoom_scale}
        decelerationRate={0.99}
        contentInset={get_scrollview_inset()}
        contentContainerStyle={{flexDirection:'column'}}
        style={[hs.crop_scroll_view, get_scrollview_dimensions()]}
      >
        <Image source={{uri:selected_image_uri}} style={{resizeMode:'contain', width:image_width_in_view, height:image_height_in_view}}/>
      </ScrollView>

      <PictureFrame/>

      <View>
        { readyToAnalyze ? (
          <TouchableOpacity onPress={() => make_prediction_async(navigation)}>
            <View style={hs.analyze_button}>
              <Text style={hs.analyze_text}>Analyze</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={hs.analyze_button}>
            <Text style={hs.analyze_text}>Analyze</Text>
          </View>
        )}
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
