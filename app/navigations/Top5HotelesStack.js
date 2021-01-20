import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Top5Hoteles from "../screens/Top5Hoteles"

const Stack = createStackNavigator();
export default function Top5HotelesStack() {
    return (
     <Stack.Navigator>
        <Stack.Screen 
         name="top-5-hoteles" 
         component={Top5Hoteles}
         options={{ title: "Los Mejores Hoteles" }}
        />
     </Stack.Navigator>
    );
 }
