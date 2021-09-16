import { Dimensions } from 'react-native';

// CONSTANTS FOR VARIOUS ELEMENTS ==============================================
export const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
export const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
export const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
export const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
export const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;

export const screen_dimensions = Dimensions.get('window');
export const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
export const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812

export const title_bar_height = screen_height*0.11;

export const take_pic_button_diameter = screen_height*0.12;

export const margin_width = screen_width*0.025;
export const card_width  = screen_width - (2*margin_width);
