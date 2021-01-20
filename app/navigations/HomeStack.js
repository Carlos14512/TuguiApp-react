import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import TopRestaurants from "../screens/TopRestaurants"
import Login from "../screens/Account/Login"
import Account from "../screens/Account/Account"
import HomeSearch from "../screens/HomeSearch"
import Favoritess from "../screens/Favoritess"
import HotelSearch from "../screens/HotelSearch"
import Top5Hoteles from "../screens/Top5Hoteles"
import Favorites from "../screens/Favorites"
import Restaurant from "../screens/Restaurants/Restaurant"
import Hoteless from "../screens/Hoteles/Hoteless"
import LugarSearch from "../screens/LugarSearch"
import FavoritesL from "../screens/FavoritesL"
import Lugares from "../screens/Lugares/Lugares"
import Top5Lugares from "../screens//Top5Lugares";
import Lugaress from "../screens/Lugares/Lugaress"




const Stack = createStackNavigator();
export default function HomeStack() {
    return (
     <Stack.Navigator>
         <Stack.Screen name="home" 
         component={Home}
         options={{ title: "Navega!" }}
         />
         <Stack.Screen name="topRestaurants" 
         component={TopRestaurants}
         options={{ title: "Los Mejores Restaurantes" }}
         />
         <Stack.Screen 
         name="restaurant"
         component={Restaurant}
        />
          <Stack.Screen name="home-search" 
         component={HomeSearch}
         options={{ title: "Todo Sobre Restaurantes" }}
         />
          <Stack.Screen name="Login" 
         component={Login}
         options={{ title: "Iniciar sesion" }}
         />
         <Stack.Screen name="Account" 
         component={Account}
         options={{ title: "Mi cuenta" }}
         />
           <Stack.Screen name="favoritess" 
         component={Favoritess}
         options={{ title: "Favoritos" }}
         />
           <Stack.Screen name="hotel-search" 
         component={HotelSearch}
         options={{ title: "Todo sobre Hoteles" }}
         />
         <Stack.Screen 
         name="top-5-hoteles" 
         component={Top5Hoteles}
         options={{ title: "Los Mejores Hoteles" }}
        />
         <Stack.Screen 
         name="favorites" 
         component={Favorites}
         options={{ title: "Hoteles Favoritos" }}
        />
          <Stack.Screen 
         name="hoteless" 
         component={Hoteless}
         options={{title: "Hoteles" }}
        />
         <Stack.Screen 
         name="lugar-search" 
         component={LugarSearch}
         options={{title: "Todo sobre lugares" }}
        />
         <Stack.Screen 
         name="favoritesl" 
         component={FavoritesL}
         options={{title: "Favoritos" }}
        />
         <Stack.Screen 
         name="lugares" 
         component={Lugares}
         options={{title: "Lugares" }}
        />
          <Stack.Screen 
         name="top-5-lugares" 
         component={Top5Lugares}
         options={{title: "Los mejores Lugares" }}
        />
          <Stack.Screen 
         name="lugaress" 
         component={Lugaress}
        />
     </Stack.Navigator>
    );
 }