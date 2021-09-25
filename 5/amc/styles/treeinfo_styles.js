import { StyleSheet } from 'react-native';
import * as sc from './style_constants.js';

export const ts = StyleSheet.create({
  // MODEL TREE STYLES ---------------------------------------------------------
  node_text: {
    fontFamily:'ArgentumSansLight',
    fontSize:24,
    textAlign:'center',
    position:'absolute'
  },
  // MODEL INFO BOX STYLES -----------------------------------------------------
  section_title: {
    fontSize: 18,
    textAlign: 'left',
    color: sc.black,
    fontFamily: 'ArgentumSansRegular'
  },
  section_content: {
    color: sc.black,
    fontSize: 18,
    paddingBottom: 15,
    textAlign: 'left',
    fontFamily: 'ArgentumSansLight'
  },
  info_box: {
    width: sc.card_width,
    height: sc.card_width*1.1,
    paddingLeft:  15,
    paddingRight: 15,
    backgroundColor: sc.white,
    shadowOffset: {
      width: -7,
      height: 11
    },
    shadowOpacity: 0.35,
    shadowRadius: 13
  },
})
