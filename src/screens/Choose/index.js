import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const Choose = ({navigation}) => {
  const [list, setList] = useState([
    {
      id: 1,
      type: 3,
    },
    {
      id: 2,
      type: 4,
    },
    {
      id: 3,
      type: 5,
    },
    {
      id: 4,
      type: 6,
    },
    {
      id: 5,
      type: 7,
    },
    {
      id: 6,
      type: 8,
    },
  ]);
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={Background}
        style={{
          flexGrow: 1,
          // height: Dimensions.get('window').height,
          // width: Dimensions.get('window').width,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="cover">
        <View>
          <Text>New Game</Text>
        </View>
      </ImageBackground> */}
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
            marginBottom: height * 0.005,
            borderRadius: width * 0.01,
            paddingHorizontal: width * 0.08,
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
              fontSize: width * 0.065,
              fontWeight: '900',
              color: '#8F5A29',

              // marginBottom:height
              // fontStyle:
            }}>
            Choose Puzzle
          </Text>
        </View>
      </View>
      <View
        style={{
          flexGrow: 1,
        }}>
        <FlatList
          data={list}
          contentContainerStyle={{
            // justifyContent: 'center',
            flexGrow: 1,
            // marginBottom: height * 0.04,
            marginTop: height * 0.1,
          }}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  let boxSize = (width * 0.265 * 3) / 3;
                  if (item.type == 3) {
                    boxSize = (width * 0.265 * 3) / 3;
                  }
                  if (item.type == 4) {
                    boxSize = (width * 0.265 * 3.09) / 4;
                  }
                  if (item.type == 5) {
                    boxSize = (width * 0.265 * 3.15) / 5;
                  }
                  if (item.type == 6) {
                    boxSize = (width * 0.265 * 3.18) / 6;
                  }
                  if (item.type == 7) {
                    boxSize = (width * 0.265 * 3.23) / 7;
                  }
                  if (item.type == 8) {
                    boxSize = (width * 0.265 * 3.248) / 8;
                  }
                  navigation.navigate('Game', {
                    type: item.type,
                    boxSize: boxSize,
                  });
                }}
                style={{
                  backgroundColor: '#C0742D',
                  // paddingHorizontal: width * 0.04,
                  paddingVertical: height * 0.003,
                  // width: width * 0.35,
                  borderRadius: width * 0.01,
                  paddingHorizontal: width * 0.03,

                  alignItems: 'center',
                  marginBottom: height * 0.025,
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
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: width * 0.07,
                    fontWeight: '900',
                    color: '#fff',
                    // fontStyle:
                  }}>
                  {item.type} x {item.type}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCEA0',

    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default Choose;
