import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { map } from "lodash"
import { Rating, ListItem, SocialIcon, Icon } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"
import ListReviewsL from "../../components/Lugares/ListReviewsL"
import * as Linking from 'expo-linking';


import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get("window").width;

export default function Lugaress(props) {
    const { navigation, route  } = props;
    const { id, name } = route.params
    const [lugares, setLugares] = useState(null)
    const [rating, setRating] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const toastRef = useRef()


    
    navigation.setOptions({ title: name })

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })
     
    useFocusEffect(
        useCallback(() => {
            db.collection("Lugares")
             .doc(id)
             .get()
             .then((response) => {
                 const data = response.data();
                 data.id = response.id;
                 setLugares(data);
                 setRating(data.rating)
             })
        }, [])
    );

   useEffect(() => {
     if(userLogged && lugares) {
         db.collection("favoritesl")
         .where("idLugares", "==", lugares.id)
         .where("idUser", "==", firebase.auth().currentUser.uid)
         .get()
         .then((response) => {
             if(response.docs.length === 1) {
                 setIsFavorite(true)
             } 
         })
     }  
   }, [userLogged, lugares])

    const addFavoritel = () => {
        if(!userLogged) {
            toastRef.current.show("Para usar el sistema de favoritos tienes que registrarte")
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idLugares: lugares.id
        }
        db.collection("favoritesl")
         .add(payload)
         .then(() => {
             setIsFavorite(true)
             toastRef.current.show("Lugar añadido a favoritos")
         })
         .catch(() => {
             toastRef.current.show("Error al añadir su el Lugar a favoritos")
         })
    } 
}

    const removeFavoritel = () => {
        db.collection("favoritesl")
        .where("idLugares", "==", lugares.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach((doc) => {
                 const idFavorite = doc.id;
                 db.collection("favoritesl")
                 .doc(idFavorite)
                 .delete()
                 .then(() => {
                     setIsFavorite(false)
                     toastRef.current.show("Lugar eliminado de la lista de favoritos")
                 })
                 .catch(() => {
                     toastRef.current.show("Error al eliminar el lugar de favoritos")
                 })
            });
        })
    }

    

   

     if(!lugares) return <Loading 
      isVisible={true}
      text="Cargando..."
     />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorites}>
            <Icon 
               type="material-community"
               name={isFavorite ? "heart" : "heart-outline"}
               onPress={isFavorite ? removeFavoritel : addFavoritel}
               color={isFavorite ? "#f00" : "#000"}
               size={35}
               undelayColor="transparent"
            /> 
          </View>
          <Carousel 
          arrayImages={lugares.images}
          height={250}
          width={screenWidth}
          />
          <TitleLugar 
           name={lugares.name}
           description={lugares.description}
           rating={rating}
          />
          <LugaresInfo 
            location={lugares.location}
            name={lugares.name}
            address={lugares.address}
            email={lugares.email}
            numero={lugares.numero}
            facebook={lugares.facebook}
            instagram={lugares.instagram}
          />
          <ListReviewsL 
           navigation={navigation}
           idLugares={lugares.id}
          />
         <Toast 
            ref={toastRef} position="center"
            opacity={0.9}
        />
        </ScrollView>
    )
}

function TitleLugar(props) {
    const { name, description, rating } = props


    return (
        <View style={styles.viewLugarTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameLugar}>
                    {name}
                </Text>
                <Rating 
                  style={styles.rating}
                  imageSize={20}
                  readonly
                  startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionLugar}>
                {description}
            </Text>
        </View>
    )
}

function LugaresInfo(props) {
     const { location, name, address, email, numero, facebook, instagram } = props;

     const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: email,
            iconName: "gmail",
            iconType: "material-community",
            action: null,
        }
     ]

     return (
         <View style={styles.viewLugaresInfo}> 
            <Text style={styles.lugaresInfoTitle}>
                Informacion sobre el Lugar
            </Text>
            <Map 
            location={location}
            name={name}
            height={125}
            />
            {map(listInfo, (item, index) => (
             <ListItem 
              key={index}
              title={item.text}
              leftIcon={{
                  name: item.iconName,
                  type: item.iconType,
                  color: "#ff8000"
              }}
              containerStyle={styles.containerListItem}
             />
            ))}
            <View style={styles.viewIconsHotels}> 
            <SocialIcon
             type='facebook'
           onPress={() => Linking.openURL(facebook)} />
            <SocialIcon
            light
            type='instagram'
           onPress={() => Linking.openURL(instagram)} />
           <SocialIcon
            light
            type='whatsapp'
           onPress={() => Linking.openURL(numero)} />
           
           </View>  
         </View>
     )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewLugarTitle: {
        padding: 15
    },
    nameLugar: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionLugar: {
     marginTop: 5,
     color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    viewLugaresInfo: {
        margin: 15,
        marginTop: 25
    },
    lugaresInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
         borderBottomWidth: 1
    },
    viewIconsHotels: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 95,
        marginTop: 10
    },
    viewFavorites: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
    }
})
