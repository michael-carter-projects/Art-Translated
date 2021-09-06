import { StatusBar } from 'expo-status-bar';

import   React, { useState, useEffect, useCallback }                       from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text as TextRN} from 'react-native';
import { Card }                                                            from 'react-native-elements'
import Svg, { Circle, Line, Text }                                         from 'react-native-svg';

function print_list(movements) {
  var string = "\n";
  for (var i=0; i < movements.length-1; i++) {
    string += "     " + movements[i] + "\n";
  }
  string += "     " + movements[movements.length-1];

  return string;
}

function TreeInfo ({navigation})
{
  const [modelInfo, setModelInfo] = useState(global.treeInfo.a2o);
  const [color1, setColor1] = useState(colors.dark1);
  const [color2, setColor2] = useState(colors.dark2);
  const [index, setIndex] = useState(0);

  function get_model_info(abbr)
  {
    var model = null;

    switch (abbr) {
      case 'a2o':
        model = global.treeInfo.a2o;
        if (index === 0) { setIndex(-1); }
        else             { setIndex(0);  }
        setColor1(colors.dark1);
        setColor2(colors.dark2);
        break;
      case 'arc':
        model = global.treeInfo.arc;
        if (index === 1) { setIndex(-1); }
        else             { setIndex(1);  }
        setColor1(colors.med1);
        setColor2(colors.med2);
        break;
      case 'two':
        model = global.treeInfo.two;
        if (index === 2) { setIndex(-1); }
        else             { setIndex(2);  }
        setColor1(colors.med1);
        setColor2(colors.med2);
        break;
      case 'obj':
        model = global.treeInfo.obj;
        if (index === 3) { setIndex(-1); }
        else             { setIndex(3);  }
        setColor1(colors.med1);
        setColor2(colors.med2);
        break;
      case 'abs':
        model = global.treeInfo.abs;
        if (index === 4) { setIndex(-1); }
        else             { setIndex(4);  }
        setColor1(colors.med1);
        setColor2(colors.med2);
        break;
      case 'ren':
        model = global.treeInfo.ren;
        if (index === 5) { setIndex(-1); }
        else             { setIndex(5);  }
        setColor1(colors.lite1);
        setColor2(colors.lite2);
        break;
      default:
        model = null;
        setIndex(-1);
        break;
    }
    setModelInfo(model);
  }

  return (
    <ImageBackground source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>
        <View style={[
            StyleSheet.absoluteFill,
            { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
        ]}>

          <Svg height="40%" width="100%">

            <Line x1={center} y1={tier_height/2} x2={tier6th*1} y2={tier_height*1.5} stroke={colors.dark2} strokeWidth="5" />
            <Line x1={center} y1={tier_height/2} x2={tier6th*3} y2={tier_height*1.5} stroke={colors.dark2} strokeWidth="5" />
            <Line x1={center} y1={tier_height/2} x2={tier6th*5} y2={tier_height*1.5} stroke={colors.dark2} strokeWidth="5" />
            { (index === 0) ? (
              <Circle
                cx={center}
                cy={tier_height/2}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={center}
              cy={tier_height/2}
              r="30"
              stroke={colors.dark2}
              strokeWidth="5"
              fill={colors.dark1}
              onPress={()=>get_model_info('a2o')}
            />

            <Text x={center} y={tier_height/2 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>a2o</Text>



            <Line x1={center} y1={tier_height*1.5} x2={tier6th*2} y2={tier_height*2.5} stroke={colors.med2} strokeWidth="5" />
            <Line x1={center} y1={tier_height*1.5} x2={tier6th*4} y2={tier_height*2.5} stroke={colors.med2} strokeWidth="5" />
            { (index === 1) ? (
              <Circle
                cx={tier6th}
                cy={tier_height*1.5}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={tier6th}
              cy={tier_height*1.5}
              r="30"
              stroke={colors.med2}
              strokeWidth="5"
              fill={colors.med1}
              onPress={()=>get_model_info('arc')}
            />

            <Text x={tier6th} y={tier_height*1.5 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>arc</Text>
            { (index === 2) ? (
              <Circle
                cx={tier6th*3}
                cy={tier_height*1.5}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={tier6th*3}
              cy={tier_height * 1.5}
              r="30"
              stroke={colors.med2}
              strokeWidth="5"
              fill={colors.med1}
              onPress={()=>get_model_info('two')}
            />

            <Text x={tier6th*3} y={tier_height*1.5 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>two</Text>
            { (index === 3) ? (
              <Circle
                cx={tier6th*5}
                cy={tier_height*1.5}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={tier6th*5}
              cy={tier_height * 1.5}
              r="30"
              stroke={colors.med2}
              strokeWidth="5"
              fill={colors.med1}
              onPress={()=>get_model_info('obj')}
            />

            <Text x={tier6th*5} y={tier_height*1.5 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>obj</Text>

            { (index === 4) ? (
              <Circle
                cx={tier6th*2}
                cy={tier_height * 2.5}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={tier6th*2}
              cy={tier_height * 2.5}
              r="30"
              stroke={colors.lite2}
              strokeWidth="5"
              fill={colors.lite1}
              onPress={()=>get_model_info('abs')}
            />

            <Text x={tier6th*2} y={tier_height*2.5 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>abs</Text>
            { (index === 5) ? (
              <Circle
                cx={tier6th*4}
                cy={tier_height * 2.5}
                r="35"
                stroke={'rgba(255, 255, 255, 1)'}
                strokeWidth="3"
                fill={'rgba(0, 0, 0, 0)'}
              />
            ) : (null)}
            <Circle
              cx={tier6th*4}
              cy={tier_height * 2.5}
              r="30"
              stroke={colors.lite2}
              strokeWidth="5"
              fill={colors.lite1}
              onPress={()=>get_model_info('ren')}
            />

            <Text x={tier6th*4} y={tier_height*2.5 +6} fill={'#ffffff'} fontSize="24" stroke={'rgba(0,0,0,0)'} textAnchor='middle'>ren</Text>


          </Svg>

          { (index !== -1) ? (
            <View style={rounded_box(color1, color2)}>
              <ScrollView>
                <TextRN/>
                <Card.Title style={styles.section_title}>{modelInfo.name}</Card.Title>
                <Card.Divider/>

                <TextRN style={styles.section_content}>Type: {modelInfo.type}</TextRN>
                <Card.Divider/>

                <TextRN style={styles.section_content}>Labels: {print_list(modelInfo.desc)}</TextRN>
                <Card.Divider/>

                <TextRN style={styles.section_content}>Average Precision: {modelInfo.accu}</TextRN>
                <Card.Divider/>

                <TextRN style={styles.section_content}>Size: {modelInfo.size} MB</TextRN>
              </ScrollView>
            </View>
          ) : ( null )
          }
          <TextRN/>

      </View>



      <StatusBar style="light" />
    </ImageBackground>


  );
}

TreeInfo.navigationOptions = navigation => ({
  title: "Tree Info",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});

const win = Dimensions.get('window');

const tier6th = win.width/6;

const center = win.width / 2;
const tier_height = 100;
const colors = {
  dark1: '#202042',
  dark2: '#080816',
  med1:  '#323264',
  med2:  '#161632',
  lite1: '#484880',
  lite2: '#282852',
  ul1:   '#565692',
  ul2:   '#404074',
  text:  '#ffffff'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section_title: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.text
  },
  section_content: {
    color: colors.text,
    fontSize: 16,
    paddingBottom: 15,
    textAlign: 'left',
  },
})

function rounded_box(color1, color2) {
  return {
    width: win.width-30,
    height: win.width-30,
    backgroundColor: color1,
    paddingLeft:  15,
    paddingRight: 15,
    borderColor: color2,
    borderWidth: 5,
    borderTopLeftRadius:     15,
    borderTopRightRadius:    15,
    borderBottomLeftRadius:  15,
    borderBottomRightRadius: 15
   }
}

export default TreeInfo;
