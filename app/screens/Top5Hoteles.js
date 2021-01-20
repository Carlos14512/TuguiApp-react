import React, { useState, useEffect, useRef } from "react";
import { View, Text,  } from "react-native";
import Toast from "react-native-easy-toast";
import LisTopHoteles from "../components/Ranking/LisTopHoteles"

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);


export default function Top5Hoteles(props) {
    const {  navigation } = props;
    const [hoteles, setHoteles] = useState([])
    const toastRef = useRef()
    

    useEffect(() => {
       db.collection("Hoteles")
       .orderBy("rating", "desc")
       .limit(5)
       .get()
       .then((response) => {
           const hotelessArray = []
          response.forEach((doc) => {
              const data = doc.data()
              data.id = doc.id
              hotelessArray.push(data)
          })
          setHoteles(hotelessArray)
       })
    }, [])

    return (
        <View>
            <LisTopHoteles 
              hoteles={hoteles}
              navigation={navigation}
            />
            <Toast
             ref={toastRef}
             position="center"
             opacity={0.9}
            />
        </View>
    )
}

