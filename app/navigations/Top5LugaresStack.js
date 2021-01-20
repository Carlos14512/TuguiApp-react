import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Top5Lugares from "../screens//Top5Lugares";


const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
   return (
    <Stack.Navigator>
        <Stack.Screen name="top-5-lugares" 
        component={Top5Lugares}
        options={{ title: "Los Mejores lugares" }}
        />
    </Stack.Navigator>
   );
}