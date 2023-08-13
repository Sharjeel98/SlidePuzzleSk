import {createStackNavigator} from '@react-navigation/stack';

const AuthStack = createStackNavigator();

const MyAuth = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {/* <AuthStack.Screen name="Home" component={Home} /> */}
    </AuthStack.Navigator>
  );
};

export default MyAuth;
