import { StatusBar } from 'expo-status-bar';
import { Ionicons }  from '@expo/vector-icons';

import   React, { useState, useEffect, useCallback }                   from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import * as sc from '../styles/style_constants.js';

const styles = StyleSheet.create({
  title_bar_outer: {
    position: 'absolute',
    height: sc.title_bar_height+sc.status_bar_height,
    width: sc.screen_width,
  },
  status_bar: {
    height: sc.status_bar_height,
    width: sc.screen_width,
  },
  title_bar: {
    height: sc.title_bar_height,
    width: sc.screen_width,
    flexDirection: 'row',
    alignItems: 'center',
  },
  art_translate_logo: {
    alignSelf:'center',
    resizeMode: 'contain',
    width: sc.title_bar_height
  },
  title_bar_text: {
    alignSelf: 'center',
    fontSize: 26,
    color: sc.black,
    fontFamily:'ArgentumSansLight'
  },
})


function TitleBarButton(props) {
  switch (props.button_name) {
    case 'close':
      return (
        <Ionicons name="ios-close" size={55} color={props.color}/>
      );
    case 'back':
      return (
        <Ionicons name="ios-arrow-back" size={40} color={props.color}/>
      );
    case 'camera':
      return (
        <Ionicons name="ios-camera" size={42} color={props.color}/>
      );
    case 'home':
      return (
        <Ionicons name="ios-home" size={42} color={props.color}/>
      );
    case 'help':
      return (
        <Ionicons name="md-help-circle" size={37} color={props.color}/>
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
    <View style={styles.title_bar_outer}>
      <View style={styles.status_bar}/>

      <View  style={[styles.title_bar, {backgroundColor:props.color}]}>

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
    </View>
  )
}
