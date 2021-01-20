import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


import Favoritess from "../screens/Favoritess";


const Stack = createStackNavigator();

export default function FavoritesStack() {
   return (
    <Stack.Navigator>
        <Stack.Screen name="favoritess" 
        component={Favoritess}
        options={{ title: "Restaurantes Favoritos" }}
        />
       
    </Stack.Navigator>
   );
}