import { StyleSheet } from 'react-native';
import * as sc from './style_constants.js';

// STYLES FOR VARIOUS ELEMENTS ON HOME PAGE ====================================================================================
const image_frame_side_length = sc.screen_width*0.9;
const image_frame_border_thickness = image_frame_side_length;
const image_frame_top_offset = image_frame_side_length*-0.5;

const card_height = sc.photos_image_size;

export const hs = StyleSheet.create({
  // CAMERA & PHOTO FRAME STYLES -----------------------------------------------
  camera_view: {
    width: sc.screen_width,
    height: sc.screen_height,
    alignItems: 'center',
    overflow:'hidden'
  },
  photo_outline: {
    width: image_frame_side_length,
    height: image_frame_side_length,
    borderColor: sc.white,
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
    color: sc.white,
    fontFamily:'ArgentumSansLight'
  },
  // PHOTO BUTTON STYLES -------------------------------------------------------
  button_panel: {
    position: 'absolute',
    bottom: sc.navigation_bar_height + 15,
    width: sc.screen_width,
    height: sc.take_pic_button_diameter,
    alignItems: 'center'
  },
  // NAVIGATION PANEL STYLES ---------------------------------------------------
  nav_panel_outer: {
    position: 'absolute',
    bottom: 0,
    width: sc.screen_width,
    height: sc.navigation_bar_height,
    backgroundColor: sc.white
  },
  nav_panel_inner: {
    width: sc.screen_width,
    height: sc.navigation_bar_height * (7/8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nav_button: {
    alignItems: 'center',
    width: sc.screen_width/2,
  },
  nav_button_text: {
    fontSize: 20,
    fontFamily:'ArgentumSansLight'
  },
  nav_selection_camera: {
    width: sc.screen_width/2,
    height: sc.navigation_bar_height/8,
    borderTopRightRadius: sc.navigation_bar_height/16,
    borderBottomRightRadius: sc.navigation_bar_height/16,
    backgroundColor: sc.teal
  },
  nav_selection_photos: {
    left: sc.screen_width/2,
    height: sc.navigation_bar_height/8,
    width: sc.screen_width/2,
    borderTopLeftRadius: sc.navigation_bar_height/16,
    borderBottomLeftRadius: sc.navigation_bar_height/16,
    backgroundColor: sc.teal
  },
  // PHOTO SELECTION PAGE STYLES -----------------------------------------------
  photo_selection_page: {
    position: 'absolute',
    bottom: sc.navigation_bar_height,
    width:sc.screen_width,
    height: sc.screen_height - sc.navigation_bar_height,
    backgroundColor: sc.white,
  },
  photo_title_bar: {
    height: sc.title_bar_height,
    width: sc.screen_width,
    backgroundColor: sc.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  photo_title_bar_text: {
    position: 'absolute',
    bottom: sc.title_bar_height*-0.4,
    fontSize: 26,
    color: sc.black,
    fontFamily:'ArgentumSansLight'
  },
  photos_page_safe_area_view: {
    top: sc.status_bar_height+sc.title_bar_height,
    height: sc.safe_area_height,
  },
  photo_button: {
    width:  sc.photos_image_size,
    height: sc.photos_image_size,
    backgroundColor: sc.white,
    marginLeft: sc.margin_width,
    marginTop: sc.margin_width,
  },
  // ALBUM STYLES --------------------------------------------------------------
  album_card: {
    alignSelf: 'center',
    width: sc.card_width,
    height: card_height,
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
  album_image: {
    width:  sc.photos_image_size,
    height: sc.photos_image_size,
  },
  album_name_text: {
    left: sc.card_width*0.04,
    top: sc.card_width*0.02,
    fontSize: 20,
    fontFamily: 'ArgentumSansLight',
  },
  album_image_count_text: {
    position: 'absolute',
    left: sc.card_width*0.04+card_height,
    top: sc.card_width*0.1,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
    color: sc.grey
  }
})
