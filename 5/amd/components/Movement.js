import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { Card, Icon } from 'react-native-elements'


function Movement ({route, navigation})
{
  const infoMap = navigation.state.params.infoMap;

  console.log(infoMap)

  return (
    <ScrollView style={{backgroundColor:'#555555'}}>
      <Card style={{backgroundColor:'#333333'}}>

        <Card.Title style={{textAlign: 'left'}}>Movement </Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.name}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Dates</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.dates}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Style</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.style}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Commentary</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.commentary}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Themes</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.themes}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Origin</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.start_reason}</Text>
        <Card.Divider/>

        <Card.Title style={{textAlign: 'left'}}>Fate</Card.Title>
        <Text style={{paddingBottom:15}}>{infoMap.end_reason}</Text>

      </Card>
      <View style={{paddingTop:30}}>
      </View>
    </ScrollView>
  );
}

Movement.navigationOptions = navigation => ({
  title: "Details",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});

export default Movement;
