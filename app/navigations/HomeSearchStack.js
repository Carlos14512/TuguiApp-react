import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeSearch from "../screens/HomeSearch"
import TopRestaurants from "../screens/TopRestaurants"
import Restaurants from "../screens/Restaurants/Restaurants"
import Favorites from "../screens/Favorites"
import RestaurantsStack from "./RestaurantsStack"
import Favoritess from "../screens/Favoritess"
import Restaurant from "../screens/Restaurants/Restaurant"
import Lugaress from "../screens/Lugares/Lugaress"



const Stack = createStackNavigator();
export default function HomeSearchStack() {
    return (
     <Stack.Navigator>
         <Stack.Screen name="home-search" 
         component={HomeSearch}
         options={{ title: "Todo sobre Restaurantes" }}
         />
          <Stack.Screen name="topRestaurants" 
         component={TopRestaurants}
         options={{ title: "Los Mejores Restaurantes" }}
         />
          <Stack.Screen name="restaurants" 
        component={Restaurants}
        options={{ title: "Restaurantes" }}
        />
        <Stack.Screen name="restaurant" 
        component={Restaurant}
        options={{ title: "Restaurantes" }}
        />
         <Stack.Screen name="favorites" 
         component={Favorites}
         options={{ title: "Favoritos" }}
         />
       
         <Stack.Screen name="favoritess" 
         component={Favoritess}
         options={{ title: "Favoritos" }}
         />
          <Stack.Screen name="lugaress" 
         component={Lugaress}
         options={{ title: "Lugares" }}
         />         
     </Stack.Navigator>
    );
 }