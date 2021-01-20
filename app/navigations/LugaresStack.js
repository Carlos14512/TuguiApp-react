import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Lugares from "../screens/Lugares/Lugares"
import AddLugares from "../screens/Lugares/AddLugares"
import Lugaress from "../screens/Lugares/Lugaress"
import AddReviewLugares from "../screens/Lugares/AddReviewLugares";
import HomeSearch from "../screens/HomeSearch"




const Stack = createStackNavigator();
export default function LugaresStack() {
    return (
        <Stack.Navigator>
         <Stack.Screen name="lugares" 
         component={Lugares}
         options={{ title: "Lugares" }}
         />
        <Stack.Screen name="add-lugares" 
         component={AddLugares}
         options={{ title: "Añadir un Lugar" }}
         />
          <Stack.Screen name="lugaress"
          component={Lugaress}
          options={{ title: "Lugares" }}
         />
         <Stack.Screen 
           name="add-review-lugares"
           component={AddReviewLugares}
           options={{ title: "Nuevo comentario" }}
         />
          <Stack.Screen name="home-search" 
         component={HomeSearch}
         options={{ title: "Hoteles" }}
         />
          </Stack.Navigator>
    )
}

