import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore"
import ListLugares from "../../components/Lugares/ListLugares"

const db = firebase.firestore(firebaseApp)

export default function Lugares(props) {
    const { navigation } = props
    const [user, setUser] = useState(null)
    const [lugares, setLugares] = useState([])
    const [totalLugares, setTotalLugares] = useState(0)
    const [startLugares, setStartLugares] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const limitLugares = 15

    

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            db.collection("Lugares").get().then((snap) => {
                setTotalLugares(snap.size)
               })
       
               const resultLugares = []
               
       
               db.collection("Lugares")
               .orderBy("createAt", "desc")
               .limit(limitLugares).get().then((response) => {
                 setStartLugares(response.docs[response.docs.length - 1]);
       
                 response.forEach((doc) => {
                   const lugares = doc.data();
                   lugares.id = doc.id;
                   resultLugares.push(lugares);
               })
               setLugares(resultLugares)
               })
        }, [])
    )
    

        

    const handleLoadMore= async () => {
        const resultLugares = [];
        lugares.length < totalLugares && setIsLoading(true);

        db.collection("Lugares")
          .orderBy("createAt", "desc")
          .startAfter(startLugares.data().createAt)
          .limit(limitLugares)
          .get()
          .then((response) => {
              if(response.docs.length > 0) {
                  setStartLugares(response.docs[response.docs.length - 1])
              } else {
                  setIsLoading(false);
              }

              response.forEach((doc) => {
              const lugares = doc.data();
              lugares.id = doc.id;
              resultLugares.push( lugares )
              })

              setLugares([...lugares, ...resultLugares])
              
          })
    }

   
    
    return (
        <View style={styles.viewBody}>
            <ListLugares 
            lugares={lugares}
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
            />
             {user && (
              <Icon
              reverse 
              type="material-community"
              name="plus"
              color= "#00a680"
              containerStyle={styles.btnContainer}
              onPress={() => navigation.navigate("add-lugares")}
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
