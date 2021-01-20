import React, { useState, useEffect, useCallback, useRef, Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { SocialIcon } from 'react-native-elements'
import * as Linking from 'expo-linking';

import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../components/Restaurants/ListReviews";


import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screeenWidth = Dimensions.get("window").width

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();
    


   
    





    useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation]);

     firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
     });
  
  
     useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
             .doc(id)
             .get()
             .then((response) => {
                 const data = response.data();
                 data.id = response.id;
                 setRestaurant(data);
                 setRating(data.rating);
             });
         }, [])
     );

     useEffect(() => {
        if(userLogged && restaurant) {
            db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
               if(response.docs.length === 1) {
                 setIsFavorite(true);
               }
            })
        }
     }, [userLogged, restaurant])
    

    const addFavorite = () =>{
        if(!userLogged) {
            toastRef.current.show(
                "Para usar el sistema de favoritos tienes que estar logeado"
                );
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }
            db.collection("favorites")
            .add(payload)
            .then(() => {
                setIsFavorite(true);
                toastRef.current.show("Restaurante añadido a favoritos");
            })
            .catch(() => {
                toastRef.current.show("Error al añadir el restaurante a favoritos");
            });        
        }
    }; 
    
    const removeFavorite = () => {
       db.collection("favorites")
       .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
           response.forEach((doc) => {
               const idFavorite = doc.id;
               db.collection("favorites")
               .doc(idFavorite)
               .delete()
               .then(() => {
                   setIsFavorite(false);
                   toastRef.current.show("Restaurante Eliminado de tus favoritos")
               })
               .catch(() => {
                   toastRef.current.show("Error al eliminar el restaurante de favoritos")
               })
           })
        })

    }


    if(!restaurant) return <Loading isVisible={true} text="Cargando..."/>; 

    return (
      <ScrollView vertical style={styles.viewBody}>
          <View style={styles.viewFavorites}>
            <Icon 
               type="material-community"
               name={isFavorite ? "heart" : "heart-outline"}
               onPress={isFavorite ? removeFavorite : addFavorite}
               color= {isFavorite ? "#f00" : "#000"}
               size={35}
               undelayColor="transparent"
            /> 
          </View>
       <Carousel 
           arrayImages={restaurant.images}
           height={250}
           width={screeenWidth}
       />
       <TitleRestaurant 
           name={restaurant.name}
           description={restaurant.description}
           rating={rating}
       />
       <RestaurantInfo 
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
        numero={restaurant.numero}
        email={restaurant.email}
        facebook={restaurant.facebook}
        instagram={restaurant.instagram}
       />
       <ListReviews 
         navigation={navigation}
         idRestaurant={restaurant.id}
       /> 
       <Toast 
       ref={toastRef}
       position="center"
       opacity={0.9}
       />
      </ScrollView>
    );
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;
    

    return (
        <View style={styles.viewRestaurantTitle} >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.nameRestaurant}>{name}</Text>
            <Rating 
               style={styles.rating}
               imageSize={20}
               readonly
               startingValue={parseFloat(rating)}
            /> 
          </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}





function RestaurantInfo (props){
    const { location, name, address, numero, email, facebook, instagram } = props;

    const listInfo= [
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
    },
    
    ]


    




    
    return (
        <View style={styles.viewRestaurantInfo}>
         <Text style={styles.restaurantInfoTitle}>
             Informacion sobre el restaurante
         </Text>
          <Map location={location} name={name} height={125} />
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
         <View style={styles.viewIcons}> 
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
    viewRestaurantTitle: {
        padding: 15,
        fontWeight: "bold"
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold",

    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey",
        
  
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold"
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,
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
    },
    viewIcons: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 95,
        marginTop: 10
    }
});
