import   React, { useState, useEffect, useCallback }                   from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Card }                                                        from 'react-native-elements'
import Svg, { Circle, Line }                                           from 'react-native-svg';

import { TitleBar }   from '../helpers/title_bar.js'
import * as Functions from '../helpers/functions.js'

import    { ts } from '../styles/treeinfo_styles.js';
import * as sc   from '../styles/style_constants.js';

import { movement_details } from '../assets/mvmt_details.js'

// LIST OF ALL MOVEMENT NAMES ==================================================
const alph_movement_names = ['abstract_expressionism',
                        'academic_classicism',
                        'art_deco',
                        'art_nouveau',
                        'baroque',
                        'byzantine',
                        'cubism',
                        'early_renaissance',
                        'egyptian',
                        'expressionism',
                        'fauvism',
                        'gothic',
                        'grotesque',
                        'high_renaissance',
                        'impressionism',
                        'mannerism',
                        'neoclassicism',
                        'northern_renaissance',
                        'post_impressionism',
                        'realism_naturalism',
                        'rococo',
                        'romanticism',
                        'surrealism',
                        'symbolism',
                        'vanitas'];

// MODEL TREE STATS ============================================================
const model_tree_info = {
  a2o: {
    name: 'Architecture, 2D, or Object [NOT YET IMPLEMENTED]',
    type: 'single-label, high-accuracy',
    desc: ['architecture', 'twodimensional', 'object'],
    accu: 0.000,
    size: 0.0
  },
  arc: {
    name: 'Architecture [NOT YET IMPLEMENTED]',
    type: 'single-label, high-accuracy',
    desc: ['art-deco', 'gothic', 'romanesque', 'etcetera'],
    accu: 0.000,
    size: 0.0
  },
  obj: {
    name: 'Object [NOT YET IMPLEMENTED]',
    type: 'single-label, high-accuracy',
    desc: ['gothic', 'egyptian', 'mannerism-late-renaissance', 'etcetera'],
    accu: 0.000,
    size: 0.0
  },
  two: {
    name: 'Two Dimensional',
    type: 'multi-label, high-accuracy',
    desc: [ 'abstractish', 'art-deco', 'art-nouveau-modern', 'baroque-painting', 'byzantine',
            'cubism', 'egyptian', 'gothic-book', 'gothic-painting', 'gothic-polyptych',
            'gothic-worn', 'grotesque-design', 'neoclassicism', 'realism', 'renaissancish',
            'rococo', 'romanticism', 'surrealism', 'symbolism', 'vanitas'],
    accu: 0.777,
    size: 22.0
  },
  abs: {
    name: 'Abstract-ish',
    type: 'multi-label, high-accuracy',
    desc: ['expressionism', 'fauvism', 'impressionism', 'post-impressionism'],
    accu: 0.813,
    size: 22.0
  },
  ren: {
    name: 'Renaissance-ish',
    type: 'multi-label, high-accuracy',
    desc: ['academicism', 'early-renaissance-painting', 'high-renaissance-paintings', 'mannerism-painting', 'northern-renaissance-painting'],
    accu: 0.849,
    size: 22.0
  },
}


function TreeInfo ({navigation})
{
  const [modelInfo, setModelInfo] = useState(model_tree_info.a2o);
  const [index, setIndex] = useState(-1);

  // UPDATES MODEL INFO TO BE DISPLAYED ON BOTTOM OF SCREEN ====================
  function get_model_info(abbr) {
    var model = null;

    switch (abbr) {
      case 'a2o':
        model = model_tree_info.a2o;
        if (index === 0) { setIndex(-1); }
        else             { setIndex(0);  }
        break;
      case 'arc':
        model = model_tree_info.arc;
        if (index === 1) { setIndex(-1); }
        else             { setIndex(1);  }
        break;
      case 'two':
        model = model_tree_info.two;
        if (index === 2) { setIndex(-1); }
        else             { setIndex(2);  }
        break;
      case 'obj':
        model = model_tree_info.obj;
        if (index === 3) { setIndex(-1); }
        else             { setIndex(3);  }
        break;
      case 'abs':
        model = model_tree_info.abs;
        if (index === 4) { setIndex(-1); }
        else             { setIndex(4);  }
        break;
      case 'ren':
        model = model_tree_info.ren;
        if (index === 5) { setIndex(-1); }
        else             { setIndex(5);  }
        break;
      default:
        model = null;
        setIndex(-1);
        break;
    }
    setModelInfo(model);

  }

  // RETURNS A LIST OF ART MOVEMENT BUTTONS ====================================
  function ShowAllMovements(props) {

    var all_movements = [
      <View key={0} style={{flex:1}}>
        <Card.Title style={ts.section_title}>All Art Movements</Card.Title>
        <Card.Divider/>
      </View>
    ];

    for (let i=0; i<alph_movement_names.length; i++) {
      let mvmt_info = movement_details[alph_movement_names[i]];
      all_movements.push(
        <TouchableOpacity key={2*i+1} onPress={() => props.nav.navigate('Movement', {mvmt_info:mvmt_info, prev:'TreeInfo'})}>
          <View  style={{flex:1, flexDirection:'row'}}>
            <Image source={mvmt_info.thumbnail} style={{width:80, height:80}}/>
            <Text style={[ts.section_content, {left:20}]}>{mvmt_info.name}</Text>
          </View>
        </TouchableOpacity>
      );
      all_movements.push(
        <Card.Divider key={2*i+2}/>
      );
    }
    return all_movements;
  }

  // RETURNS SVG VIEW REPRESENTING MODEL TREE ==================================
  function ShowModelTree() {
    return (
      <Svg height="33%" width="100%">

        <Line x1={sc.screen_center_x} y1={sc.tier_height/2+sc.node_radius} x2={sc.screen_sixth_x*1} y2={sc.tier_height*1.5-sc.node_radius} stroke={sc.teal} strokeWidth={sc.node_border_thickness} />
        <Line x1={sc.screen_center_x} y1={sc.tier_height/2+sc.node_radius} x2={sc.screen_sixth_x*3} y2={sc.tier_height*1.5-sc.node_radius} stroke={sc.teal} strokeWidth={sc.node_border_thickness} />
        <Line x1={sc.screen_center_x} y1={sc.tier_height/2+sc.node_radius} x2={sc.screen_sixth_x*5} y2={sc.tier_height*1.5-sc.node_radius} stroke={sc.teal} strokeWidth={sc.node_border_thickness} />
        { (index === 0) ? (
          <Circle
            cx={sc.screen_center_x}
            cy={sc.tier_height/2}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_center_x}
          cy={sc.tier_height/2}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('a2o')}
        />


        <Line x1={sc.screen_center_x} y1={sc.tier_height*1.5+sc.node_radius} x2={sc.screen_sixth_x*2} y2={sc.tier_height*2.5-sc.node_radius} stroke={sc.teal} strokeWidth={sc.node_border_thickness} />
        <Line x1={sc.screen_center_x} y1={sc.tier_height*1.5+sc.node_radius} x2={sc.screen_sixth_x*4} y2={sc.tier_height*2.5-sc.node_radius} stroke={sc.teal} strokeWidth={sc.node_border_thickness} />
        { (index === 1) ? (
          <Circle
            cx={sc.screen_sixth_x}
            cy={sc.tier_height*1.5}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_sixth_x}
          cy={sc.tier_height*1.5}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('arc')}
        />
        { (index === 2) ? (
          <Circle
            cx={sc.screen_sixth_x*3}
            cy={sc.tier_height*1.5}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_sixth_x*3}
          cy={sc.tier_height * 1.5}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('two')}
        />
        { (index === 3) ? (
          <Circle
            cx={sc.screen_sixth_x*5}
            cy={sc.tier_height*1.5}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_sixth_x*5}
          cy={sc.tier_height * 1.5}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('obj')}
        />
        { (index === 4) ? (
          <Circle
            cx={sc.screen_sixth_x*2}
            cy={sc.tier_height * 2.5}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_sixth_x*2}
          cy={sc.tier_height * 2.5}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('abs')}
        />
        { (index === 5) ? (
          <Circle
            cx={sc.screen_sixth_x*4}
            cy={sc.tier_height * 2.5}
            r={sc.node_radius+sc.node_border_thickness}
            stroke={sc.orange}
            strokeWidth={sc.node_selection_thickness}
            fill={sc.clear}
          />
        ) : (null)}
        <Circle
          cx={sc.screen_sixth_x*4}
          cy={sc.tier_height * 2.5}
          r={sc.node_radius}
          stroke={sc.teal}
          strokeWidth={sc.node_border_thickness}
          fill={sc.clear}
          onPress={()=>get_model_info('ren')}
        />
      </Svg>
    );
  }

  return (
    <View style={ts.tree_info_page_container}>

        <TitleBar
          bgColor={sc.clear}
          buttonColor={sc.teal}
          statusColor={"dark"}
          left={'back'}
          leftPress={() => navigation.navigate('Home')}
          middle={'logo'}
          right={'camera'}
          rightPress={() => navigation.navigate('Home')}
        />

        <View style={[StyleSheet.absoluteFill, {top:sc.title_bar_height+sc.status_bar_height, alignItems: 'center'}]}>

          <Text style={[ts.node_text, {left:sc.screen_center_x -21, top:sc.tier_height/2  -15}]}>a2o</Text>
          <Text style={[ts.node_text, {left:sc.screen_sixth_x  -19, top:sc.tier_height*1.5-15}]}>arc</Text>
          <Text style={[ts.node_text, {left:sc.screen_sixth_x*3-22, top:sc.tier_height*1.5-15}]}>two</Text>
          <Text style={[ts.node_text, {left:sc.screen_sixth_x*5-20, top:sc.tier_height*1.5-15}]}>obj</Text>
          <Text style={[ts.node_text, {left:sc.screen_sixth_x*2-22, top:sc.tier_height*2.5-15}]}>abs</Text>
          <Text style={[ts.node_text, {left:sc.screen_sixth_x*4-19, top:sc.tier_height*2.5-15}]}>ren</Text>

          <ShowModelTree/>

          <View height={sc.margin_width*3}/>

          { (index !== -1) ? (
            <View style={ts.info_box}>
              <ScrollView>
                <Text/>
                <Card.Title style={ts.section_title}>{modelInfo.name}</Card.Title>
                <Card.Divider/>
                <Text style={ts.section_content}>Type: {modelInfo.type}</Text>
                <Card.Divider/>
                <Text style={ts.section_content}>Labels: {Functions.print_list(modelInfo.desc, "     ")}</Text>
                <Card.Divider/>
                <Text style={ts.section_content}>Average Precision: {modelInfo.accu}</Text>
                <Card.Divider/>
                <Text style={ts.section_content}>Size: {modelInfo.size} MB</Text>
              </ScrollView>
            </View>
          ) : (
            <View style={ts.info_box}>
              <ScrollView>
                <Text/>
                <ShowAllMovements nav={navigation}/>
              </ScrollView>
            </View>
            )
          }
        </View>

    </View>
  );
}

TreeInfo.navigationOptions = navigation => ({ headerShown: false });

export default TreeInfo;
