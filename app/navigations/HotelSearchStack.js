import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Hoteles from "../screens/Hoteles/Hoteles";
import HomeSearch from "../screens/HomeSearch"
import Favorites from "../screens/Favorites"
import Hoteless from "../screens/Hoteles/Hoteless"


const Stack = createStackNavigator();
export default function HotelSearchStack() {
    return (
     <Stack.Navigator>
           <Stack.Screen name="hoteles" 
         component={Hoteles}
         options={{ title: "Hoteles" }}
         />
          <Stack.Screen name="home-search" 
         component={HomeSearch}
         options={{ title: "Hoteles" }}
         />
          <Stack.Screen name="favorites" 
         component={Favorites}
         options={{ title: "Hoteles Favoritos" }}
         />
          <Stack.Screen name="hoteless" 
         component={Hoteless}
         options={{title: "Hoteles" }}
         />
     </Stack.Navigator>
    );
 }