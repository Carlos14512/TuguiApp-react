import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Alert, Dimensions } from 'react-native'
import { AirbnbRating, Button, Input, Icon, Avatar, Image } from "react-native-elements"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import { map, size, filter, result } from "lodash"
import { ScrollView } from 'react-native-gesture-handler';
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker";
import uudi from "random-uuid-v4";


import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"


const db = firebase.firestore(firebaseApp)
const widhtScreen = Dimensions.get("window").width


export default function AddReviewLugares(props) {
    const { navigation, route } = props
    const { idLugares } = route.params
    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [review, setReview] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [imagesSelected, setImagesSelected] = useState([])
    const toastRef = useRef()


    const addReviewL = () => {
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
               uploadImageStorage().then((response) => {
            const user = firebase.auth().currentUser
            const paylod = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idLugares: idLugares,
                review: review,
                title: title,
                rating: rating,
                images: response,
                createAt: new Date()
            }
            db.collection("reviewsl")
               .add(paylod)
               .then(() => {
                updateLugares()
               })
               .catch(() => {
                   toastRef.current.show("Errror al enviar la review")
                   setIsLoading(false)
               })
           })
        }

    }

    const uploadImageStorage = async () => {
     const imageBlob = [];


     await Promise.all(
        map(imagesSelected , async (image) => {
            const response = await fetch(image)
           const blob = await response.blob();
           const ref = firebase.storage().ref("Lugares").child(uudi());
           await ref.put(blob).then( async (result) => {
            await firebase
            .storage()
            .ref(`Lugares/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
             imageBlob.push(photoUrl)
            })
           })
   
        })
     )
     return imageBlob
    }


    const updateLugares = () => {
      const lugaresRef = db.collection("Lugares").doc(idLugares)


      lugaresRef.get().then((response) => {
        const lugaresData = response.data()
        const ratingTotal = lugaresData.ratingTotal + rating;
        const quantityVoting = lugaresData.quantityVoting + 1;
        const ratingResult = ratingTotal / quantityVoting;

        lugaresRef.update({
            rating: ratingResult,
            ratingTotal,
            quantityVoting
        }) .then(() => {
            setIsLoading(false);
            navigation.goBack()
        })
      })
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
            <ImageReviewL 
             imageLugar={imagesSelected[0]}
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
                 onPress={addReviewL}
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
              text="Enviando Comentario"
            /> 
        </View>
    )
}

 function ImageReviewL (props) {
     const { imageLugar } = props;

     return(
         <View style={styles.viewPhotoReview}>
           <Image 
             source={{ uri: imageLugar }}
             style={{ width: widhtScreen, height: 200 }}
           /> 
         </View>
     )
 } 


function UploadImage(props) {
const { toastRef, imagesSelected, setImagesSelected } = props
 
  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
    )
    
    if(resultPermissions === "denied") {
    toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manuelmente.",
    3000
    );
   } else {
       const result = await ImagePicker.launchImageLibraryAsync({
           allowsEditing: true,
           aspect: [4,3],
       })

       if(result.cancelled) {
        toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen", 2000
        )
     } else {
         setImagesSelected([...imagesSelected, result.uri])
     }
   }
  }

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
                text: "Eliminar",
                onPress: () => {
                    setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    )
                }
            }
        ],
        {
            cancelable: false
        }
    )
  }



 
    return(
     <View style={styles.viewImage}>
         {size(imagesSelected) < 1 && (
           <Icon 
           type="material-community"
           name="camera"
           color= "#7a7a7a"
           containerStyle={styles.containerIcon}
           onPress={imageSelect}
          />
         )}
       {map(imagesSelected, (imageLugar, index) => (
            <Avatar 
             key={index}
             style={styles.miniuaturaStyle}
             source={{ uri: imageLugar }}
             onPress={() => removeImage(imageLugar)}
            /> 
       ))}
     </View>
    )
}






const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
       height: 110,
       backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 120,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    },
    viewImage: {
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
    miniuaturaStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhotoReview: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    }
})
