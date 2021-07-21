import { StatusBar } from 'expo-status-bar'

import React                                      from 'react'
import { ImageBackground, StyleSheet, Text, View} from 'react-native'

function TreeInfo ({navigation})
{
  return (
    <ImageBackground source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>
      <View style={styles.container}>

        <Text style={{color:'rgba(255,255,255,1)'}}>YOUR TreeInfo</Text>

        <StatusBar style="light" />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TreeInfo;
