import { StyleSheet } from 'react-native';
import * as sc from './style_constants.js';

// STYLES FOR VARIOUS ELEMENTS ON HOME PAGE ====================================================================================
const image_frame_side_length = sc.screen_width*0.9;
const image_frame_border_thickness = image_frame_side_length;
const image_frame_top_offset = image_frame_side_length*-0.5;

const navigation_bar_height = sc.screen_height*0.1;

const photos_page_spacing = 5;
const photos_page_image_size = (sc.screen_width - 5*photos_page_spacing) / 4;

const card_height = photos_page_image_size;

export const ps = StyleSheet.create({
  // PREDICTION PAGE TITLE BAR STYLE -------------------------------------------
  prediction_title_bar: {
    height: sc.title_bar_height,
    width: sc.screen_width,
    backgroundColor: sc.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close_icon: {
    position: 'absolute',
    left: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.55,
    fontSize: 55,
    color: sc.teal
  },
  art_translate_logo: {
    alignSelf:'center',
    top: 25,
    resizeMode: 'contain',
    width:sc.title_bar_height/1.6
  },
  camera_icon: {
    position: 'absolute',
    right: sc.title_bar_height*0.3,
    bottom: sc.title_bar_height*-0.48,
    fontSize:42,
    color: sc.teal
  },
  // SCROLL VIEW STYLE ---------------------------------------------------------
  scroll_view: {
    paddingTop: 20,
    width: sc.screen_width,
    flex: 1,
  },
  // FIRST RESULT STYLES -------------------------------------------------------
  first_result_card: {
    alignSelf: 'center',
    width: sc.card_width,
    height: sc.card_width*1.15,
    backgroundColor: sc.white,
    shadowOffset: {
      width: -7,
      height: 7
    },
    shadowOpacity: 0.35,
    shadowRadius: 13
  },
  first_result_image: {
    alignSelf: 'stretch',
    width: sc.card_width,
    height: sc.card_width/2,
  },
  first_result_name_view: {
    width: sc.card_width*0.6
  },
  first_result_name_text: {
    left: sc.card_width/30,
    top: sc.card_width/25,
    fontSize: 30,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_period_text: {
    left: sc.card_width/30,
    top: sc.card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_description_view: {
    paddingLeft: sc.card_width/30,
    width: sc.card_width*0.9,
    height:sc.card_width*0.26,
  },
  first_result_description_text: {
    paddingTop: 12,
    top: sc.card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  first_result_probability_text: {
    position: 'absolute',
    right: sc.card_width*0.04,
    top: sc.card_width*0.57,
    fontSize: 16,
    fontFamily: 'ArgentumSansRegular',
    color: sc.teal,
  },
  first_result_learn_more: {
    position: 'absolute',
    right: sc.card_width*0.07,
    bottom: sc.card_width/28,
    fontSize: 16,
    fontFamily: 'ArgentumSansRegular',
    color: sc.teal,
  },
  first_result_learn_more_arrow: {
    position: 'absolute',
    right: sc.card_width*0.025,
    bottom: sc.card_width/37,
  },
  // THIS COULD ALSO BE STYLES -------------------------------------------------
  this_could_also_be_view: {
    alignSelf: 'center',
    width: sc.card_width
  },
  this_could_also_be_text: {
    paddingTop: 25,
    paddingBottom: 10,
    fontSize:28,
    color:sc.black,
    fontFamily:'ArgentumSansLight'
  },
  // MORE RESULTS STYLES -------------------------------------------------------
  more_results_card: {
    alignSelf: 'center',
    width: sc.card_width,
    height: sc.more_results_height,
    fontSize: 18,
    backgroundColor: sc.white,
    flexDirection: 'row',
    shadowOffset: {
      width: -7,
      height: 7
    },
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  more_results_name_text: {
    left: sc.card_width*0.04,
    top: sc.card_width*0.02,
    fontSize: 20,
    fontFamily: 'ArgentumSansLight',
  },
  more_results_description_view: {
    position: 'absolute',
    top: sc.more_results_height*0.32,
    left: sc.more_results_height+sc.card_width*0.04,
    width: sc.card_width-sc.more_results_height-30,
    height: sc.more_results_height*0.5,
  },
  more_results_description_text: {
    fontSize: 14,
    fontFamily: 'ArgentumSansLight',
  },
  more_results_probability_text: {
    position: 'absolute',
    left: sc.card_width*0.04 + sc.more_results_height,
    bottom: sc.card_width*0.02,
    fontSize: 14,
    fontFamily: 'ArgentumSansRegular',
    color: sc.teal,
  },
  small_learn_more: {
    position: 'absolute',
    right: sc.card_width*0.065,
    bottom: sc.card_width*0.02,
    fontSize: 14,
    fontFamily: 'ArgentumSansRegular',
    color: sc.teal,
  },
  small_learn_more_arrow: {
    position: 'absolute',
    right: sc.card_width*0.025,
    bottom: sc.card_width*0.014,
  },
})
