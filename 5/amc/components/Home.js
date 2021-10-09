import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as Font             from 'expo-font';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary     from 'expo-media-library';
import * as SplashScreen     from 'expo-splash-screen';

import   React, { useState, useEffect, useCallback, useRef }         from 'react';
import { ActivityIndicator, Image, FlatList, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                 from 'react-native-progress';
import Svg, { Circle }                                               from 'react-native-svg';

import { run_predict_tree, load_model_tree } from '../assets/model_tree/ModelTree.js';

import { TitleBar }   from '../helpers/title_bar.js'

import    { hs } from '../styles/home_styles.js';
import * as sc   from '../styles/style_constants.js';

let camera: Camera; // camera ref to allow abort


// iwuehfiwuehfiwuehfiwuegfiwuegf
var albums = [{id: "recents", title:"Recents"}];
var albumThumbnailURIs = [];

// ON STARTUP ==================================================================================================================
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
MediaLibrary.requestPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)


// SELECT AN IMAGE, MAKE A PREDICTION, NAVIGATE & PASS PREDICTION ==============================================================
async function select_pic_and_predict_async(nav, uri) {

  //setInProgress(true); // set inProgress hook to true for progress bar

  // RESIZE IMAGE and CONVERT TO BASE 64 --------------------------------------------------
  const { newUri, width, height, base64 } = await ImageManipulator.manipulateAsync(
    uri, [{resize: {width:224}}], {base64: true}
  );
  // CONVERT BASE64 IMAGE TO TENSORS AND MAKE PREDICTION ----------------------------------
  const predictions = await run_predict_tree(base64);

  nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

  //setInProgress(false); // reset inProgress hook to false
}
// RENDERS A SINGLE IMAGE IN THE PHOTOS PAGE THAT CAN BE SELECTED TO MAKE PREDICTION ===========================================
function ImgButton(props) {
	return (
		<TouchableOpacity onPress={() => select_pic_and_predict_async(props.nav, props.img.uri)}>
			<Image source={{uri:props.img.uri}} style={hs.photo_button}/>
		</TouchableOpacity>
	);
}

// RENDER HOME SCREEN ==========================================================================================================
function Home ({navigation}) {

  const [isCameraScreen, setCameraScreen] = useState(true );
  const [inProgress,     setInProgress  ] = useState(false);
  const [appIsReady,     setAppIsReady  ] = useState(false);

  const [photosTitle,    setPhotosTitle ] = useState("Albums");
  const [album,          setAlbum       ] = useState();

  const [displayImages,  setDisplayImages ] = useState();
  const [lastAsset,      setLastAsset     ] = useState();
  const [refreshing,     setRefreshing    ] = useState(false);
  const [showRefreshing, setShowRefreshing] = useState(false);

  const total_images_loaded   = useRef(0);
  const total_images_in_album = useRef(0);
  const recents_image_count   = useRef(0);

  const [takenPhoto, setTakenPhoto] = useState(null);

  const [cropping, setCropping] = useState(false);

  // FETCH THE FIRST 36 IMAGES IN AN ALBUM =====================================================================================
  const fetch_initial_images = async (album_id) => {

    if (album_id === "recents") {
      var recentAssets = await MediaLibrary.getAssetsAsync({first:36});
    } else {
      var recentAssets = await MediaLibrary.getAssetsAsync({first:36, album:album_id});
    }

    if (!recentAssets) return;
    var recentURIs = [];

    for (let i=0; i < 36; i++) {
      if (recentAssets.assets[i] !== undefined) {
        recentURIs.push({
          id: total_images_loaded.current,
          uri: recentAssets.assets[i].uri,
        });
        total_images_loaded.current++;
      }
    }
    total_images_in_album.current = recentAssets.totalCount;
    setDisplayImages(recentURIs);
    setLastAsset(recentAssets.endCursor);
  }
  // FETCH THE "NEXT" 36 IMAGES IN THE CURRENT ALBUM ===========================================================================
  const fetch_more_images = async (reset: boolean) => {

    // RETREIVE FIRST PAGE OF PHOTOS FROM LIBRARY AGAIN AND RESET PAGE --------------------------------------
    if (reset === true) {
      total_images_loaded.current = 0;
      fetch_initial_images(album.id);
      return;
    }

    // ENSURE FUNCTION RETURNS NOTHING WHEN THERE ARE NO MORE IMAGES TO LOAD --------------------------------
    if (total_images_loaded.current >= total_images_in_album.current) return;

    // FETCH THE NEXT 36 IMAGES IN THE ALBUM ----------------------------------------------------------------
    if (album.id === "recents") {
      var recentAssets = await MediaLibrary.getAssetsAsync({ first:36, after:lastAsset});
    } else {
      var recentAssets = await MediaLibrary.getAssetsAsync({ first:36, after:lastAsset, album:album.id});
    }
    if (!recentAssets) return; // if MediaLibrary did not return properly, return nothing

    var recentURIs = displayImages; // copy displayImages to local variable
    recentURIs.pop(); // remove "undefined" that shows up at the end of displayImages list

    for (let i=0; i < 36; i++) {
      if (recentAssets.assets[i] !== undefined) {
        recentURIs.push({
          id: total_images_loaded.current,
          uri: recentAssets.assets[i].uri,
        });
        total_images_loaded.current++;
      }
    }

    // UPDATE HOOKS THAT CONTROL PHOTO SCROLL ---------------------------------------------------------------
    setDisplayImages(recentURIs);
    setLastAsset(recentAssets.endCursor);

    return displayImages;
  }
  // HANDLES WHETHER OR NOT TO GET MORE IMAGES AND UPDATES DISPLAYIMAGES HOOK ==================================================
  const update_flatlist = async () => {

    const newDisplayImages = await fetch_more_images(false);
    if(newDisplayImages === null) return;
    setDisplayImages(displayImages.concat(newDisplayImages));
  }
  // RUN WHEN END OF IMAGE SCROLL IS REACHED ===================================================================================
  const on_end_reached = async () => {

    if (refreshing || total_images_in_album.current < 36) return;
    setRefreshing(true)
    update_flatlist().then(() => {
      setRefreshing(false)
    })
  }
  // RUN WHEN USER CLICKS ON AN ALBUM ==========================================================================================
  const open_album = async (album) => {
    await fetch_initial_images(album.id);
    setPhotosTitle(album.title);
    setAlbum(album);
  };
  // RUN WHEN USE "REFRESHES" THE PHOTOS PAGE ==================================================================================
  const on_refresh = useCallback(async () => {

    setShowRefreshing(true);
    await fetch_more_images(true);
    setShowRefreshing(false);
  }, [refreshing]);

  // LOAD ASSETS DURING SPLASH SCREEN ==========================================================================================
  useEffect(() => {
    async function prepare() {
      try {
        console.log("Loading assets....")

        await SplashScreen.preventAutoHideAsync();  // Keep the splash screen visible while we fetch resources

        // LOAD FONTS ----------------------------------------------------------
        await Font.loadAsync({
          ArgentumSansLight: require('../assets/fonts/argentum-sans.light.ttf'),
          ArgentumSansRegular: require('../assets/fonts/argentum-sans.regular.ttf'),
        });

        // LOAD ALBUM THUMBNAILS -----------------------------------------------
        albums = await MediaLibrary.getAlbumsAsync();

        let recentAssets = await MediaLibrary.getAssetsAsync({first:36});
        recents_image_count.current = recentAssets.totalCount;

        albumThumbnailURIs.push(recentAssets.assets[0].uri);
        for (let i=0; i < albums.length; i++) {
          let albumAssets = await MediaLibrary.getAssetsAsync({album: albums[i].id});
          albumThumbnailURIs.push(albumAssets.assets[0].uri);
        }
        // LOAD MODEL TREE -----------------------------------------------------
        await load_model_tree();

        console.log("== APP IS READY ==")

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

  // TAKE PHOTO, MAKE A PREDICTION, NAVIGATE & PASS PREDICTION =================================================================
  async function take_pic_and_predict_async(nav) {
    if (camera) { // skip execution if camera is undefined/null

      let photo = await camera.takePictureAsync(); // take picture using camera
      setInProgress(true); // set inProgress hook to true for progress bar

      // CROP, RESIZE, and CONVERT IMAGE TO BASE 64 ---------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{crop:   {originX:photo.width*0.05, originY:870, width:photo.width*0.9, height:photo.width*0.9}},
         {resize: {width:224}}],
        {base64: true}
      );
      // MAKE PREDICTION ------------------------------------------------------------------------
      const predictions = await run_predict_tree(base64);

      nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

      setInProgress(false); // reset inProgress hook to false
    }
    else {
      console.log('CAMERA ACCESS NOT GRANTED?')
    }
  }
  // TAKE PHOTO AND DISPLAY ON HOME SCREEN FOR DEBUGGING OR FUTURE =============================================================
  async function take_pic_and_display_async() {
    if (camera) { // skip execution if camera is undefined/null

      let photo = await camera.takePictureAsync(); // take picture using camera

      // CROP, RESIZE, and CONVERT IMAGE TO BASE 64 ---------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{crop:   {originX:photo.width*0.05, originY:870, width:photo.width*0.9, height:photo.width*0.9}},
         {resize: {width:224}}],
        {base64: true}
      );
      setTakenPhoto(uri);
    }
    else {
      console.log('CAMERA ACCESS NOT GRANTED?')
    }
    /*
    { takenPhoto !== null ? (
      <View style={{position:'absolute', top: sc.screen_width*0.45}}>
        <Image source={{uri:takenPhoto}} style={[{resizeMode:'contain'}, hs.photo_outline]}/>
      </View>
    ) : ( null )
    }
    */
  }

  // COMPONENT FOR SHOWING PICTURE FRAME AND PROGRESS BAR ======================================================================
  function PictureFrameProgressBar() {
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
  function TakePictureButton() {
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
  // COMPONENT FOR NAVIGATION BAR ==============================================================================================
  function NavigationPanel() {
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
  // COMPONENT FOR SHOWING LIST OF ALBUMS IN PHOTOS PAGE =======================================================================
  function ShowAlbums() {

    let albumViews = [
      <TouchableOpacity key="Recents" onPress={() => open_album({id:"recents", title:"Recents"})}>
        <View style={hs.album_card}>
          <Image source={{uri: albumThumbnailURIs[0]}} style={hs.album_image}/>
          <Text style={hs.album_name_text}>Recents</Text>
          <Text style={hs.album_image_count_text}>{recents_image_count.current} images</Text>
        </View>
        <View height={sc.margin_width}/>
      </TouchableOpacity>
    ];
    for (let i=0; i < albums.length; i++) {
      albumViews.push(
        <TouchableOpacity key={albums[i].id} onPress={() => open_album(albums[i])}>
          <View style={hs.album_card}>
            <Image source={{uri: albumThumbnailURIs[i+1]}} style={hs.album_image}/>
            <Text style={hs.album_name_text}>{ albums[i].title }</Text>
            <Text style={hs.album_image_count_text}>{ albums[i].assetCount } images</Text>
          </View>
          <View height={sc.margin_width}/>
        </TouchableOpacity>
      );
    }
    return (
      <ScrollView>
        {albumViews}
      </ScrollView>
    );
  }


  // WHERE THE MAGIC HAPPENS ===================================================================================================
  return (
    <View onLayout={onLayoutRootView} style={{flex: 1, alignItems: 'center'}}>

      <Camera style={hs.camera_view} ref={(r) => { camera = r }}>
        <PictureFrameProgressBar/>
        <TakePictureButton/>
      </Camera>

      { isCameraScreen
        ? ( <TitleBar
              bgColor={sc.clear}
              buttonColor={sc.white}
              statusColor={'light'}
              left={null}
              leftPress={null}
              middle={null}
              right={'help'}
              rightPress={() => navigation.navigate('TreeInfo')}
            />
          )
        : ( <View style={hs.photo_selection_page}>

              { photosTitle === 'Albums' ?
                (
                  <TitleBar
                    bgColor={sc.white}
                    buttonColor={sc.teal}
                    statusColor={'dark'}
                    left={null}
                    leftPress={null}
                    middle={photosTitle}
                    right={null}
                    rightPress={null}
                  />
                ) :
                (
                  <TitleBar
                    bgColor={sc.white}
                    buttonColor={sc.teal}
                    statusColor={'dark'}
                    left={'back'}
                    leftPress={() => setPhotosTitle('Albums')}
                    middle={photosTitle}
                    right={'camera'}
                    rightPress={() => setCameraScreen(true)}
                  />
                )
              }

              <View style={hs.photos_page_safe_area_view}>
                { photosTitle === 'Albums'
                  ? ( <ShowAlbums/> )
                  : (
                      <FlatList
                    		data={displayImages}
                        refreshing={refreshing}
                        refreshControl={<RefreshControl refreshing={showRefreshing} onRefresh={on_refresh}/>}
                    		onEndReached={on_end_reached}
                    		onEndReachedThreshold={1}
                    		keyExtractor={(item, index) => item + index}
                    		renderItem={({ item }) => <ImgButton nav={navigation} img={item} />}
                    		numColumns={sc.images_per_row}
        	            />
                    )
                }
              </View>
            </View>
          )
      }
      <NavigationPanel/>
    </View>
  );
}

Home.navigationOptions = navigation => ({ headerShown: false });

export default Home;
