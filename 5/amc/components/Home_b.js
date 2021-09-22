import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as Font             from 'expo-font';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';
import * as SplashScreen     from 'expo-splash-screen';
import { StatusBar }         from 'expo-status-bar';
import { Ionicons }          from '@expo/vector-icons';

import   React, { useState, useEffect, useCallback }       from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                       from 'react-native-progress';
import Svg, { Circle, Line }                               from 'react-native-svg';
import CameraRoll                                          from "@react-native-community/cameraroll";

import { PredictTree, LoadModelTree } from '../tree/prediction_tree.js';

import    { hs } from '../styles/home_styles.js';
import * as sc   from '../styles/style_constants.js';

let camera: Camera; // camera ref to allow abort

// ON STARTUP ==================================================================================================================
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
MediaLibrary.requestPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

// RENDER HOME SCREEN ==========================================================================================================
function Home ({navigation})
{
  const [isCameraScreen, setCameraScreen] = useState(true );
  const [inProgress,     setInProgress  ] = useState(false);
  const [appIsReady,     setAppIsReady  ] = useState(false);
  const [photosTitle,    setPhotosTitle ] = useState("Albums");

  // SELECT AN IMAGE, MAKE A PREDICTION, NAVIGATE & PASS PREDICTION ============================================================
  async function select_pic_and_predict_async(nav) {
    // PICK AN IMAGE FROM GALLERY OR CAMERA ROLL AND ALLOW USER TO CROP -----------------------
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality:1 });

    // IF THE USER DID NOT CANCEL IMAGE SELECTION, MAKE PREDICTION ----------------------------
    if (!photo.cancelled)
    {
      setInProgress(true); // set inProgress hook to true for progress bar

      // RESIZE IMAGE and CONVERT TO BASE 64 --------------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        photo.uri, [{resize: {width:224}}], {base64: true}
      );

      // CONVERT BASE^$ IMAGE TO TENSORS AND MAKE PREDICTION ----------------------------------
      const predictions = await PredictTree(base64);

      nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

      setInProgress(false); // reset inProgress hook to false
    }
  }

  // SELECT IMAGE, MAKE A PREDICTION, NAVIGATE & PASS PREDICTION ===============================================================
  async function take_pic_and_predict_async(nav) {
    if (camera) { // skip execution if camera is undefined/null

      let photo = await camera.takePictureAsync(); // take picture using camera
      setInProgress(true); // set inProgress hook to true for progress bar

      // CROP, RESIZE, and CONVERT IMAGE TO BASE 64 ---------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{crop:   {originX:30, originY:300, width:photo.width*0.9, height:photo.width*0.9}},
         {resize: {width:224}}],
        {base64: true}
      );

      // MAKE PREDICTION ------------------------------------------------------------------------
      const predictions = await PredictTree(base64);

      nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

      setInProgress(false); // reset inProgress hook to false
    }
    else {
      console.log('CAMERA ACCESS NOT GRANTED?')
    }
  }

  // LOAD ML MODEL TREE DURING SPLASH SCREEN ===================================================================================
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();  // Keep the splash screen visible while we fetch resources

        // LOAD FONTS ----------------------------------------------------------
        await Font.loadAsync({
          ArgentumSansLight: require('../assets/fonts/argentum-sans.light.ttf'),
          ArgentumSansRegular: require('../assets/fonts/argentum-sans.regular.ttf'),
        });
        console.log("[+] Fonts loaded")

        // LOAD MODEL TREE -----------------------------------------------------
        await LoadModelTree();

        // LOAD ALBUM THUMBNAILS -----------------------------------------------
        global.albums = await MediaLibrary.getAlbumsAsync();
        console.log("[+] Albums list loaded");

        let recentAssets = await MediaLibrary.getAssetsAsync({first:28});
        global.albumThumbnailURIs.push(recentAssets.assets[0].uri);

        for (let i=0; i < 28; i++) {
          global.recentURIs.push(recentAssets.assets[i].uri);
        }

        for (let i=0; i < global.albums.length; i++) {
          let albumAssets = await MediaLibrary.getAssetsAsync({album: global.albums[i].id});
          global.albumThumbnailURIs.push(albumAssets.assets[0].uri);
        }
        console.log('[+] '+ global.albumThumbnailURIs.length.toString() + ' album thumbnails generated');

        console.log("ALL ASSETS LOADED")
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();

  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  if (!appIsReady) {
    return null;
  }

  // COMPONENT FOR RENDERING CAMERA TITLE BAR ==================================================================================
  const CameraTitleBar = () => {
    return (
      <View style={hs.camera_title_bar}>

        <View style={{flex:1, alignItems:'center'}}>
          <Ionicons name="ios-close" color={sc.white} style={hs.close_icon}/>
        </View>

        <View style={{flex:1}}>
          <TouchableOpacity style={{alignItems:'center'}} onPress={ () => navigation.navigate('TreeInfo')}>
            <Ionicons name="md-help-circle" style={hs.help_button}/>
          </TouchableOpacity>
        </View>

        <StatusBar style="light" />
      </View>
    );
  }

  // COMPONENT FOR SHOWING PICTURE FRAME AND PROGRESS BAR ======================================================================
  const PictureFrameProgressBar = () => {
    return (
      <View style={hs.transparent_frame}>
        <View style={hs.photo_outline}/>

        { inProgress ?
          (
            <View style={{alignItems:'center', paddingTop: 20, justifyContent:'space-between'}}>
              <Text style={hs.progress_bar_text}>
                analyzing...
              </Text>
              <Text/>
              <Progress.Bar
                animationType={'timing'}
                borderRadius={15}
                borderWidth={5}
                color={sc.white}
                height={10}
                indeterminate={true}
                width={sc.card_width/2}
              />
            </View>
          ) : (null)
        }
      </View>
    );
  }

  // COMPONENT FOR TAKE PICTURE BUTTON =========================================================================================
  const TakePictureButton = () => {
    return (
        <View style={hs.button_panel}>
          <Svg>
            <Circle
              cx={sc.screen_width/2}
              cy={sc.take_pic_button_diameter/2}
              r={sc.take_pic_button_diameter/2}
              fill={sc.white}
            />
            <Circle
              cx={sc.screen_width/2}
              cy={sc.take_pic_button_diameter/2}
              r={sc.take_pic_button_diameter/2 - 4}
              fill={sc.teal}
            />
            <Circle
              cx={sc.screen_width/2}
              cy={sc.take_pic_button_diameter/2}
              r={sc.take_pic_button_diameter/2 - 8}
              fill={sc.orange}
            />
            <Circle
              cx={sc.screen_width/2}
              cy={sc.take_pic_button_diameter/2}
              r={sc.take_pic_button_diameter/2 - 10}
              fill={sc.white}
              onPress={() => take_pic_and_predict_async(navigation)}
            />
          </Svg>
        </View>
    );
  }

  // COMPONENT FOR PHOTOS PAGE TITLE BAR =======================================================================================
  const PhotosTitleBar = () => {
    return (

        <View style={hs.photo_title_bar}>

          <View style={{flex:1}}>
            { photosTitle === "Albums" ? (
              <Ionicons name="ios-close" color={sc.teal} style={hs.close_icon}/>
            ) : (
              <TouchableOpacity style={{alignItems:'center'}} onPress={() => setPhotosTitle("Albums")}>
                <Ionicons name="ios-arrow-back" style={hs.back_icon}/>
              </TouchableOpacity>
            )
            }
          </View>

          <View style={{flex:3, alignItems:'center'}}>
            <Text numberOfLines={1} style={hs.photo_title_bar_text}>{photosTitle}</Text>
          </View>

          <View style={{flex:1, alignItems:'center'}}/>
        </View>
    );
  }

  // COMPONENT FOR NAVIGATION BAR ==============================================================================================
  const NavigationPanel = () => {
    return (
      <View style={hs.nav_panel_outer}>

        { isCameraScreen ? ( <View style={hs.nav_selection_camera}/> )
                         : ( <View style={hs.nav_selection_photos}/> )
        }

        <View style={hs.nav_panel_inner}>

          <TouchableOpacity onPress={() => setCameraScreen(true)}>
            <View style={hs.nav_button}>
              <Text style={hs.nav_button_text}>Camera</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCameraScreen(false)}>
            <View style={hs.nav_button}>
              <Text style={hs.nav_button_text}>Photos</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  // COMPONENT FOR OVERLAYING PHOTOS PAGE ======================================================================================
  const PhotosPageOverlay = () => {
    return (
      <View style={hs.photo_selection_page}>

        <PhotosTitleBar/>

        <ScrollView style={{paddingTop:20}}>
          { photosTitle === "Albums" ? ( <ShowAlbums/> )
                                     : ( <ShowPhotos/> )
          }
        </ScrollView>

        <StatusBar style="dark" />
      </View>
    );
  }

  // COMPONENT FOR SHOWING LIST OF ALBUMS IN PHOTOS PAGE =======================================================================
  const ShowAlbums = () => {

    let albumViews = [
      <TouchableOpacity key="Recents" onPress={() => setPhotosTitle("Recents")}>
        <View style={hs.album_card}>
          <Image source={{uri: global.albumThumbnailURIs[0]}} style={hs.image}/>
          <Text style={hs.album_name_text}>Recents</Text>
          <Text style={hs.album_image_count_text}>{123456} images</Text>
        </View>
        <View height={sc.margin_width}/>
      </TouchableOpacity>
    ];
    for (let i=0; i < global.albums.length; i++) {
      albumViews.push(
        <TouchableOpacity key={global.albums[i].id} onPress={() => setPhotosTitle(global.albums[i].title)}>
          <View style={hs.album_card}>
            <Image source={{uri: global.albumThumbnailURIs[i+1]}} style={hs.image}/>
            <Text style={hs.album_name_text}>{ global.albums[i].title }</Text>
            <Text style={hs.album_image_count_text}>{ global.albums[i].assetCount } images</Text>
          </View>
          <View height={sc.margin_width}/>
        </TouchableOpacity>
      );
    }
    return albumViews;
  }

  // COMPONENT FOR SHOWING PHOTOS IN ALBUM IN PHOTOS PAGE ======================================================================
  const ShowPhotos = () => {
    return (
      <View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[0]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[1]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[2]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[3]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[4]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[5]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[6]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[7]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[8]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[9]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[10]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[11]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[12]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[13]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[14]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[15]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[16]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[17]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[18]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[19]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[20]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[21]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[22]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[23]}} style={hs.image}/>
        </View>
        <View style={hs.image_row}>
          <Image source={{uri: global.recentURIs[24]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[25]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[26]}} style={hs.image}/>
          <Image source={{uri: global.recentURIs[27]}} style={hs.image}/>
        </View>
      </View>
    );
  }

  // WHERE THE MAGIC HAPPENS ===================================================================================================
  return (
    <View onLayout={onLayoutRootView} style={{flex: 1}}>

      <Camera style={hs.camera_view} ref={(r) => { camera = r }}>
        <PictureFrameProgressBar/>
        <TakePictureButton/>
      </Camera>

      { isCameraScreen ? ( <CameraTitleBar/>    )
                       : ( <PhotosPageOverlay/> )
      }

      <NavigationPanel/>
    </View>
  );
}

Home.navigationOptions = navigation => ({ headerShown: false });

export default Home;