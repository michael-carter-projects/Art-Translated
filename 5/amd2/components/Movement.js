import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, Icon } from 'react-native-elements'


function Movement ({navigation})
{
  const infoMap = navigation.state.params.infoMap;
  const color1  = navigation.state.params.color1;
  const color2  = navigation.state.params.color2;

  return (
    <ImageBackground source={require('./assets/images/bg3.png')} style={{flex: 1, width:"100%", alignItems: 'center'}}>
      <ScrollView>
        <View style={styles.outer_view}>

            <View style={inner_rounded_box(color1, color2)}>
              <Text/>
              <Card.Title style={styles.section_title}>Movement </Card.Title>
              <Text style={styles.section_content}>{infoMap.name}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Dates</Card.Title>
              <Text style={styles.section_content}>{infoMap.dates}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Style</Card.Title>
              <Text style={styles.section_content}>{infoMap.style}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Commentary</Card.Title>
              <Text style={styles.section_content}>{infoMap.commentary}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Themes</Card.Title>
              <Text style={styles.section_content}>{infoMap.themes}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Origin</Card.Title>
              <Text style={styles.section_content}>{infoMap.start_reason}</Text>
              <Card.Divider/>

              <Card.Title style={styles.section_title}>Fate</Card.Title>
              <Text style={styles.section_content}>{infoMap.end_reason}</Text>
            </View>


        </View>
        <View style={{paddingTop:30}}>
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </ImageBackground>
  );
}

Movement.navigationOptions = navigation => ({
  title: "Details",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});

const text_color = '#ffffff'

const styles = StyleSheet.create({
  outer_view: {
    alignItems: 'center',
    flex: 1,
    paddingLeft:   15,
    paddingRight:  15,
    paddingTop:    15,
    paddingBottom: 15,
  },
  section_title: {
    fontSize: 16,
    textAlign: 'left',
    color: text_color
  },
  section_content: {
    color: text_color,
    fontSize: 16,
    paddingBottom: 15,
    textAlign: 'left',
  },
})

function inner_rounded_box (color1, color2) {
  return {
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
function outer_rounded_box (color) {
  return {
    backgroundColor: color,
    paddingTop:    10,
    paddingBottom: 10,
    paddingLeft:   10,
    paddingRight:  10,
    borderTopLeftRadius:     25,
    borderTopRightRadius:    25,
    borderBottomLeftRadius:  25,
    borderBottomRightRadius: 25
  }
}

export default Movement;
