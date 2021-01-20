import React, { useState, useEffect, useCallback, Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import { Button, Avatar, Rating, Image } from "react-native-elements";
import { map, size } from "lodash";


import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';


const db = firebase.firestore(firebaseApp);
const { width, height } = Dimensions.get('window');



export default function ListReviews(props) {
    const { navigation, idRestaurant } = props;
   const [userLogged, setUserLogged] = useState(false); 
    const [reviews, setReviews] = useState([])


    
    firebase.auth().onAuthStateChanged((user) => {
         user ? setUserLogged(true) : setUserLogged(false);
     });
     

     useFocusEffect(
     useCallback(() => {
         db.collection("reviews")
           .where("idRestaurant", "==", idRestaurant)
           .get()
           .then((response) => {
               const resultReview = [];
            response.forEach(doc => {
                   const data = doc.data();
                   data.id = doc.id;
                   resultReview.push(data);
               });
               setReviews(resultReview);
           })
     }, [])
   );

    return (
        <View>
            {userLogged ? (
                <Button 
                title="Escribe una opinion"
                buttonStyle={styles.btnAddReview}
                titleStyle={styles.btntitleAddReview}
                icon={{
                    type: "material-community",
                    name: "square-edit-outline",
                    color: "#00a680",
                }}
                onPress={() => navigation.navigate("add-review-restaurant", {
                    idRestaurant: idRestaurant,
                })}
                />
            ): (
             <View>
               <Text
                 style={{ textAlign: "center", color: "#00a680", padding: 15 }}
                 onPress={() => navigation.navigate("login")}
               >
                   Para escribir un comentario es necesario estar logeado{" "}
                   <Text style={{ fontWeight: "bold" }}>
                       pulsa AQUI para iniciar sesion
                   </Text>
               </Text>
             </View>    
            )}
           

           



           {map(reviews, (review, index) => (
             <Review key={index} review={review}
                          
             />
           ))}         
        </View>
    )
}

function Review(props) {
  const { title, review, rating, createAt, avatarUser, images} = props.review;
  const createReview = new Date(createAt.seconds * 1000)
  const ImageReview = images ? images[0] : null;

  return (
      <View style={styles.viewReview}>
         <View style={styles.viewImageAvatar}>
            <Avatar 
             size="large"
             rounded
             containerStyle={styles.imageAvatarUser}
             source={avatarUser ? { uri: avatarUser } : require("../../../assets/img/avatar-default.jpg")
            }
            /> 
         </View>
         <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating 
              imageSize={15}
              startingValue={rating}
              readonly
        />

        <Image 
                 resizeMode="cover"
                 PlaceholderContent={<ActivityIndicator color="fff" />}
    
                 source={
                    ImageReview
                    ? { uri: ImageReview }
                    : require("../../../assets/img/no-image.png")
                 }
                 style={styles.ImageReview}

         />
        
      
  


        <Text style={styles.reviewDate}>
            {createReview.getDate()}/{createReview.getMonth() + 1}/
            {createReview.getFullYear()} - {createReview.getHours()}:
            {createReview.getMinutes() < 10 ? "0" : ""}
            {createReview.getMinutes()}
            
        </Text>
         <View style={styles.viewRestaurantReview}>
         
         </View>
         </View>
      </View>
  )
  
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnAddReview: {
      backgroundColor: "transparent",
    },
    btntitleAddReview: {
        color: "#00a680",
    },
    viewReview: {
        flexDirection: "row",
        padding: 5,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1,
    },
    viewImageAvatar: {
        marginRight: 15,
    },
    imageAvatarUser: {
        width: 50,
        height: 50,
        marginTop: 5
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start",
    },
    reviewTitle: {
        fontWeight: "bold",
        marginTop: 18
    },
    reviewText: {
        paddingTop: 5,
        color: "grey",
        marginBottom: 2,
    },
    reviewDate: {
        color: "grey",
        fontSize: 12,
        position: "absolute",
        top: 0,
        bottom: 0,
        right:0,
        marginTop: -1
    },
    imagesReview: {
        width: 80,
        height: 80,
        
    },
    viewRestaurantReview: {
        marginRight: 15,
        borderBottomColor: "#fff"
    },
    reviewPohoto: {
        width: 80,
       height: 80,
    },
    ImageReview: {
        width: 270,
        height: 220,
    }
})
