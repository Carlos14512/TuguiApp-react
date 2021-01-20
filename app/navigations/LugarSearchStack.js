import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LugarSearch from "../screens/LugarSearch"
import Lugares from "../screens/Lugares/Lugares"
import FavoritesL from "../screens/FavoritesL"
import Top5Lugares from "../screens/Top5Lugares"
import Lugaress from "../screens/Lugares/Lugaress"

const Stack = createStackNavigator();
export default function LugarSearchStack() {
    return (
     <Stack.Navigator>
           <Stack.Screen 
             name="lugar-search"
             component={LugarSearch}
             options={{ title: "Lugares" }}
           />
           <Stack.Screen 
             name="lugares"
             component={Lugares}
             options={{ title: "Lugares" }}
           />
           <Stack.Screen 
             name="favoritesl"
             component={FavoritesL}
             options={{ title: "Favoritos" }}
           />
            <Stack.Screen 
             name="top-5-lugares"
             component={Top5Lugares}
             options={{ title: "Los mejores hoteles" }}
           />
             <Stack.Screen 
             name="lugaress"
             component={Lugaress}
             options={{ title: "Lugares" }}
           />
     </Stack.Navigator>
    );
 }