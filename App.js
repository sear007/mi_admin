import * as React from 'react';
import { View, Text} from 'react-native';
import { NavigationContainer,DrawerActions,useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Button,Icon} from 'react-native-elements';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import EditScreen from './screens/EditScreen';
import ExpiredInsurance from './screens/ExpiredInsurance';
import CategoryScreen from './screens/CategoryScreen';
import UploadScreen from './screens/UploadScreen';
enableScreens();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
function MyStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        headerTitle:"Mohapiphup Admin",
        headerLeft: ()=>(<Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())} type="clear" icon={{ name:'menu',size:30 }} />), 
        headerRight: ()=>(<Button onPress={() => navigation.navigate('UploadScreen') } type="clear" icon={<Icon type="font-awesome" name="upload" size={30} />} />), 
        }} />
      <Stack.Screen  name="EditScreen" component={EditScreen} />
    <Stack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerBackTitleVisible:false
      }}/>
      <Stack.Screen
      name="ExpiredInsurance"
      component={ExpiredInsurance}
      options={{
        title: 'Veicles Insurance Expired',
        headerBackTitleVisible:false
      }}/>
      <Stack.Screen
      name="CategoryScreen"
      component={CategoryScreen}
      options={{
        headerBackTitleVisible:false
      }}/>
      <Stack.Screen
      name="UploadScreen"
      component={UploadScreen}
      options={{
        title:'New Equipment',
        headerBackTitleVisible:false
      }}/>  
    </Stack.Navigator>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={MyStack} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
