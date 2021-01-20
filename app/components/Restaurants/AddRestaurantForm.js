import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter, result } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uudi from "random-uuid-v4";
import  Modal from "../Modal";


import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);


const widthScreen = Dimensions.get("window").width;




export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props; 
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [restaurantNumero, setRestaurantNumero] = useState("");
    const [restauranteEmail, setRestauranteEmail] = useState("");
    const [restaurantFacebook, setRestaurantFacebook] = useState("")
    const [restaurantInstagram, setRestaurantInstagram] = useState("")
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);
    
     

    const AddRestaurant = () => {
      if(!restaurantName || !setRestaurantAddress || !restaurantDescription || !restaurantNumero || !restauranteEmail || !restaurantFacebook || !restaurantInstagram ) {
          toastRef.current.show("Todos los campos del formulario son obligatorios");
      } else if(size(imageSelected) === 0) {
        toastRef.current.show("El restaurante tiene que tener al menos una foto");
      } else if(!locationRestaurant) {
          toastRef.current.show("Tienes que locacalizar el restaurante en el mapa");
      } else if(!restaurantNumero) {
        toastRef.current.show("Necesitamos el numero del restaurant");
       } else if(!restauranteEmail) {
        toastRef.current.show("Necesitas poner el gmail del restaurante");  
        } else if(!restaurantFacebook) {
        toastRef.current.show("Necesitamos poner la url del restaurante");
        } else if(!restaurantInstagram) {
        toastRef.current.show("Necesitamos poner la url del restaurante");  
        } else {  
          setIsLoading(true);
          UploadImageStorage().then((response) =>{
              db.collection("restaurants")
               .add({
                   name: restaurantName,
                   address: restaurantAddress,
                   description: restaurantDescription,
                   location: locationRestaurant,
                   numero: restaurantNumero,
                   email: restauranteEmail,
                   facebook: restaurantFacebook,
                   instagram: restaurantInstagram,
                   images: response,
                   rating: 0,
                   ratingTotal: 0,
                   quantityVoting: 0,
                   createAt: new Date(),
                   createBy: firebaseApp.auth().currentUser.uid,
               })
               .then(() => {
                   setIsLoading(false);
                   navigation.navigate("restaurants");
               }).catch(() => {
                   setIsLoading(false);
                   toastRef.current.show(
                       "Error al subir el restaurante, intentelo mas tarde"
                   )
               })
          });
      }

    };

    const UploadImageStorage = async () => {
        const imageBlob = [];

       await Promise.all(
      map(imageSelected, async (image) => {
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
    
    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imagenRestaurant={imageSelected[0]} />
        <FormAdd 
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setRestaurantNumero={setRestaurantNumero}
        setRestauranteEmail={setRestauranteEmail}
        setRestaurantFacebook={setRestaurantFacebook}
        setRestaurantInstagram={setRestaurantInstagram}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
        
        />
        <UploadImage toastRef={toastRef}
         imageSelected={imageSelected}
         setImageSelected={setImageSelected}
        
        /> 
        <Button 
            title="Crear Restaurante"
            onPress={AddRestaurant}
            buttonStyle={styles.btnAddRestaurant}
        />
        <Map 
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
        />   
        </ScrollView>
    );
}

function ImageRestaurant(props) {
    const { imagenRestaurant } = props; 

    return (
        <View style={styles.viewPhoto}>
          <Image 
          source={imagenRestaurant 
            ? { uri: imagenRestaurant }
            : require("../../../assets/img/no-image.png")} 
          style={{ width: widthScreen, height: 200 }}
          />
        </View>
    )
}




   


function FormAdd(props) {
   const { setRestaurantName, 
    setRestaurantAddress, 
    setRestaurantDescription, 
    setRestaurantNumero,
    setRestauranteEmail,
    setRestaurantFacebook,
    setRestaurantInstagram,
    setIsVisibleMap, 
    locationRestaurant,
     
    } = props;
    return (
        <View style={styles.viewForm}>
            <Input 
              placeholder="Nombre del restaurante"
              containerStyle={styles.input}
              onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
            placeholder="Direccion"
            containerStyle={styles.input}
            onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "google-maps",
                color: locationRestaurant ? "#00a680" : "#c2c2c2",
                onPress: () => setIsVisibleMap(true),
            }}
            /> 
             <Input 
            placeholder="Numero"
            containerStyle={styles.input}
            onChange={(e) => setRestaurantNumero(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "phone",
                color: "#c2c2c2",
                
            }}
            />
             <Input 
            placeholder="Email"
            containerStyle={styles.input}
            onChange={(e) => setRestauranteEmail(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "at",
                color: "#c2c2c2",
                
            }}
            />
            <Input 
            placeholder="facebook"
            containerStyle={styles.input}
            onChange={(e) => setRestaurantFacebook(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "facebook",
                color: "#c2c2c2",
                
            }}
            />
            <Input 
            placeholder="instagram"
            containerStyle={styles.input}
            onChange={(e) => setRestaurantInstagram(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "instagram",
                color: "#c2c2c2",
                
            }}
            />              
            <Input 
            placeholder="Descripcion del restaurante"
            multiline={true}
            inputContainerStyle={styles.textArea}
            onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            /> 
        </View>
    )
}


function Map(props) {
  const {isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef} = props;
  const [location, setLocation] = useState(null); 

    useEffect(() => {
      (async() => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.LOCATION
        );
        const statusPermissions = resultPermissions.permissions.location.status;

        if(statusPermissions !== "granted") {
            toastRef.current.show("Tienes que aceptar los permisos de localizacion para crear un restaurante", 3000)
        } else {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }) 
        }
      })();
    }, []);
   
   const confirmLocation = () => {
       setLocationRestaurant(location);
       toastRef.current.show("Localizacion guardada correctamente");
       setIsVisibleMap(false);
   }

  return (
      <Modal isVisible={isVisibleMap}
      setIsVisible={setIsVisibleMap}> 
        <View>
            {location && (
                <MapView
                style={styles.mapStyle}
                initialRegion={location}
                showsUserLocation={true}
                onRegionChange={(region) => setLocation(region)}
                >
                <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}    
                 draggable   
                />

                </MapView> 
            )}
            <View style={styles.viewMapBtn}>
               <Button title="Guardar Ubicacion" 
               containerStyle={styles.viewContainerSave} 
               buttonStyle={styles.viewMapBtnSave}
               onPress={confirmLocation}
               />
               <Button title="Cancelar Ubicacion" 
               containerStyle={styles.viewMapBtnContainerCancel} 
               buttonStyle={styles.viewMapBtnCancel}
               onPress={() => setIsVisibleMap(false)}
               />
            </View>
        </View>
      </Modal>
  )
} 

function UploadImage(props) {
     const { toastRef, imageSelected, setImageSelected } = props;


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
                aspect: [4,3]
            });
            
            if(result.cancelled) {
                toastRef.current.show(
                    "Has cerrado la galeria sin seleccionar ninguna imagen",
                    2000
                )
            } else {
                setImageSelected([...imageSelected, result.uri]);
            }
        }
    };
    
    const removeImage = (image) => {
       Alert.alert(
           "Eliminar imagen",
           "¿Estas seguro de que quieres eliminar la imagen?",
           [
            {
             text: "Cancel",
             style: "Cancel"   
           },
           {
               text: "Eliminar",
               onPress: () => {
                   setImageSelected(
                    filter(imageSelected, (imageUrl) => imageUrl !== image)
                   )
               }
           }
        ],
        { cancelable: false }
    )
};
    
    return (
        <View style={styles.viewImages}>
            {size(imageSelected) < 4 && (
            <Icon 
            type="material-community"
            name="camera"
            color="#7a7a7a"
            containerStyle={styles.containerIcon}
           onPress={imageSelect}
           />
        )}
            
        {map(imageSelected, (imageRestaurant, index) => (
            <Avatar 
             key={index}
             style={styles.minuatureStyle}
             source={{ uri: imageRestaurant }}
             onPress={() => removeImage(imageRestaurant)}
            /> 
            ))}
        </View>
    )
}
 
const styles = StyleSheet.create({
    ScrollView: {
      height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    minuatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680",
    },
});