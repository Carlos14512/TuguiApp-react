import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { map } from "lodash"
import { Rating, ListItem, Icon, SocialIcon,} from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast"
import * as Linking from 'expo-linking';
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"
import ListReviewsH from "../../components/Hoteles/ListReviewsH"

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp)
const screeenWidth = Dimensions.get("window").width;




export default function Hoteless(props) {
     const { navigation, route } = props
     const { id, name } = route.params
     const [hoteless, setHoteless] = useState(null)
     const [rating, setRating] = useState(0)
     const [isFavorite, setIsFavorite] = useState(false)
     const [userLogged, setUserLogged] = useState(false)
     const toastRef = useRef();

    navigation.setOptions({ title: name })

   firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false)
   })

    useFocusEffect(
        useCallback(() => {
            db.collection("Hoteles")
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id
                setHoteless(data);
                setRating(data.rating)
            })
        }, [])

    )

    useEffect(() => {
        if(userLogged && hoteless) {
            db.collection("favoritesH")
            .where("idHoteless", "==", hoteless.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
             if (response.docs.length === 1) {
                setIsFavorite(true)
              }
            })
        }
    }, [userLogged, hoteless])


   const AddFavoritesH = () => {
       if(!userLogged) {
        toastRef.current.show("Para poder usar el sistema de favoritos tienes que estar logeado")
       } else {
           const payload = {
               idUser: firebase.auth().currentUser.uid,
               idHoteless: hoteless.id
           }
           db.collection("favoritesH")
             .add(payload)
             .then(() => {
                 setIsFavorite(true)
                 toastRef.current.show("Hotel añadido a favoritos")
             })
             .catch(() => {
                 toastRef.current.show("Error al añadir el hotel a favoritos")
             })
       }
   }

   const removeFavoriteH = () => {
       db.collection("favoritesH")
       .where("idHoteless", "==", hoteless.id)
       .where("idUser", "==", firebase.auth().currentUser.uid)
       .get()
       .then((response) => {
        response.forEach((doc) => {
            const idFavorites = doc.id
            db.collection("favoritesH")
            .doc(idFavorites)
            .delete()
            .then(() => {
                setIsFavorite(false)
                toastRef.current.show("Hotel eliminado de favoritos")
            })
            .catch(() => {
                toastRef.current.show("Error al eliminar el Hotel de favoritos")
            })
         });
       })
   }

    
    
   if(!hoteless) return <Loading 
   isVisible={true}
   text="Cargando..."
   />

    return (
    <ScrollView vertical style={styles.viewBody}>
       <View style={styles.viewFavorites}>
       <Icon type="material-community"
       name={isFavorite ? "heart" : "heart-outline"}
       onPress={isFavorite ? removeFavoriteH : AddFavoritesH}
       color={isFavorite ? "#f00" : "#000"}
       size={35}
       underlayColor="transparent"
       /> 
       </View>
     <Carousel 
     arrayImages={hoteless.images}
     height={250}
     width={screeenWidth}
     />
     <TitleHoteless 
     name={hoteless.name}
     description={hoteless.name}
     rating={rating}
     />
     <HotelessInfo 
     location={hoteless.location}
     name={hoteless.name}
     address={hoteless.address}
     numero={hoteless.numero}
     email={hoteless.email}
     instagram={hoteless.instagram}
     facebook={hoteless.facebook}
     />
     <ListReviewsH 
      navigation={navigation}
      idHoteless={hoteless.id}
     />
     <Toast 
     ref={toastRef} position="center"
     opacity={0.9}
     />
    </ScrollView>   
    )
}

function TitleHoteless(props) {
    const { name, description, rating } = props

    return (
        <View style={styles.viewHotelesstitle}>
         <View style={{ flexDirection: "row" }}>  
             <Text style={styles.nameHoteless}>
                 {name}
             </Text>
             <Rating 
             style={styles.rating}
             imageSize={20}
             readonly
             startingValue={parseFloat(rating)}
             />
         </View>
         <Text style={styles.descriptionHoteless}>
                 {description}
             </Text>
        </View>
    )
}

function HotelessInfo(props) {
    const { location, name, address, numero, email, facebook, instagram } = props

    const ListInfo = [
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
    return(
        <View style={styles.viewHotelessInfo}>
         <Text  style={styles.hotelessInfo}>
             Informacion sobre el Hotel
         </Text>
         <Map 
         location={location}
         name={name}
         height={125}/>
         {map(ListInfo, (item, index) => (
          <ListItem 
          key={index}
          title={item.text}
          leftIcon={{
              name: item.iconName,
              type: item.iconType,
              color: "#ff8000"
          }}
          containerStyle={styles.containerListInfo}
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
    viewHotelesstitle: {
        padding: 15,
    },
    nameHoteless: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionHoteless: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    viewHotelessInfo: {
        margin: 15,
        marginTop: 25
    },
    hotelessInfo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListInfo: {
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
       paddingLeft: 15
    }
})
