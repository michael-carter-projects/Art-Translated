import { StyleSheet } from 'react-native';
import * as sc from './style_constants.js';

// STYLES FOR VARIOUS ELEMENTS =================================================================================================
export const ms = StyleSheet.create({
  movement_page_container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: sc.white,
    paddingTop: sc.status_bar_height+sc.title_bar_height
  },
  // MORE RESULTS STYLES -------------------------------------------------------
  movement_card: {
    alignSelf: 'center',
    width: sc.screen_width,
    height: sc.more_results_card_height,
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
  // MORE RESULTS STYLES -------------------------------------------------------
  movement_card: {
    alignSelf: 'center',
    width: sc.card_width,
    height: sc.card_width,
    fontSize: 18,
    backgroundColor: sc.white,
    flexDirection: 'row',
  },
  movement_image: {
    alignSelf: 'stretch',
    width: sc.screen_width,
    height: sc.card_width/1.8,
  },
  movement_name_view: {
    width: sc.card_width*0.6
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
    height:sc.card_width*0.26,
  },
  movement_description_text: {
    paddingTop: 12,
    top: sc.card_width/25,
    fontSize: 16,
    fontFamily: 'ArgentumSansLight',
  },
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
})
