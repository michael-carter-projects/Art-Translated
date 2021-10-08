import { StyleSheet } from 'react-native';
import * as sc from './style_constants.js';

// STYLES FOR MOVEMENT PAGE ====================================================
export const ms = StyleSheet.create({
  movement_page_container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: sc.white,
    paddingTop: sc.status_bar_height+sc.title_bar_height
  },
  // STYLES FOR TOP HALF OF PAGE -----------------------------------------------
  movement_image: {
    alignSelf: 'stretch',
    width: sc.screen_width,
    height: sc.card_width/1.8,
  },
  movement_name_text: {
    left: sc.card_width*0.05,
    top: sc.card_width/25,
    fontSize: 34,
    fontFamily: 'ArgentumSansLight',
    color: sc.black
  },
  movement_period_text: {
    left: sc.card_width*0.05,
    top: sc.card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
    color: sc.black
  },
  movement_description_view: {
    left: sc.card_width*0.05,
    width: sc.card_width*0.9,
  },
  movement_description_text: {
    paddingTop: 12,
    top: sc.card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
  // STYLES FOR EXAMPLE IMAGES -------------------------------------------------
  example_images_outer_frame: {
    width:sc.screen_width*0.9,
    height:sc.card_width/4,
    borderColor:sc.teal,
    borderWidth:5,
    alignSelf:'center'
  },
  example_images_inner_frame: {
    width:sc.screen_width*0.9-10,
    height:sc.card_width/4 -10,
    borderColor:sc.orange,
    borderWidth:3,
  },
  example_image_button: {
    width:sc.card_width/4-26,
    height:sc.card_width/4-26,
    marginTop:5,
    marginLeft:5,
  },
  // STYLES FOR TEXT FIELDS ----------------------------------------------------
  section_title: {
    left: sc.screen_width*0.05,
    width: sc.screen_width*0.9,
    fontFamily: 'ArgentumSansLight',
    fontSize: 24,
    textAlign: 'left',
    color: sc.black
  },
  section_content: {
    left: sc.screen_width*0.05,
    width: sc.screen_width*0.9,
    fontFamily: 'ArgentumSansLight',
    fontSize: 18,
    textAlign: 'left',
    color: sc.black,
    paddingBottom: 15,
  },
  // STYLES FOR IMAGE VIEWER OVERLAY -------------------------------------------
  overlay_background: {
    position:'absolute',
    width: sc.screen_width,
    height: sc.screen_height,
    backgroundColor:'rgba(0, 0, 0, 0.8)'
  },
  overlay_control_panel: {
    position:'absolute',
    top: sc.image_viewer_overlay_top_offset+sc.image_viewer_overlay_height,
    left: sc.image_viewer_overlay_left_offset,
    height: sc.image_viewer_control_panel_height,
    width: sc.image_viewer_overlay_width,
    flexDirection:'row',
    backgroundColor:'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: sc.image_viewer_border_radius,
    borderBottomRightRadius: sc.image_viewer_border_radius,
  },
  overlay_window: {
    top: sc.image_viewer_overlay_top_offset,
    left: sc.image_viewer_overlay_left_offset,
    width: sc.image_viewer_overlay_width,
    height: sc.image_viewer_overlay_height,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: sc.image_viewer_border_radius,
    borderTopRightRadius: sc.image_viewer_border_radius,
  },
  overlay_scrollview: {
    width: sc.image_viewer_overlay_width,
    height: sc.image_viewer_overlay_height,
    borderTopLeftRadius: sc.image_viewer_border_radius,
    borderTopRightRadius: sc.image_viewer_border_radius,
  },
  overlay_image: {
    resizeMode: 'contain'
  },
})
