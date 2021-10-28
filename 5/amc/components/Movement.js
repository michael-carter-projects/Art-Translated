import { StatusBar } from 'expo-status-bar'
import { Feather }  from '@expo/vector-icons';

import   React, { useState, useEffect, useCallback, useRef }         from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card, Icon }                                                              from 'react-native-elements'

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ms } from '../styles/movement_styles.js';
import * as sc   from '../styles/style_constants.js';


function Movement ({navigation})
{
  //const [exampleImages, setExampleImages] = useState(navigation.state.params.mvmt_info.examples);
  const [exampleImages, setExampleImages] = useState([require('../assets/mvmt_images/example_1.jpg'),
                                                      require('../assets/mvmt_images/example_2.jpg'),
                                                      require('../assets/mvmt_images/example_3.jpg'),
                                                      require('../assets/mvmt_images/example_4.jpg'),
                                                      require('../assets/mvmt_images/example_5.jpg'),
                                                      require('../assets/mvmt_images/example_6.jpg'),
                                                      require('../assets/mvmt_images/example_7.jpg'),
                                                      require('../assets/mvmt_images/example_8.jpg')]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [exampleImageCount, setExampleImageCount] = useState(8);


  // DETERMINES HOW TO DISPLAY AN IMAGE BASED ON IT'S ASPECT RATIO =============================================================
  function get_dimensions() {

    if (selectedImageIndex === -1) return null;

    const src_w = Image.resolveAssetSource(exampleImages[selectedImageIndex]).width;
    const src_h = Image.resolveAssetSource(exampleImages[selectedImageIndex]).height;
    const src_ratio = src_w/src_h;
    const win_ratio = sc.image_viewer_overlay_width/sc.image_viewer_overlay_height;

    if (src_ratio > win_ratio) {
      return {
        top: sc.image_viewer_overlay_height/2 - src_h/2,
        width: sc.image_viewer_overlay_width,
      }
    }
    else if (src_ratio < win_ratio) {
      return {
        left: sc.image_viewer_overlay_width/2 - src_w/2,
        height: sc.image_viewer_overlay_height,
      }
    }
    else {
      return {
        width: sc.image_viewer_overlay_width,
        height: sc.image_viewer_overlay_height,
      }
    }
  }

  // METHOD FOR UPDATING HOOKS THAT ALLOWS "CIRCULAR" SCROLLING THROUGH IMAGES =================================================
  function change_image(direction) {

    if (selectedImageIndex === exampleImageCount-1 && direction === 'forward') {
      setSelectedImageIndex(0);
    }
    else if(selectedImageIndex === 0 && direction === 'back') {
      setSelectedImageIndex(exampleImageCount-1);
    }
    else {
      if (direction === 'forward') {
        setSelectedImageIndex(selectedImageIndex+1);
      }
      else {
        setSelectedImageIndex(selectedImageIndex-1);
      }
    }
  }

  // RENDERS THE OVERLAY THAT ALLOWS THE USER TO VIEW EXAMPLE IMAGES ===========================================================
  function ImageViewerOverlay(props) {
    return (
      <View style={ms.overlay_background}>

        <View style={ms.overlay_control_panel}>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => change_image('back')}>
              <Feather name="chevron-left" size={45} color={sc.white}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => setSelectedImageIndex(-1)}>
              <Feather name="x" size={45} color={sc.white}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => change_image('forward')}>
              <Feather name="chevron-right" size={45} color={sc.white}/>
              </TouchableOpacity>
          </View>
        </View>

        <View style={ms.overlay_window}>
          <ScrollView horizontal={true}
                      pinchGestureEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      maximumZoomScale={8}
                      decelerationRate={0.99}
                      style={ms.overlay_scrollview}>
            <Image source={exampleImages[selectedImageIndex]} style={[ms.overlay_image, get_dimensions()]}/>
          </ScrollView>
        </View>
      </View>
    )
  }

  // RENDERS A LIST OF EXAMPLE IMAGE BUTTONS ===================================================================================
  function ExampleImageViews(props) {

    var image_views = [];
    for (let i=0; i<exampleImages.length; i++) {
      image_views.push(
        <TouchableOpacity key={i} onPress={() => setSelectedImageIndex(i)}>
          <Image source={exampleImages[i]} style={ms.example_image_button}/>
        </TouchableOpacity>
      );
    }
    return image_views;
  }

  // RENDERS THE EXAMPLE IMAGES IN SCROLLVIEW INSIDE FRAME =====================================================================
  function ExampleImages(props) {
    return (
      <View style={ms.example_images_outer_frame}>
        <View style={ms.example_images_inner_frame}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <ExampleImageViews/>
          </ScrollView>
        </View>
      </View>
    )
  }

  // RENDERS THE DETAILS AS FORMATTED TEXT =====================================================================================
  function ShowDetails(props) {

    var details = [];

    for (var field in props.mvmt_info) {
      if (field !== 'name'
       && field !== 'key_timespan'
       && field !== 'quick_take'
       && field !== 'relevant_images'
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

  const mvmt_info = navigation.state.params.mvmt_info;
  const previous_page = navigation.state.params.prev;
  const movement_thumbnail = mvmt_info.thumbnail;

  return (
    <View style={ms.movement_page_container}>

      <TitleBar
        bgColor={sc.white}
        buttonColor={sc.teal}
        statusColor={'dark'}
        left={'back'}
        leftPress={() => navigation.navigate(previous_page)}
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

      { selectedImageIndex !== -1 ? (<ImageViewerOverlay/>) : (null) }

    </View>
  );
}

Movement.navigationOptions = navigation => ({ headerShown: false });

export default Movement;
