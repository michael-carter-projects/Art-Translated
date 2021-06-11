import { StatusBar } from 'expo-status-bar'

import React from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { Button, Card, Icon, ListItem } from 'react-native-elements'

export default class MovementInfo extends React.Component
{
  render()
  {
    function getMovementInfo(index) {

      const key = JSON.stringify(global.prediction[index].label)
      const num = JSON.stringify(global.prediction[index].prob)

      for (var i = 0; i < global.numMovements; i++) {
        if (global.movementMap[i].key === key.replace(/['"]+/g, ''))
        {
          const prob = (parseFloat(num)*100).toFixed(2)

          const info = {
            name: global.movementMap[i].name,
            prob: prob,
            path: global.movementMap[i].imagePath
          }

          return info;
        }
      }

    }


    const prediction = this.props.navigation.getParam('pred')

    const top3 = [getMovementInfo(0), getMovementInfo(1)] // etcetera

    return (
      <View style={styles.container}>

        <Card>
          <Card.Title style={{fontSize: 14}}> Movement: { top3[0].name } </Card.Title>
          <Card.Divider/>

          <Card.Title style={{fontSize: 14}}>Probability: { top3[0].prob }%</Card.Title>
          <Card.Divider/>

          <Card.Image source={ require("./assets/images/madonna.jpg") }>
          </Card.Image>

          <Text style={{marginBottom: 10, marginLeft: 160}}>
          {"                               "}
          </Text>
          <Button
            icon={<Icon name='arrow-drop-down' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title=' SEE DESCRIPTION' />

        </Card>

        <Card>
          <Card.Title style={{fontSize: 14}}>Movement: { top3[1].name }</Card.Title>
          <Card.Divider/>

          <Card.Title style={{fontSize: 14}}>Probability: { top3[1].prob }%</Card.Title>
          <Card.Divider/>

          <Card.Image source={require('./assets/images/madonna.jpg')}>
          </Card.Image>

          <Text style={{marginBottom: 10, marginLeft: 160}}>
          {"                               "}
          </Text>

          <Button
            icon={<Icon name='arrow-drop-down' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title=' SEE DESCRIPTION' />

        </Card>

        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
