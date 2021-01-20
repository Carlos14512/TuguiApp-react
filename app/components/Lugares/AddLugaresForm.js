import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter, result } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp)

const widthScreen = Dimensions.get("window").width;


export default function AddLugaresForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [lugarName, setLugarName] = useState("");
    const [lugarAddress, setLugarAddress] = useState("")
    const [lugarDescription, setLugarDescription] = useState("")
    const [numeroLugar, setsNumeroLugar] = useState("")
    const [facebook, setFacebook] = useState("")
    const [instagram, setInstagram] = useState("")
    const [email, setEmail] = useState("")
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationLugar, setLocationLugar] = useState(null)


    const AddLugares = () => {
     if(!lugarName || !lugarAddress || !lugarDescription || !numeroLugar || !facebook || !instagram || !email) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");   
     } else if(size(imageSelected) === 0){
        toastRef.current.show("El lugar tiene que tener al menos una foto");   
     } else if(!locationLugar) {
        toastRef.current.show("Tienes que localizar el lugar en el Mapa");   
     } else if(!numeroLugar) {
        toastRef.current.show("Necesitamos el numero del Lugar");  
     } else if(!facebook) {
        toastRef.current.show("Necesitamos las redes sociales del lugar"); 
     } else if(!instagram) {
        toastRef.current.show("Necesitamos las redes sociales del lugar");
     } else if(!email) {
        toastRef.current.show("Necesitamos las redes sociales del lugar");
     } else {
         setIsLoading(true)
         UploadImageStorage().then((response) => {
             db.collection("Lugares")
                .add({
                name: lugarName,
                address:lugarAddress,
                description: lugarDescription,
                numero: numeroLugar,
                facebook: facebook,
                instagram: instagram,
                email: email,
                location: locationLugar,
                images: response,
                rating: 0,
                ratingTotal: 0,
                quantityVoting: 0,
                createAt: new Date(),
                createBy: firebase.auth().currentUser.uid,
                })
                .then(() => {
                    setIsLoading(false)
                    navigation.navigate("lugares");
                }) .catch(() => {
                    setIsLoading(false)
                    toastRef.current.show(
                        "Error al subir el Lugar, intentelo mas tarde"
                    )
                })
         })
     }
    }

    const UploadImageStorage = async () => {
      const imageBlob = [];

      await Promise.all(
        map(imageSelected, async (image) => {
            const response = await fetch(image)
            const blob = await response.blob()
            const ref = firebase.storage().ref("Lugares").child(uuid())
            await ref.put(blob).then(async (result) => {
                await firebase
                      .storage()
                      .ref(`Lugares/${result.metadata.name}`)
                      .getDownloadURL()
                      .then((photoUrl) => {
                          imageBlob.push(photoUrl);
                      })
            })
        })
      )
      return imageBlob;
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <ImageLugares 
            imageLugares={imageSelected[0]}
            />
            <FormAdd 
             setLugarName={setLugarName}
             setLugarAddress={setLugarAddress}
             setLugarDescription={setLugarDescription}
             setsNumeroLugar={setsNumeroLugar}
             setFacebook={setFacebook}
             setInstagram={setInstagram}
             setEmail={setEmail}
             setIsVisibleMap={setIsVisibleMap}
             locationLugar={locationLugar}
            />
            <UploadImage toastRef={toastRef}
            imageSelected={imageSelected}
            setImageSelected={setImageSelected}
            />
            <Button 
            title="Crear Lugar"
            onPress={AddLugares}
            buttonStyle={styles.btnAddLugares}
            />
            <Map 
            isVisibleMap={isVisibleMap}
            setIsVisibleMap={setIsVisibleMap}
            setLocationLugar={setLocationLugar}
            toastRef={toastRef}
            />
        </ScrollView>
    )
}

function ImageLugares(props) {
    const { imageLugares } = props

    return  (
        <View style={styles.viewPhoto}> 
        <Image 
        source={{ uri: imageLugares }}
        style={{ width: widthScreen, height: 200 }}
        />
        </View>
    )
}

function FormAdd(props) {
    const { setLugarName, setLugarAddress, setLugarDescription, setIsVisibleMap, setsNumeroLugar, setFacebook, setInstagram, setEmail, locationLugar  } = props
    return (
        <View style={styles.viewForm}>
            <Input 
              placeholder="Nombre del Lugar"
              containerStyle={styles.input}
              onChange={(e) => setLugarName(e.nativeEvent.text)}
            />
            <Input 
            placeholder="Direccion"
            containerStyle={styles.input}
            onChange={(e) => setLugarAddress(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "google-maps",
                color: locationLugar ? "#00a680" : "#c2c2c2",
                onPress: () => setIsVisibleMap(true)
            }}
            />
            <Input 
             placeholder="Numero"
             inputContainerStyle={styles.textArea}
             onChange={(e) => setsNumeroLugar(e.nativeEvent.text)}
             rightIcon={{
                type: "material-community",
                name: "phone",
                color: "#c2c2c2",
            }}
            />
            <Input 
             placeholder="Facebook"
             inputContainerStyle={styles.textArea}
             onChange={(e) => setFacebook(e.nativeEvent.text)}
             rightIcon={{
                type: "material-community",
                name: "facebook",
                color: "#c2c2c2",
            }}
            />
             <Input 
             placeholder="Instagram"
             inputContainerStyle={styles.textArea}
             onChange={(e) => setInstagram(e.nativeEvent.text)}
             rightIcon={{
                type: "material-community",
                name: "instagram",
                color: "#c2c2c2",
            }}
            />
             <Input 
             placeholder="Email"
             inputContainerStyle={styles.textArea}
             onChange={(e) => setEmail(e.nativeEvent.text)}
             rightIcon={{
                type: "material-community",
                name: "gmail",
                color: "#c2c2c2",
            }}
            />
            <Input 
             placeholder="Descripcion del Lugar"
             multiline={true}
             inputContainerStyle={styles.textArea}
             onChange={(e) => setLugarDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationLugar, toastRef  } = props;
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
              Permissions.LOCATION
            );
             const statusPermissions = resultPermissions.permissions.location.status
    
             if(statusPermissions !== "granted") {
                 toastRef.current.show("Tienes que aceptar los permisos de locacion para crear un restaurante", 
                 3000
                 )    
             } else {
                 const loc = await Location.getCurrentPositionAsync({});
                 setLocation({
                    latitude: loc.coords.latitude,
                 longitude: loc.coords.longitude,
                 latitudeDelta: 0.001,
                 longitudeDelta: 0.001
                 })
          }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationLugar(location);
        toastRef.current.show("Locacion guardada correctamente");
        setIsVisibleMap(false)
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
                        longitude: location.longitude
                    }}
                    draggable
                    />    
                   </MapView>
               )}
               <View style={styles.viewMapBtn}>
                <Button title="Guardar Ubicacion"
                containerStyle={styles.viewMapBtnContainerSave}
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
     const { toastRef, imageSelected, setImageSelected } = props

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        )

        if(resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manuelmente.",
            3000
            )
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if(result.cancelled) {
                toastRef.current.show(
                    "Has cerrado la galeria sin seleccionar ninguna imagen",
                    2000
                )
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
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
    }


    return(
        <View style={styles.viewImages}>
            {size(imageSelected) < 10 && (
             <Icon 
             type="material-community"
             name="camera"
             color="#7a7a7a"
             containerStyle={styles.containerIcon}
             onPress={imageSelect}
             />     
         )}
         {map(imageSelected, (imageLugares, index) => (
             <Avatar 
              key={index}
              style={styles.miniaturStyle}
              source={{ uri: imageLugares }}
              onPress={() => removeImage(imageLugares)}
             /> 
         ))}
        </View>
    )
}

const styles = StyleSheet.create({
    ScrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddLugares: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImages:{
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
        backgroundColor: "#e3e3e3"
    },
    miniaturStyle: {
         width: 70,
         height: 70,
         marginRight: 10,
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})
