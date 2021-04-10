import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground} from 'react-native'
import AwesomeButton from "react-native-really-awesome-button";
import * as ImagePicker from 'expo-image-picker';

export default class PhotoPreview extends React.Component {
  render() {
    const photo = this.props.navigation.getParam('img')
    const backToCamera = this.props.navigation.getParam('cam')

    const __selectImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);

      if (!result.cancelled) {
        this.props.navigation.navigate('PhotoPreview', {img: result, cam: false})
      }
    };

    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              padding: 50,
              justifyContent: 'space-between'
            }}
          >
            <AwesomeButton
              //progress
              stretch
              backgroundColor={'#323264'}
              backgroundDarker={'#161632'}
              borderRadius={80}
              textSize={20}
              fontFamily={'System'}
              onPress={ () => this.props.navigation.navigate('MovementInfo') }
            >Predict movement
            </AwesomeButton>
            <View height={10}/>

            { backToCamera ? (
              <AwesomeButton
                  stretch
                  backgroundColor={'#993232'}
                  backgroundDarker={'#501616'}
                  borderRadius={80}
                  textSize={20}
                  fontFamily={'System'}
                  onPress={
                    () => this.props.navigation.navigate('HomeCamera')
                  }
              >Re-take photo
              </AwesomeButton>
            ) : (
              <AwesomeButton
                  stretch
                  backgroundColor={'#993232'}
                  backgroundDarker={'#501616'}
                  borderRadius={80}
                  textSize={20}
                  fontFamily={'System'}
                  onPress={__selectImage}
                >Re-select image
                </AwesomeButton>
              )}
            </View>
          </ImageBackground>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const BASE_SIZE = 110

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo_options_container:{
    width: BASE_SIZE,
    height: BASE_SIZE,
    alignItems: 'center',
  }
})
