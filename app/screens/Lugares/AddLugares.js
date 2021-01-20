import React, { useState, useRef } from 'react'
import { Text, View } from 'react-native'
import Toast from "react-native-easy-toast"
import AddLugaresForm from "../../components/Lugares/AddLugaresForm"
import Loading from "../../components/Loading"

export default function AddLugares(props) {
    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef();
    
    return (
        <View>
            <AddLugaresForm 
              toastRef={toastRef}
              setIsLoading={setIsLoading}
              navigation={navigation}
            />
            <Toast 
             ref={toastRef}
             position="center"
             opacity={0.9}
            />
            <Loading 
            isVisible={isLoading}
            text="Creando Lugar"
            />
        </View>
    )
}

