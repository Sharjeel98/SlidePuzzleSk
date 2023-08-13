import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          height: height * 0.2,
          backgroundColor: '#FFDFC1',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottomWidth: width * 0.014,
          borderBottomColor: '#FFDBB9',
          shadowColor: '#633203',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
          borderBottomLeftRadius: width * 0.03,
          borderBottomRightRadius: width * 0.03,
        }}>
        <View
          style={{
            marginBottom: height * 0.022,
            borderRadius: width * 0.01,
            paddingHorizontal: width * 0.09,
            paddingVertical: height * 0.007,
            borderWidth: width * 0.02,
            borderColor: '#A7692C',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <Text
            style={{
              fontSize: width * 0.1,
              fontWeight: '900',
              color: '#8F5A29',

              // marginBottom:height
              // fontStyle:
            }}>
            Number Puzzle
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (buttonSound) {
                console.log('TRUE');
                buttonSound.play();
              } else {
                console.log('FALSEEE');
              }
            }}>
            <Text>CLICK</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red',
          flexGrow: 1,
        }}>
        <View
          style={{
            // backgroundColor: 'rgba(249, 203, 159 ,0.13)',
            paddingHorizontal: width * 0.2,
            paddingVertical: height * 0.12,
            marginBottom: height * 0.12,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('Choose');
            }}
            style={{
              backgroundColor: '#C0742D',
              // paddingHorizontal: width * 0.04,
              paddingVertical: height * 0.01,
              width: width * 0.5,
              borderRadius: width * 0.01,
              alignItems: 'center',
              marginBottom: height * 0.03,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderWidth: width * 0.01,
              borderColor: '#A7692C',
            }}>
            <Text
              style={{
                fontSize: width * 0.07,
                fontWeight: '900',
                color: '#fff',
                // fontStyle:
              }}>
              New Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              borderWidth: width * 0.01,
              borderColor: '#A7692C',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,

              backgroundColor: '#C0742D',
              // paddingHorizontal: width * 0.04,
              paddingVertical: height * 0.01,
              width: width * 0.5,
              borderRadius: width * 0.01,

              alignItems: 'center',
              marginBottom: height * 0.03,
            }}>
            <Text
              style={{
                fontSize: width * 0.07,
                fontWeight: '900',
                color: '#fff',
                // fontStyle:
              }}>
              Continue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              shadowColor: '#000',
              borderWidth: width * 0.01,
              borderColor: '#A7692C',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,

              backgroundColor: '#C0742D',
              // paddingHorizontal: width * 0.04,
              paddingVertical: height * 0.01,
              width: width * 0.5,
              borderRadius: width * 0.01,

              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: width * 0.07,
                fontWeight: '900',
                color: '#fff',
                // fontStyle:
              }}>
              Statistics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCEA0',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default Home;
