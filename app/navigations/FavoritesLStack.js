import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


import FavoritesL from "../screens/FavoritesL"



const Stack = createStackNavigator();

export default function FavoritesLStack() {
   return (
    <Stack.Navigator>
        <Stack.Screen 
          name="favoritesl"
         component={FavoritesL}
         options={{ title: "Lugares Favoritos" }}
        />
    </Stack.Navigator>
   );
}