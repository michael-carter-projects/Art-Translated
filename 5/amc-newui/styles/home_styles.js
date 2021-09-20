import { StyleSheet } from 'react-native';
import * as SC from './style_constants.js';

// STYLES FOR VARIOUS ELEMENTS ON HOME PAGE ====================================================================================
const image_frame_side_length = SC.screen_width*0.9;
const image_frame_border_thickness = image_frame_side_length;
const image_frame_top_offset = image_frame_side_length*-0.5;

const navigation_bar_height = SC.screen_height*0.1;

const photos_page_spacing = 5;
const photos_page_image_size = (SC.screen_width - 5*photos_page_spacing) / 4;

const card_height = photos_page_image_size;

export const HomeStyles = StyleSheet.create({
  camera_title_bar: {
    position: 'absolute',
    top: 0,
    height: SC.title_bar_height,
    width: SC.screen_width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  close_icon: {
    position: 'absolute',
    left: SC.title_bar_height*0.3,
    bottom: SC.title_bar_height*-0.55,
    fontSize: 55,
  },
  back_icon: {
    position: 'absolute',
    left: SC.title_bar_height*0.3,
    bottom: SC.title_bar_height*-0.45,
    fontSize: 37,
    color: SC.teal
  },
  help_button: {
    position: 'absolute',
    right: SC.title_bar_height*0.3,
    bottom: SC.title_bar_height*-0.48,
    color: SC.white,
    fontSize:37
  },
  // CAMERA & PHOTO FRAME STYLES -----------------------------------------------
  camera_view: {
    flex: 1,
    alignItems: 'center',
    overflow:'hidden'
  },
  photo_outline: {
    width: image_frame_side_length,
    height: image_frame_side_length,
    borderColor: SC.white,
    borderWidth: 2,
  },
  transparent_frame: {
    top: image_frame_top_offset,
    width: image_frame_side_length*3,
    height: image_frame_side_length*3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: image_frame_border_thickness,
  },
  // PROGRESS BAR STUFF --------------------------------------------------------
  progress_bar_text: {
    fontSize: 24,
    color: SC.white,
    fontFamily:'ArgentumSansLight'
  },
  // PHOTO BUTTON STYLES -------------------------------------------------------
  button_panel: {
    position: 'absolute',
    bottom: navigation_bar_height + 15,
    width: SC.screen_width,
    height: SC.take_pic_button_diameter,
    alignItems: 'center'
  },
  //
  nav_panel_outer: {
    position: 'absolute',
    bottom: 0,
    width: SC.screen_width,
    height: navigation_bar_height,
    backgroundColor: SC.white
  },
  nav_panel_inner: {
    width: SC.screen_width,
    height: navigation_bar_height * (7/8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nav_button: {
    alignItems: 'center',
    width: SC.screen_width/2,
  },
  nav_button_text: {
    fontSize: 20,
    fontFamily:'ArgentumSansLight'
  },
  nav_selection_camera: {
    width: SC.screen_width/2,
    height: navigation_bar_height/8,
    borderTopRightRadius: navigation_bar_height/16,
    borderBottomRightRadius: navigation_bar_height/16,
    backgroundColor: SC.teal
  },
  nav_selection_photos: {
    left: SC.screen_width/2,
    height: navigation_bar_height/8,
    width: SC.screen_width/2,
    borderTopLeftRadius: navigation_bar_height/16,
    borderBottomLeftRadius: navigation_bar_height/16,
    backgroundColor: SC.teal
  },
  photo_selection_page: {
    position: 'absolute',
    bottom: navigation_bar_height,
    width:SC.screen_width,
    height: SC.screen_height - navigation_bar_height,
    backgroundColor: SC.white,
  },
  photo_title_bar: {
    height: SC.title_bar_height,
    width: SC.screen_width,
    backgroundColor: SC.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  photo_title_bar_text: {
    position: 'absolute',
    bottom: SC.title_bar_height*-0.4,
    fontSize: 26,
    color: SC.black,
    fontFamily:'ArgentumSansLight'
  },
  image_row: {
    width: SC.screen_width,
    height: (SC.screen_width - 25)/4 + 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width:  photos_page_image_size,
    height: photos_page_image_size,
  },
  image_blank: {
    width:  photos_page_image_size,
    height: photos_page_image_size,
    backgroundColor: SC.grey,
  },
  // ALBUM STYLES -------------------------------------------------------
  album_card: {
    alignSelf: 'center',
    width: SC.card_width,
    height: card_height,
    fontSize: 18,
    backgroundColor: SC.white,
    flexDirection: 'row',
    shadowOffset: {
      width: -7,
      height: 7
    },
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  album_name_text: {
    left: SC.card_width*0.04,
    top: SC.card_width*0.02,
    fontSize: 20,
    fontFamily: 'ArgentumSansLight',
  },
  album_image_count_text: {
    position: 'absolute',
    left: SC.card_width*0.04+card_height,
    top: SC.card_width*0.1,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
    color: SC.grey
  }
})
