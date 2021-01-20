import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, Alert, Dimensions} from 'react-native'
import { AirbnbRating, Button, Input, Icon, Avatar, Image } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import { map, size, filter } from "lodash"
import { ScrollView } from 'react-native-gesture-handler';
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker";
import uudi from "random-uuid-v4";


import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/storage";

const db = firebase.firestore(firebaseApp);

const widhtScreen = Dimensions.get("window").width


export default function AddReviewRestaurant(props) {
    const { navigation, route, } = props;
    const { idRestaurant } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imagesSelected, setImagesSelected] = useState([])
     const toastRef = useRef ();

     


    const addReview = () => {
    

        if(!rating) {
            toastRef.current.show("No has dado ninguna puntuacion")
        } else if(!title) {
            toastRef.current.show("El titulo es obligatorio")
        } else if(!review) {
           toastRef.current.show("El comentario es obligatorio")
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Necesitas una foto de tu reseña")
        } else {   
         setIsLoading(true);
         UploadImageStorage().then((response) => {
         
         
         const user = firebase.auth().currentUser;
         const paylod = {
             idUser: user.uid,
             avatarUser: user.photoURL,
             idRestaurant: idRestaurant,
             title: title,
             review: review,
             rating: rating,
             images: response,
             createAt: new Date(),
         };
              db.collection("reviews")
              .add(paylod)
              .then(() => {
                  updateRestaurant();
              })
              .catch(() => {
                  toastRef.current.show(
                     "Error al enviar la review")
                      setIsLoading(false);
      })
    })
    }   
 };
        
 const UploadImageStorage = async () => {
    const imageBlob = [];

   await Promise.all(
  map(imagesSelected, async (image) => {
      const response = await fetch(image)    
      const blob= await response.blob();
      const ref = firebase.storage().ref("restaurants").child(uudi());
      await ref.put(blob).then(async (result) => {
          await firebase
                 .storage()
                 .ref(`restaurants/${result.metadata.name}`)
                 .getDownloadURL()
                 .then(photoURL => {
                     imageBlob.push(photoURL)
            }); 
        });
    })
 );
 
  return imageBlob;
};
     




     const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then((response) => {
           const restaurantData = response.data();
           const ratingTotal = restaurantData.ratingTotal + rating;
           const quantityVoting = restaurantData.quantityVoting + 1;
           const ratingResult = ratingTotal / quantityVoting;
           
           restaurantRef
           .update({
               rating: ratingResult,
               ratingTotal,
               quantityVoting
           }).then(() => {
               setIsLoading(false);
               navigation.goBack();
            })
        });
     }


    


    return (
        
        <View style={styles.viewBody}>
            <ScrollView>
            <View style={styles.viewRating}>
              <AirbnbRating 
                count={5}
                reviews={["Pesimo", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                defaultRating={0}
                size={40}
                onFinishRating={(value) => {setRating(value)}}
              />
              
            </View>
             <ImageReview 
             imagenReview={imagesSelected[0]}
             />
             
             
              
            <View style={styles.formReview}>
    

               <Input 
               placeholder="Titulo"
               containerStyle={styles.input}
               onChange={(e) => setTitle(e.nativeEvent.text)}
               />
               <Input 
                placeholder="Comentario..."
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setReview(e.nativeEvent.text)}

               />
               <UploadImage
               toastRef={toastRef}
               imagesSelected={imagesSelected}
               setImagesSelected={setImagesSelected}
            />
               <Button 
                 title="Enviar comentario"
                 containerStyle={styles.btnContainer}
                 buttonStyle={styles.btn}
                 onPress={addReview}
               />
              
            </View>
            </ScrollView>
            <Toast 
               ref={toastRef}
               position="center"
               opacity={0.9}            
               
            />
            <Loading 
            isVisible={isLoading}
            text="Enviando comentario"
            />
            
        </View>
    )
}

function ImageReview(props) {
    const { imagenReview } = props;


    return (
        <View style={styles.viewPhoto}>
          <Image 
          source={imagenReview 
            ? { uri: imagenReview }
            : require("../../../assets/img/no-image.png")
        }
          style={{ width: widhtScreen, height: 200 }}
          />
        </View>
    )
}


function UploadImage(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;
    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        
        if(resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manuelmente.",
            3000
            );
      
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3] 
            })

            if (result.cancelled) {
                toastRef.current.show(
                    "Has cerrado la galaria sin seleccionar niguna imagen",
                    2000
                )
            } else {
             setImagesSelected([...imagesSelected, result.uri])
            }
        }
    };
    
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de que quieres eliminar la imagen?",
             [
                 {
                     text: "Cancel",
                     style: "cancel"
                 },
                 {
                     text: "Elimnar",
                     onPress: () => {
                         setImagesSelected(
                            filter(imagesSelected, (imageURL) => imageURL !== image)
                         )
                     }
                 }
             ],
             { cancelable: false } 
        )
    }


    return (
        <View style={styles.viewImagesReviews}>
            {size(imagesSelected) < 1 && (
              <Icon 
              type="material-community"
              name="camera"
              color="#7a7a7a"
              containerStyle={styles.containerIcon}
              onPress={imageSelect}
             />
            )}
        
         {map(imagesSelected, (imageReview, index) => (
             <Avatar 
             key={index}
             style={styles.minatureStyle}
             source={{ uri: imageReview }}
             onPress={() => removeImage(imageReview)}
             /> 
         ))}
        </View>
    )
}



const styles = StyleSheet.create({
    ScrollView: {
        height: "100%",
      },
    viewBody: {
        flex: 1,
    },
    viewRating: {
       height: 110,
       backgroundColor: "#f2f2f2",
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40,
    },
    input: {
       marginBottom: 10,
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
    viewImagesReviews: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    minatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    }
})
