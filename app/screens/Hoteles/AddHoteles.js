import React, { useState, useEffect, useRef } from "react"
import { View, Text } from  "react-native"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import AddHotelesForm from "../../components/Hoteles/AddHotelesForm"



export default function AddHoteles(props) {
    const { navigation } = props
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef();
    
    return (
        <View>
            <AddHotelesForm 
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
            text="Creando un Restaurante"
            /> 
        </View>
    )
}

