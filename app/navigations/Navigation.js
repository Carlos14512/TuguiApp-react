import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import HotelesStack from "./HotelesStack"
import HomeStack from "./HomeStack"
import HomeSearchStack from "./HomeSearchStack"
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import LugaresStack from "./LugaresStack"
import TopRestaurantsStack from "./TopRestaurantsStack"
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack";
import FavoritessStack from "./FavoritessStack"

const Tab = createBottomTabNavigator();

export default function Navigation() {
   return (
       <NavigationContainer>
           <Tab.Navigator
            initialRouteName="restaurants"
            tabBarOptions={{
                inactiveTintColor: "#646464",
                activeTintColor: "#00a680",
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
            })}
           >
               
               {/* <Tab.Screen name="home-search"
               component={HomeStack} 
               options={{ title: "Home" }} 
               /> */}
               <Tab.Screen name="restaurants"
               component={RestaurantsStack} 
               options={{ title: "Restαurαntes" }}
               
               />
               <Tab.Screen name="hoteles"
               component={HotelesStack} 
               options={{ title: "Hoteles" }} 
               />
                <Tab.Screen name="lugares"
               component={LugaresStack} 
               options={{ title: "Lugαres" }} 
               />
               {/* <Tab.Screen name="favorites"
               component={FavoritesStack} 
               options={{ title: "Favoritos" }}
               /> */}
               {/* <Tab.Screen name="top-restaurants"
               component={TopRestaurantsStack} 
               options={{ title: "Top 5" }}
               /> */}
               <Tab.Screen name="home"
               component={HomeStack} 
               options={{ title: "Nαvegα!" }} 
               />
                <Tab.Screen name="search"
               component={SearchStack} 
               options={{ title: "Buscαr" }}
               />
             
               <Tab.Screen name="account"
               component={AccountStack} 
               options={{ title: "Cuentα" }}
               />
           </Tab.Navigator>
       </NavigationContainer>
   );

}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "home":
        iconName = "home-outline";
          break;
      case "restaurants":
        iconName = "compass-outline";
          break;
          case "hoteles":
        iconName = "office-building";
          break;
          case "lugares":
            iconName = "office-building";
              break;
        // case "favorites":
        // iconName = "heart-outline";
        //    break;
        // case "top-restaurants":
        // iconName = "star-outline"
        //    break;
        case "search":
        iconName = "magnify";
           break;
        case "account":
         iconName = "account";  
           break;
      default:
          break;
  }
  return (
      <Icon type="material-community" name={iconName} size={22} color={color} />
  ); 
}