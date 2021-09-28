import { Dimensions } from 'react-native';

// CONSTANTS FOR ALL PAGES =====================================================
export const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
export const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
export const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
export const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
export const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;

export const screen_dimensions = Dimensions.get('window');
export const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
export const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812

export const title_bar_height = screen_height*0.12;

export const margin_width = 5;
export const card_width  = screen_width - (2*margin_width);

// CONSTANTS FOR CAMERA/PHOTOS PAGE --------------------------------------------
export const take_pic_button_diameter = screen_height*0.12;

export const navigation_bar_height = screen_height*0.1;

export const images_per_row = 4;
const total_margin = (images_per_row+1)*margin_width;
export const photos_image_size = (screen_width - total_margin) / images_per_row;

// CONSTANTS FOR PREDICTIONS PAGE ----------------------------------------------
export const more_results_height = 120;

// CONSTANTS FOR MOVEMENTS PAGE ------------------------------------------------
export const more_results_card_height = 110;

// CONSTANTS FOR TREE INFO PAGE ------------------------------------------------
export const screen_sixth_x = screen_width/6;
export const screen_center_x = screen_width/2;
export const tier_height = 80;

export const node_radius = 30;
export const node_border_thickness = 3;
export const node_selection_thickness = 6;
