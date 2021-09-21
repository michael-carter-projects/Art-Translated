import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as Font             from 'expo-font';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';
import * as SplashScreen     from 'expo-splash-screen';
import { StatusBar }         from 'expo-status-bar';
import { Ionicons }          from '@expo/vector-icons';

import   React, { useState, useEffect, useCallback }                 from 'react';
import { Image, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                 from 'react-native-progress';
import Svg, { Circle, Line }                                         from 'react-native-svg';
import CameraRoll                                                    from "@react-native-community/cameraroll";

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

  const [displayImages, setDisplayImages] = useState([]);

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

        var recentURIs = [];

        for (let i=0; i < 28; i++) {
          recentURIs.push({
            id: i,
            uri: recentAssets.assets[i].uri
          });
        }

        setDisplayImages(recentURIs);

        console.log(displayImages);

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

        <View style={{paddingTop:sc.margin_width, paddingBottom: sc.navigation_bar_height+8}}>
          { photosTitle === "Albums" ? ( <ShowAlbums/> )
                                     : ( <ShowPhotos/> )
          }
        </View>

        <StatusBar style="dark" />
      </View>
    );
  }

  // COMPONENT FOR SHOWING LIST OF ALBUMS IN PHOTOS PAGE =======================================================================
  const ShowAlbums = () => {

    let albumViews = [
      <TouchableOpacity key="Recents" onPress={() => setPhotosTitle("Recents")}>
        <View style={hs.album_card}>
          <Image source={{uri: global.albumThumbnailURIs[0]}} style={hs.album_image}/>
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
            <Image source={{uri: global.albumThumbnailURIs[i+1]}} style={hs.album_image}/>
            <Text style={hs.album_name_text}>{ global.albums[i].title }</Text>
            <Text style={hs.album_image_count_text}>{ global.albums[i].assetCount } images</Text>
          </View>
          <View height={sc.margin_width}/>
        </TouchableOpacity>
      );
    }
    return albumViews;
  }










  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: '1 Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: '2 Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '3 Item',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abwefwefb28ba',
      title: '4 Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd9wtrhwrthaa97f63',
      title: '5 Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96uiuyjy-145571e29d72',
      title: '6 Item',
    },
    {
      id: 'rgb-c1b1-46c2-aed5-3ad53abb28ba',
      title: '7 Item',
    },
    {
      id: '3ac68afc-eregr-48d3-a4f8-fbd91aa97f63',
      title: '8 Item',
    },
    {
      id: '58694a0f-3da1-4ergrer71f-bd96-145571e29d72',
      title: '9 Item',
    },
    {
      id: 'bd7acbea-c1b1-46c2-e54b6yb-3ad53abwefwefb28ba',
      title: '10 Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd9wtrhwrthaa97f63',
      title: '11 Item',
    },
    {
      id: '586944a0f-3da1-471f-65n7-145571e29d72',
      title: '12 Item',
    },
    {
      id: 'bd7acbea-c1b1-4645b6hc2-aed5-3ad53abb28ba',
      title: '1 Item',
    },
    {
      id: '3ac68afc-c605-48dh53-a4f8-fbd91aa97f63',
      title: '2 Item',
    },
    {
      id: '58694a0f-3da1-471f-bd9d6-145571e29d72',
      title: '3 Item',
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad5sg3abwefwefb28ba',
      title: '4 Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd9wherhtrhwrthaa97f63',
      title: '5 Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96uerhiuyjy-145571e29d72',
      title: '6 Item',
    },
    {
      id: 'rgb-c1b1-46c2-aed5-3ad53v3abb28ba',
      title: '7 Item',
    },
    {
      id: '3ac68afc-eregr-48d3-a4f8-f34tvbd91aa97f63',
      title: '8 Item',
    },
    {
      id: '58694a0f-3da1-4ergrer71f-bd96-3v145571e29d72',
      title: '9 Item',
    },
    {
      id: 'bd7acbea-c1b1-46c2-e54b6yb-3a3v4t53abwefwefb28ba',
      title: '10 Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd9wt3rhwrthaa97f63',
      title: '11 Item',
    },
    {
      id: '58694a0f-3da1-471f-65n7-1455734t1e29d72',
      title: '12 Item',
    },
      {
        id: 'bd7acbea-c1b1234-46c2-aed5-3ad53abb28ba',
        title: '1 Item',
      },
      {
        id: '3ac68afc-c605-48879d3-a4f8-fbd91aa97f63',
        title: '2 Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14559571e29d72',
        title: '3 Item',
      },
      {
        id: 'bd7acbea-c1b1-421346c2-aed5-3ad53abwefwefb28ba',
        title: '4 Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd9wtr576hwrthaa97f63',
        title: '5 Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96uiuyjy-1486975571e29d72',
        title: '6 Item',
      },
      {
        id: 'rgb-c1b1-46c2-aed5-3ad879853abb28ba',
        title: '7 Item',
      },
      {
        id: '3ac68afc-eregr-48d3-a4f8-fbd91a34ga97f63',
        title: '8 Item',
      },
      {
        id: '58694a0f-3da1-4ergrer71f-bd96-145234v571e29d72',
        title: '9 Item',
      },
      {
        id: 'bd7acbea-c1b1-46c2-e54b6yb-3ad53a23v45bwefwefb28ba',
        title: '10 Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd9w234v5trhwrthaa97f63',
        title: '11 Item',
      },
      {
        id: '586944a0f-3da1-471f-65n7-1455712v34e29d72',
        title: '12 Item',
      },
      {
        id: 'bd7acbea-c1b1-4645b6hc2-aed5-3ad53a234fbb28ba',
        title: '1 Item',
      },
      {
        id: '3ac68afc-c605-48dh53-a4f8-fbd3f491aa97f63',
        title: '2 Item',
      },
      {
        id: '58694a0f-3da1-471f-bd9d63f4-145571e29d72',
        title: '3 Item',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad34f5sg3abwefwefb28ba',
        title: '4 Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd9w3345fherhtrhwrthaa97f63',
        title: '5 Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96uerh34f5iuyjy-145571e29d72',
        title: '6 Item',
      },
      {
        id: 'rgb-c1b1-46c2-aed5-3ad53vjytdt73abb28ba',
        title: '7 Item',
      },
      {
        id: '3ac68afc-eregr-48d3-a4f8-f37nti4tvbd91aa97f63',
        title: '8 Item',
      },
      {
        id: '58694a0f-3da1-4ergrer71ni7f-bd96-3v145571e29d72',
        title: '9 Item',
      },
      {
        id: 'bd7acbea-c1b1-46c2-e54b66rnyb-3a3v4t53abwefwefb28ba',
        title: '10 Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-frn6bd9wt3rhwrthaa97f63',
        title: '11 Item',
      },
      {
        id: '58694a0f-3da1-471f-65n7-1rnh455734t1e29d72',
        title: '12 Item',
      },
  ];

  const ImgButton = ({ id }) => (
    <TouchableOpacity>
      <Image source={{uri: displayImages[id].uri}} style={hs.photo_button}>
      </Image>
    </TouchableOpacity>
  );

  // COMPONENT FOR SHOWING PHOTOS IN ALBUM IN PHOTOS PAGE ======================================================================
  const ShowPhotos = () => {
    let photoViews = [];

    const renderImage = ({ item }) => <ImgButton id={item.id} />;

    return (
      <FlatList data={displayImages} renderItem={renderImage} keyExtractor={item => item.id} numColumns={4} extraData={displayImages}/>
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
