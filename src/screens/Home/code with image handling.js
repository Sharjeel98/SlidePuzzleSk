// PERFECT BASIC IMPLEMENTATION

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Pressable,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';

import ImageEditor from '@react-native-community/image-editor';

const {height, width} = Dimensions.get('window');
const Home = () => {
  const [puzzleSize, setPuzzleSize] = useState(3); // default size is 3x3
  const [boxSize, setBoxSize] = useState(width * 0.26); // default box size is 100 pixels
  const [puzzle, setPuzzle] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [boxPressing, setBoxPressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(
    Image.resolveAssetSource(require('../../assets/images/dummyImg.jpeg')).uri,
  );
  // Define the size of the box you want to fit the image into
  const boxSize2 = {width: 500, height: 500};

  // Define an array of objects to store the dimensions and positions of each part
  // Define a function to fit the image into a square box
  const fitImageIntoBox = async imageUri => {
    const maxWidth = 500;
    const maxHeight = 500;
    const compressFormat = 'JPEG';
    const quality = 100;
    const rotation = 0;

    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      null,
      false,
      {
        mode: 'stretch',
      },
      // {
      //   resizeMode: 'stretch',
      // },
    ).catch(e => {
      console.log('CATCH ERROR=======', e);
    });

    return resizedImage?.uri;
  };

  // Define a function to crop the image and return the URIs of the parts
  const cropImageIntoParts = async imageUri => {
    // console.log('THE URI-----', imageUri);
    const resizedImage = await fitImageIntoBox(imageUri);
    const croppedImages = await Promise.all(
      dimensions.map(async (dim, index) => {
        const croppedImage = await ImageEditor.cropImage(resizedImage, {
          offset: {x: dim.x, y: dim.y},
          size: {width: dim.width, height: dim.height},
          displaySize: dimensions[index],
        }).catch(e => {
          console.log('ERROR IN CROP IMAGE =======', e);
        });
        return {uri: croppedImage, key: index};
      }),
    );
    return croppedImages;
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fixedFunction = async () => {
    const initialShuffle = generatePuzzle();
    const puzzleWithNull = initialShuffle.map(row =>
      row.map(num => (num === 0 || num === undefined ? null : num)),
    );
    console.log('PUZZLE WITH NULL ========', puzzleWithNull);
    setPuzzle(puzzleWithNull);
  };

  useEffect(() => {
    fixedFunction();
    cropFunction();
  }, [puzzleSize, trigger]);

  const cropFunction = async () => {
    const croppedImages = await cropImageIntoParts(image);
    setImages(croppedImages);
    console.log('THE CROPPED IMAGES =========', croppedImages);
  };

  const dimensions = [];
  for (let i = 0; i < puzzleSize; i++) {
    for (let j = 0; j < puzzleSize; j++) {
      dimensions.push({
        width: boxSize2.width / puzzleSize,
        height: boxSize2.height / puzzleSize,
        x: j * (boxSize2.width / puzzleSize),
        y: i * (boxSize2.height / puzzleSize),
      });
    }
  }

  // TESTED ALOT WORKING FOR  3 4 5 PUZZLES

  const generatePuzzle = () => {
    const size = puzzleSize * puzzleSize;
    const numbers = Array.from({length: size}, (_, i) => i);
    let inversions, blankIndex, blankRow;

    do {
      // Shuffle the numbers
      for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }

      // Calculate the number of inversions
      inversions = 0;
      for (let i = 0; i < size; i++) {
        if (numbers[i] === 0) {
          blankIndex = i;
          blankRow = Math.floor(blankIndex / puzzleSize);
          continue;
        }
        for (let j = i + 1; j < size; j++) {
          if (numbers[j] === 0) continue;
          if (numbers[i] > numbers[j]) inversions++;
        }
      }

      // Check if puzzle is solvable
      if (puzzleSize % 2 === 1) {
        // Odd puzzle
        if (inversions % 2 === 0) {
          console.log('Inversion divisible by 2');
          break;
        }
      } else {
        // Even puzzle
        if (
          (blankRow % 2 === 0 && inversions % 2 === 1) ||
          (blankRow % 2 === 1 && inversions % 2 === 0)
        ) {
          console.log('Puzzle is solvable!');
          break;
        } else {
          console.log('Not solvable!');
        }
      }
    } while (true);

    // Convert numbers array to puzzle matrix
    const puzzle = [];
    for (let i = 0; i < size; i += puzzleSize) {
      puzzle.push(numbers.slice(i, i + puzzleSize));
    }
    console.log('FINAL INVERSIONS ==========', inversions);
    return puzzle;
  };

  const isSolved = puzzle => {
    const flat = puzzle?.flat();
    // console.log('THE FLAT =======', flat);
    for (let i = 0; i < flat?.length - 1; i++) {
      if (flat[i] !== i + 1) return false;
    }
    return true;
  };

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      return;
    }
    if (isSolved(puzzle)) {
      console.log('HEEYUEHUEHUE');
      const puzzleWithZero = puzzle.map(row =>
        row.map(num =>
          num === null || num === undefined ? puzzle.flat().length : num,
        ),
      );

      setLoading(true);
      setPuzzle(puzzleWithZero);
      // setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }).start();

      // }, 2000);
      setTimeout(() => {
        Alert.alert(
          'Congratulations!',
          'You solved the puzzle, try next level?',
          [
            {
              text: 'Shuffle current level',
              onPress: () => {
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 1,
                  useNativeDriver: false,
                }).start();
                setTimeout(() => {
                  setTrigger(!trigger);
                  setLoading(false);
                }, 100);
              },
            },
            {
              text: 'Yes',
              onPress: () => {
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 1,
                  useNativeDriver: false,
                }).start();
                setTimeout(() => {
                  handleSizeChange(puzzleSize + 1);

                  setLoading(false);
                }, 100);
              },
            },
          ],
        );
      }, 2000);
      // setTimeout(() => {
      //   setTrigger(!trigger);
      // }, 3000);
    }
  }, [boxPressing]);

  // WORKING FOR 1 PERFECT
  // const handleBoxPress = (row, col) => {
  //   const emptyRow = puzzle.findIndex(r => r.includes(null));
  //   const emptyCol = puzzle[emptyRow].indexOf(null);
  //   const dist = Math.abs(row - emptyRow) + Math.abs(col - emptyCol);

  //   if (dist === 1) {
  //     const newPuzzle = [...puzzle];
  //     newPuzzle[emptyRow][emptyCol] = puzzle[row][col];
  //     newPuzzle[row][col] = null;
  //     setPuzzle(newPuzzle);
  //   }
  // };

  // CHECKING FOR NOW WORKING FOR ALL
  const handleBoxPress = (row, col) => {
    setBoxPressing(!boxPressing);
    const emptyRow = puzzle.findIndex(r => r.includes(null));
    const emptyCol = puzzle[emptyRow].indexOf(null);
    const dist = Math.abs(row - emptyRow) + Math.abs(col - emptyCol);

    if (dist === 1) {
      const newPuzzle = [...puzzle];
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 2 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol = emptyCol + (col - emptyCol) / 2;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol];
      newPuzzle[row][middleCol] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 2 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow = emptyRow + (row - emptyRow) / 2;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow][col];
      newPuzzle[middleRow][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 3 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol1 = emptyCol + (col - emptyCol) / 3;
      const middleCol2 = emptyCol + ((col - emptyCol) * 2) / 3;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol1];
      newPuzzle[row][middleCol1] = newPuzzle[row][middleCol2];
      newPuzzle[row][middleCol2] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 3 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow1 = emptyRow + (row - emptyRow) / 3;
      const middleRow2 = emptyRow + ((row - emptyRow) * 2) / 3;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow1][col];
      newPuzzle[middleRow1][col] = newPuzzle[middleRow2][col];
      newPuzzle[middleRow2][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 4 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol1 = emptyCol + (col - emptyCol) / 4;
      const middleCol2 = emptyCol + ((col - emptyCol) * 2) / 4;
      const middleCol3 = emptyCol + ((col - emptyCol) * 3) / 4;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol1];
      newPuzzle[row][middleCol1] = newPuzzle[row][middleCol2];
      newPuzzle[row][middleCol2] = newPuzzle[row][middleCol3];
      newPuzzle[row][middleCol3] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 4 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow1 = emptyRow + (row - emptyRow) / 4;
      const middleRow2 = emptyRow + ((row - emptyRow) * 2) / 4;
      const middleRow3 = emptyRow + ((row - emptyRow) * 3) / 4;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow1][col];
      newPuzzle[middleRow1][col] = newPuzzle[middleRow2][col];
      newPuzzle[middleRow2][col] = newPuzzle[middleRow3][col];
      newPuzzle[middleRow3][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 5 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol1 = emptyCol + (col - emptyCol) / 5;
      const middleCol2 = emptyCol + ((col - emptyCol) * 2) / 5;
      const middleCol3 = emptyCol + ((col - emptyCol) * 3) / 5;
      const middleCol4 = emptyCol + ((col - emptyCol) * 4) / 5;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol1];
      newPuzzle[row][middleCol1] = newPuzzle[row][middleCol2];
      newPuzzle[row][middleCol2] = newPuzzle[row][middleCol3];
      newPuzzle[row][middleCol3] = newPuzzle[row][middleCol4];
      newPuzzle[row][middleCol4] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 5 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow1 = emptyRow + (row - emptyRow) / 5;
      const middleRow2 = emptyRow + ((row - emptyRow) * 2) / 5;
      const middleRow3 = emptyRow + ((row - emptyRow) * 3) / 5;
      const middleRow4 = emptyRow + ((row - emptyRow) * 4) / 5;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow1][col];
      newPuzzle[middleRow1][col] = newPuzzle[middleRow2][col];
      newPuzzle[middleRow2][col] = newPuzzle[middleRow3][col];
      newPuzzle[middleRow3][col] = newPuzzle[middleRow4][col];
      newPuzzle[middleRow4][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 6 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol1 = emptyCol + (col - emptyCol) / 6;
      const middleCol2 = emptyCol + ((col - emptyCol) * 2) / 6;
      const middleCol3 = emptyCol + ((col - emptyCol) * 3) / 6;
      const middleCol4 = emptyCol + ((col - emptyCol) * 4) / 6;
      const middleCol5 = emptyCol + ((col - emptyCol) * 5) / 6;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol1];
      newPuzzle[row][middleCol1] = newPuzzle[row][middleCol2];
      newPuzzle[row][middleCol2] = newPuzzle[row][middleCol3];
      newPuzzle[row][middleCol3] = newPuzzle[row][middleCol4];
      newPuzzle[row][middleCol4] = newPuzzle[row][middleCol5];
      newPuzzle[row][middleCol5] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 6 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow1 = emptyRow + (row - emptyRow) / 6;
      const middleRow2 = emptyRow + ((row - emptyRow) * 2) / 6;
      const middleRow3 = emptyRow + ((row - emptyRow) * 3) / 6;
      const middleRow4 = emptyRow + ((row - emptyRow) * 4) / 6;
      const middleRow5 = emptyRow + ((row - emptyRow) * 5) / 6;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow1][col];
      newPuzzle[middleRow1][col] = newPuzzle[middleRow2][col];
      newPuzzle[middleRow2][col] = newPuzzle[middleRow3][col];
      newPuzzle[middleRow3][col] = newPuzzle[middleRow4][col];
      newPuzzle[middleRow4][col] = newPuzzle[middleRow5][col];
      newPuzzle[middleRow5][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 7 && emptyRow === row) {
      const newPuzzle = [...puzzle];
      const middleCol1 = emptyCol + (col - emptyCol) / 7;
      const middleCol2 = emptyCol + ((col - emptyCol) * 2) / 7;
      const middleCol3 = emptyCol + ((col - emptyCol) * 3) / 7;
      const middleCol4 = emptyCol + ((col - emptyCol) * 4) / 7;
      const middleCol5 = emptyCol + ((col - emptyCol) * 5) / 7;
      const middleCol6 = emptyCol + ((col - emptyCol) * 6) / 7;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[row][middleCol1];
      newPuzzle[row][middleCol1] = newPuzzle[row][middleCol2];
      newPuzzle[row][middleCol2] = newPuzzle[row][middleCol3];
      newPuzzle[row][middleCol3] = newPuzzle[row][middleCol4];
      newPuzzle[row][middleCol4] = newPuzzle[row][middleCol5];
      newPuzzle[row][middleCol5] = newPuzzle[row][middleCol6];
      newPuzzle[row][middleCol6] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    } else if (dist === 7 && emptyCol === col) {
      const newPuzzle = [...puzzle];
      const middleRow1 = emptyRow + (row - emptyRow) / 7;
      const middleRow2 = emptyRow + ((row - emptyRow) * 2) / 7;
      const middleRow3 = emptyRow + ((row - emptyRow) * 3) / 7;
      const middleRow4 = emptyRow + ((row - emptyRow) * 4) / 7;
      const middleRow5 = emptyRow + ((row - emptyRow) * 5) / 7;
      const middleRow6 = emptyRow + ((row - emptyRow) * 6) / 7;
      newPuzzle[emptyRow][emptyCol] = newPuzzle[middleRow1][col];
      newPuzzle[middleRow1][col] = newPuzzle[middleRow2][col];
      newPuzzle[middleRow2][col] = newPuzzle[middleRow3][col];
      newPuzzle[middleRow3][col] = newPuzzle[middleRow4][col];
      newPuzzle[middleRow4][col] = newPuzzle[middleRow5][col];
      newPuzzle[middleRow5][col] = newPuzzle[middleRow6][col];
      newPuzzle[middleRow6][col] = newPuzzle[row][col];
      newPuzzle[row][col] = null;
      setPuzzle(newPuzzle);
    }
  };

  const handleSizeChange = newSize => {
    setPuzzleSize(newSize);
    if (newSize == 3) {
      setBoxSize((width * 0.265 * 3) / newSize);
    }
    if (newSize == 4) {
      setBoxSize((width * 0.265 * 3.09) / newSize);
    }
    if (newSize == 5) {
      setBoxSize((width * 0.265 * 3.15) / newSize);
    }
    if (newSize == 6) {
      setBoxSize((width * 0.265 * 3.18) / newSize);
    }
    if (newSize == 7) {
      setBoxSize((width * 0.265 * 3.23) / newSize);
    }
    if (newSize == 8) {
      setBoxSize((width * 0.265 * 3.248) / newSize);
    }
    setTrigger(!trigger);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        barStyle={'light-content'}
        backgroundColor={'rgba(45,20,0,1)'}
      />

      <View
        style={
          {
            // marginTop: height * 0.02,
          }
        }>
        {/* <Text style={{}}>
          Puzzle Size: {puzzleSize}x{puzzleSize}
        </Text> */}
        <View
          style={{
            alignItems: 'center',
            // width: width * 0.95,
            alignSelf: 'center',
            marginTop: height * 0.08,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: width * 0.7,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(3)}>
              <Text style={styles.buttonText}>3 x 3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(4)}>
              <Text style={styles.buttonText}>4 x 4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(5)}>
              <Text style={styles.buttonText}>5 x 5</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: height * 0.03,
              justifyContent: 'space-between',
              width: width * 0.7,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(7)}>
              <Text style={styles.buttonText}>6 x 6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(7)}>
              <Text style={styles.buttonText}>7 x 7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSizeChange(8)}>
              <Text style={styles.buttonText}>8 x 8</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'rgba(54,21,0,0.9)',
          borderWidth: boxSize / 5.1,
          // borderRadius: width * 0.02,
          borderColor: 'rgba(23,12,0,1)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,

          elevation: 20,
          marginTop: height * 0.06,
          // padding: boxSize / 50,
        }}>
        <View
          style={{
            // backgroundColor: 'red',
            borderWidth: boxSize / 60,
            borderColor: 'rgba(35,16,0,1)',
          }}>
          {puzzle.map((row, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                // flexWrap: 'wrap',
              }}>
              {row.map((number, j) => (
                <Animated.View
                  key={j}
                  style={{
                    opacity:
                      isSolved(puzzle) && number == puzzle.flat().length
                        ? fadeAnim
                        : number === null
                        ? 0
                        : 1,
                    width: boxSize,
                    height: boxSize,
                    // opacity: number === null ? 0 : 1,
                    backgroundColor: 'rgba(66,29,0,0.91)',
                    borderWidth: boxSize / 50,
                    borderColor: 'rgba(50,20,0,1)',
                    // borderRadius: boxSize / 3.7,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,

                    elevation: 7,
                    // margin: boxSize / 60,
                    // margin: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Pressable
                    disabled={loading}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // opacity: number === null ? 0 : 1,
                      },
                    ]}
                    onPress={() => handleBoxPress(i, j)}>
                    {images.length == puzzle?.flat().length &&
                      number != null &&
                      number != 0 && (
                        <View
                          style={{
                            height: boxSize - 2,
                            width: boxSize - 2,
                          }}>
                          <Image
                            source={{uri: images[number - 1]?.uri}}
                            resizeMethod="scale"
                            resizeMode="cover"
                            defaultSource={{uri: images[number - 1]?.uri}}
                            style={{height: '100%', width: '100%'}}
                            // defaultSource={{uri: images[number - 1]?.uri}}
                          />
                          <Text
                            style={{
                              position: 'absolute',
                              color: '#fff',
                              fontSize: width * 0.06,
                            }}>
                            {number}
                          </Text>
                        </View>
                      )}

                    {/* <Text
                      style={[
                        styles.number,
                        {
                          fontSize: boxSize / 2.7,
                          color: 'rgba(255,255,255,0.65)',
                          fontWeight: 'bold',
                        },
                      ]}>
                      {number}
                    </Text> */}
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* {isSolved(puzzle) && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>You solved the puzzle!</Text>
        </View>
      )} */}
      <Image
        source={{uri: image}}
        style={{
          height: 140,
          width: 140,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    // width: BOX_SIZE * PUZZLE_SIZE,
    // height: BOX_SIZE * PUZZLE_SIZE,
    backgroundColor: 'rgba(62,28,0,0.91)',

    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    // width: boxSize,
    // height: boxSize,
  },
  number: {},
  button: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
  },
  buttonText: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.65)',
  },
});

export default Home;
