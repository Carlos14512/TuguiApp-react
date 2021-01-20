import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native"
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore";
import ListHoteles from "../../components/Hoteles/ListHoteles";
import { result } from "lodash";



const db = firebase.firestore(firebaseApp)

 
export default function Hoteles(props){
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [hoteles, setHoteles] = useState([]);
    const [totalHoteles, setTotalHoteles] = useState(0);
    const [startHotel, setStartHotel] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const limitHoteles = 10

    useEffect(() => {
     firebase.auth().onAuthStateChanged((userInfo) => {
        setUser(userInfo);
    })
    }, [])


    useFocusEffect(
        useCallback(() => {
            db.collection("Hoteles").get().then((snap) => {
                setTotalHoteles(snap.size)
               });
         
               const resultHoteles = [];
         
               db.collection("Hoteles")
               .orderBy("createAt", "desc")
               .limit(limitHoteles).get().then((response) => {
                   setStartHotel(response.docs[response.docs.length - 1])
                   response.forEach((doc) => {
                       const Hotel = doc.data();
                       Hotel.id = doc.id;
                       resultHoteles.push(Hotel)
                   })
                   setHoteles(resultHoteles)
               })
        }, [])
    );
   



    const handleLoadMore = async () => {
       const resultHoteles = [];
       hoteles.length < totalHoteles && setIsLoading(false);


       db.collection("Hoteles")
         .orderBy("createAt", "desc")
         .startAfter(startHotel.data().createAt)
         .limit(limitHoteles)
         .get()
         .then(response => {
             if(response.docs.length > 0) {
                 setStartHotel(response.docs(response.docs.length - 1))
             } else {
                 setIsLoading(false)
             }


             response.forEach((doc) => {
               const hoteles = doc.data();
               hoteles.id = doc.id;
               resultHoteles.push(hoteles)
             })

             setHoteles([...hoteles, ...resultHoteles])
            
         })
    }


    return(
        <View style={styles.viewBody}>
           <ListHoteles 
           hoteles={hoteles} handleLoadMore={handleLoadMore}
           isLoading={isLoading}
           /> 

            {user && (
             <Icon
             reverse  
              type="material-community"
              name="plus"
              color="#00a680"
              containerStyle={styles.btnContainer}
              onPress={() => navigation.navigate("add-hoteles")}
             />
            )}

        </View>
    )
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    }
})