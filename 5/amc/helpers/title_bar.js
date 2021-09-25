import { StatusBar } from 'expo-status-bar';
import { Ionicons }  from '@expo/vector-icons';

import   React, { useState, useEffect, useCallback }                   from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import * as sc from '../styles/style_constants.js';

const styles = StyleSheet.create({
  title_bar: {
    position: 'absolute',
    height: sc.title_bar_height,
    width: sc.screen_width,
    flexDirection: 'row',
    alignItems: 'center',
  },
  close_icon: {
    position: 'absolute',
    left: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.55,
    fontSize: 55,
  },
  back_icon: {
    position: 'absolute',
    left: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.45,
    fontSize: 37,
    color: sc.teal
  },
  camera_icon: {
    position: 'absolute',
    right: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.48,
    fontSize:42,
    color: sc.teal
  },
  home_icon: {
    position: 'absolute',
    right: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.48,
    fontSize:42,
    color: sc.teal
  },
  help_button: {
    position: 'absolute',
    right: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.48,
    color: sc.white,
    fontSize:37
  },
  art_translate_logo: {
    alignSelf:'center',
    top: 25,
    resizeMode: 'contain',
    width: sc.title_bar_height/1.6
  },
  title_bar_text: {
    alignSelf: 'center',
    bottom: sc.title_bar_height*-0.25,
    fontSize: 26,
    color: sc.black,
    fontFamily:'ArgentumSansLight'
  },
})


function TitleBarButton(props) {
  switch (props.button_name) {
    case 'close':
      return (
        <Ionicons name="ios-close" style={[styles.close_icon, {color:props.color}]}/>
      );
    case 'back':
      return (
        <Ionicons name="ios-arrow-back" style={[styles.back_icon, {color:props.color}]}/>
      );
    case 'camera':
      return (
        <Ionicons name="ios-camera" style={[styles.camera_icon, {color:props.color}]}/>
      );
    case 'home':
      return (
        <Ionicons name="ios-home" style={[styles.home_icon, {color:props.color}]}/>
      );
    case 'help':
      return (
        <Ionicons name="md-help-circle" style={[styles.camera_icon, {color:props.color}]}/>
      );
    default:
      return (
        null
      );
  }
}

function Title(props) {
  if (props.title === null) {
    return (null);
  }
  else if (props.title === 'logo') {
    return (
      <Image source={require('../assets/icons/AT.png')} style={styles.art_translate_logo}/>
    );
  }
  else {
    return (
      <Text numberOfLines={1} style={styles.title_bar_text}>{props.title}</Text>
    );
  }
}

export function TitleBar(props) {
  return (
    <View style={[styles.title_bar, {backgroundColor:props.bgColor}]}>
      <View style={{flex:1}}>
        <TouchableOpacity style={{alignItems:'center'}} onPress={props.leftPress}>
          <TitleBarButton button_name={props.left} color={props.buttonColor}/>
        </TouchableOpacity>
      </View>
      <View style={{flex:3}}>
        <Title title={props.middle}/>
      </View>
      <View style={{flex:1}}>
        <TouchableOpacity style={{alignItems:'center'}} onPress={props.rightPress}>
          <TitleBarButton button_name={props.right} color={props.buttonColor}/>
        </TouchableOpacity>
      </View>
      <StatusBar style={props.statusColor} />
    </View>
  )
}
