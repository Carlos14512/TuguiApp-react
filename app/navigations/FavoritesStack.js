import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeSearch from "../screens/HomeSearch"
import Hoteless from "../screens/Hoteles/Hoteless"


import Favorites from "../screens/Favorites";


const Stack = createStackNavigator();

export default function FavoritesStack() {
   return (
    <Stack.Navigator>
        <Stack.Screen name="favorites" 
        component={Favorites}
        options={{ title: "Hoteles Favoritos" }}
        />
        <Stack.Screen name="home-search" 
         component={HomeSearch}
         options={{ title: "Todo sobre Restaurantes" }}
         />
         <Stack.Screen name="hoteless" 
         component={Hoteless}
         options={{title: "Hoteles" }}

         />
    </Stack.Navigator>
   );
}