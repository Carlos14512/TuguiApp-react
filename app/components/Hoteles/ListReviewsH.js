import React, { useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import { Button, Avatar, Rating, Image } from "react-native-elements"
import { map } from "lodash";
import { useFocusEffect } from '@react-navigation/native';
import Carousel from "../../components/Carousel"

import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp);



  

export default function ListReviewsH(props) {
    const { navigation, idHoteless } = props
    const [userLogged, setUserLogged] = useState(false)
    const [reviews, setReviews] = useState([])

    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false)
    })
    
    useFocusEffect(
        useCallback(() => {
            db.collection("reviewsh")
             .where("idHoteless", "==", idHoteless)
             .get()
             .then((response) => {
                 const resultReview = [];
                response.forEach((doc) => {
                   const data = doc.data();
                   data.id = doc.id;
                   resultReview.push(data);
               });
               setReviews(resultReview)
             })
        }, [])
    )
   

    return (
        <View>
            {userLogged ? (
                <Button 
                title="Escribe una opinion"
                buttonStyle={styles.btnAddReviewH}
                titleStyle={styles.btnTitleRviewH}
                icon={{
                    type: "material-community",
                    name: "square-edit-outline",
                    color: "#00a680",
                }}
                onPress={() => navigation.navigate("add-review-hoteless", {
                    idHoteless: idHoteless, 
                }
                )}
                />
            ) : (
                <View>
                    <Text
                    style={{
                        textAlign: "center",
                        color: "#00a680",
                        padding: 20
                    }}
                    onPress={() => navigation.navigate("login")}
                    >
                        Para escribir un comentario es necesario estar logeado{" "} 
                    <Text style={{ fontWeight: "bold"}}>
                        pulsa AQUI para iniciar sesion
                    </Text>
                    </Text>
                </View>
            )}
           {map(reviews, (review, index) => (
               <Review 
               key={index}
               review={review}
               />
           ))}

        </View>
    )
}

function Review(props) {
  const { title, review, rating, createAt, avatarUser, images } = props.review;
  const createReview = new Date(createAt.seconds * 1000);
  const ImageReviewH = images ? images[0] : null;


  return (
      <View style={styles.viewReview}>
          <View style={styles.viewImageAvatar}>
           <Avatar 
           size="large"
           rounded
           containerStyle={styles.imageAvatar}
           source={avatarUser ? { uri: avatarUser } : require("../../../assets/img/avatar-default.jpg")}
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
             <View style={styles.viewPhoto}>
             <Image 
                 resizeMode="cover"
                 PlaceholderContent={<ActivityIndicator color="fff" />}
    
                 source={
                    ImageReviewH
                    ? { uri: ImageReviewH }
                    : require("../../../assets/img/no-image.png")
                 }
                 style={styles.ImageReviewH}
         />
         </View>
            <Text style={styles.reviewDate}>
            {createReview.getDate()}/{createReview.getMonth() + 1}/
            {createReview.getFullYear()} - {createReview.getHours()}:
            {createReview.getMinutes() < 10 ? "0" : ""}
            {createReview.getMinutes()}
            
            </Text>
          </View>
      </View>
  )
}



const styles = StyleSheet.create({
    btnAddReviewH: {
        backgroundColor: "transparent"
    },
    btnTitleRviewH: {
        color: "#00a680"
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
    imageAvatar: {
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
    ImageReviewH: {
        width: 270,
        height: 220,
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
})
