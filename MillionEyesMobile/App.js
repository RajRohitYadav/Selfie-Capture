/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { RNCamera } from 'react-native-camera';
const axios = require('axios');
import FormData from 'form-data';


import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Button,
  Image,
  ImageBackground,
  ActivityIndicator
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      screenState: 1,
      imageUri: undefined,
      isLoading: false,
      fileUploadSuccess: false
    }
  }
  takePicture = async () => {
    if (this.camera) {

      const { uri } = await this.camera.takePictureAsync();
      let file = new FormData();

      this.setState({ 
        imageUri: uri,
        screenState: 3,
        isLoading: true
       });

      let formData = new FormData();
      formData.append('image',uri);
      axios.put('http://localhost:1234/upload',formData).then((res)=>{
        console.log(res.data.message)
        this.setState({isLoading: false,fileUploadSuccess:true,dimensions:res.data.message})
      }).catch((err)=>{this.setState({isLoading: false,fileUploadSuccess:false})})
      }
  };
  render(){
    return (
      <View style={{flex:1,backgroundColor:''}}>

        {/* Screen 1 */}
        {this.state.screenState == 1 &&
          <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
            <TouchableHighlight 
              style={{
                width:150,
                height:150,
                backgroundColor:'blue',
                borderRadius:75,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={()=>{
                this.setState({
                  screenState: 2
                })
              }}
              >
              <Text style={{color:'white'}}>Take Picture</Text>
            </TouchableHighlight>
          </View>
        }

        {/* Screen 2 */}
        {this.state.screenState == 2 &&
          <View style={{flex:1,backgroundColor:''}}>
            <View style={{flex:1}}>
              <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }} 
                  style = {{flex:1}}
                  type={RNCamera.Constants.Type.front}
                  flashMode={RNCamera.Constants.FlashMode.on}
                  captureAudio={false}
                  permissionDialogTitle={'Permission to use camera'}
                  permissionDialogMessage={'We need your permission to use your camera phone'}
              />
              <Button
                onPress={this.takePicture.bind(this)}
                //onPress={()=>{console.log("HELLLO TESTING")}}
                title="Capture"
                color="#84a8e0"
              />
            </View>
          </View>
        }

        {/* Screen 3 */}
        {this.state.screenState == 3 &&
          <View style={{flex:1}}>
            {this.state.imageUri?
              <Image 
              resizeMode={'contain'}
                style={styles.cover}
              source={{uri: this.state.imageUri}}/>
              :
              <Text>No Image</Text>
            }
            {this.state.isLoading?
              <ActivityIndicator size="large" color="#0000ff" style={{flex:1}}/>
              :
              <View>
                {this.state.fileUploadSuccess?
                  <Text>Dimensions: {this.state.dimensions.height} X
                  {this.state.dimensions.width} </Text>
                  :
                  <Text>Upload Failed</Text>
                }
              </View>
            }
          </View>
        }

      </View>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  cover: {
      flex: 1,
      alignSelf: 'stretch',
      width: undefined,
      height: undefined
  },
});

export default App;
