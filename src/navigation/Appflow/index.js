import {createStackNavigator} from '@react-navigation/stack';
import {Choose, Game, Home} from '../../screens';

const AppStack = createStackNavigator();

const MyApp = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="Home" component={Home} />
      <AppStack.Screen name="Game" component={Game} />
      <AppStack.Screen name="Choose" component={Choose} />
    </AppStack.Navigator>
  );
};

export default MyApp;
