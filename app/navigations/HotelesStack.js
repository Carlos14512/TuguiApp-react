import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Hoteles from "../screens/Hoteles/Hoteles";
import AddHoteles from "../screens/Hoteles/AddHoteles";
import Hoteless from "../screens/Hoteles/Hoteless"
import AddReviewHoteless from "../screens/Hoteles/AddReviewHoteless"


const Stack = createStackNavigator();
export default function HotelesStack() {
    return (
     <Stack.Navigator>
         <Stack.Screen name="hoteles" 
         component={Hoteles}
         options={{ title: "Hoteles" }}
         />
         <Stack.Screen name="add-hoteles" 
         component={AddHoteles}
         options={{ title: "Añadir un nuevo hotel" }}
         />
         <Stack.Screen 
         name="hoteless"
         component={Hoteless}
         options={{title: "Hoteles" }}
         />
          <Stack.Screen 
         name="add-review-hoteless"
         component={AddReviewHoteless}
         options={{ title: "Nuevo Comentario" }}
         />
     </Stack.Navigator>
    );
 }