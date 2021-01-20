import React, { useState, useEffect, useRef } from "react";
import { View, Text  } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopLugares from "../components/Ranking/ListTopLugares"

import { firebaseApp } from "../utils/firebase"
import firebase from    "firebase/app"
import "firebase/firestore"





const db = firebase.firestore(firebaseApp)

export default function Top5Lugares(props) {
    const { navigation } = props
    const [lugares, setLugares] = useState([])
    const toastRef = useRef()
  console.log(lugares);

    useEffect(() => {
        db.collection("Lugares")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then((response) => {
            const lugaresArray = []
          response.forEach((doc) => {
            const data = doc.data()
            data.id = doc.id;
            lugaresArray.push(data)
          })
          setLugares(lugaresArray)
        })
    }, [])

    return (
        <View>
            <ListTopLugares 
              lugares={lugares}
              navigation={navigation}
            />
            <Toast ref={toastRef} position="center"  opacity={0.9}/>
        </View>
    )
}


