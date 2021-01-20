import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


import Lugaress from "../screens/Lugares/Lugaress"


const Stack = createStackNavigator();

export default function LugaressStack() {
   return (
    <Stack.Navigator>
        <Stack.Screen name="lugaress" 
        component={Lugaress}
        options={{ title: "Lugares Favoritos" }}
        />
    </Stack.Navigator>
   );
}