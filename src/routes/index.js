import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useEffect} from 'react';
import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import MyApp from '../navigation/Appflow';

const MainApp = createStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <MainApp.Navigator screenOptions={{headerShown: false}}>
        <MainApp.Screen name="App" component={MyApp} />
      </MainApp.Navigator>
    </NavigationContainer>
  );
};

export default App;
