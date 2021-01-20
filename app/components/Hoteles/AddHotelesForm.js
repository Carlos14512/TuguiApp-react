import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uudi from "random-uuid-v4";
import Modal from "../Modal";


import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp)

const widthScreen = Dimensions.get("window").width;


export default function AddHotelesForm(props){
    const { toastRef, setIsLoading, navigation } = props;
    const [hotelName, setHotelName] = useState("")
    const [hotelAddress, setHotelAddress] = useState("")
    const [hotelDescription, sethotelDescription] = useState("")
    const [hotelNumero, setHotelNumero] = useState("")
    const [hotelEmail, setHotelEmail] = useState("")
    const [hotelFacebook, setHotelFacebook] = useState("")
    const [hotelInstagram, setHotelInstagram] = useState("")
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationHotel, setLocationHotel] = useState(null)
   


    const AddHoteles = () => {
    if(!hotelName || !hotelAddress || !hotelDescription || !hotelNumero || !hotelEmail || !hotelFacebook || !hotelInstagram) {
        toastRef.current.show("Todos los campos son obligatorios");
    } else if(size(imageSelected) === 0) {
       toastRef.current.show("El Hotel tiene que tener al menos una foto");
    } else if(!locationHotel) {
      toastRef.current.show("Tienes que localizar el hotel en el mapa")
    } else if(!hotelNumero) {
      toastRef.current.show("Necesitamos el numero de su Hotel")
    } else if(!hotelEmail) {
        toastRef.current.show("Necesitamos el email de el Hotel")
    }  else if(!hotelFacebook) {
        toastRef.current.show("Necesitamos sus redes sociales")
    } else if(!hotelInstagram) {
        toastRef.current.show("Necesitamos sus redes sociales")
    } else {

        setIsLoading(true)
     UploadImageStorage().then((response) => {
         db.collection("Hoteles")
          .add({
              name: hotelName,
              address: hotelAddress,
              description: hotelDescription,
              location: locationHotel,
              numero: hotelNumero,
              email: hotelEmail,
              facebook: hotelFacebook,
              instagram: hotelInstagram,
              images: response ,
              rating: 0,
              ratingTotal: 0,
              quantityVoting: 0,
              createAt: new Date(),
              createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("hoteles");
        }).catch(() => {
            setIsLoading(false);
            toastRef.current.show(
                "Error al subir el Hotel, intentelo mas tarde"
            )
        })
   });
}

};
     
     const UploadImageStorage = async () => {
      const imageBlob = [];
     
     await Promise.all(
        map(imageSelected, async(image) =>  {
            const response = await fetch(image)
            const blob = await response.blob();
            const ref = firebase.storage().ref("Hoteles").child(uudi());
            await ref .put(blob).then(async (result) => {
                await firebase
                .storage()
                .ref(`Hoteles/${result.metadata.name}`)
                .getDownloadURL()
                .then(photoUrl => {
                    imageBlob.push(photoUrl);
                })
            })
        })
      )
      
   
      return imageBlob;
     }


    return(
    <ScrollView style={StyleSheet.scrollView}>
      <ImageHoteles imageHoteles={imageSelected[0]}
      
      />
      <FormAdd 
      setHotelName={setHotelName}
      setHotelAddress={setHotelAddress}
      sethotelDescription={sethotelDescription}
      setHotelNumero={setHotelNumero}
      setHotelEmail={setHotelEmail}
      setHotelFacebook={setHotelFacebook}
      setHotelInstagram={setHotelInstagram}
      setIsVisibleMap={setIsVisibleMap}
      locationHotel={locationHotel}
      />
      <UploadImage 
      toastRef={toastRef}
      imageSelected={imageSelected}
      setImageSelected={setImageSelected}
      /> 
      <Button 
      title="Crear Hotel"
      onPress={AddHoteles}
      buttonStyle={styles.btnAddHoteles}
      />
      <Map 
      isVisibleMap={isVisibleMap}
      setIsVisibleMap={setIsVisibleMap}
      setLocationHotel={setLocationHotel}
      toastRef={toastRef}
      />  
    </ScrollView>
);
}

function ImageHoteles(props) {
    const { imageHoteles } = props;

    return (
        <View style={styles.viewPhoto}>
         <Image 
         source={{ uri: imageHoteles }}
         style={{ width: widthScreen, height: 200 }}
         /> 
        </View>
    )
}

function FormAdd(props) {
   const { 
       setHotelName,
       setHotelAddress,
       sethotelDescription,
       setHotelNumero,
       setHotelEmail,
       setHotelFacebook,
       setHotelInstagram,
       setIsVisibleMap,
       locationHotel 
    } = props;
    return(
        <View style={styles.viewForm}>
            <Input 
             placeholder="Nombre del Hotel"
             containerStyle={styles.input}
             onChange={(e) => setHotelName(e.nativeEvent.text)}
            />
            <Input 
            placeholder="Direccion del Hotel"
            containerStyle={styles.input}
            onChange={(e) => setHotelAddress(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "google-maps",
                color: locationHotel ? "#00a680" : "#c2c2c2",
                onPress: () => setIsVisibleMap(true)
            }}
            />
            <Input 
            placeholder="Numero del Hotel"
            containerStyle={styles.input}
            onChange={(e) => setHotelNumero(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "phone",
                color: "#c2c2c2",
               
            }}
            />
            <Input 
            placeholder="Email del Hotel"
            containerStyle={styles.input}
            onChange={(e) => setHotelEmail(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "at",
                color: "#c2c2c2",
               
            }}
            />
             <Input 
            placeholder="Facebook"
            containerStyle={styles.input}
            onChange={(e) => setHotelFacebook(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "facebook",
                color: "#c2c2c2",
               
            }}
            />
              <Input 
            placeholder="Instagram"
            containerStyle={styles.input}
            onChange={(e) => setHotelInstagram(e.nativeEvent.text)}
            rightIcon={{
                type: "material-community",
                name: "instagram",
                color: "#c2c2c2",
               
            }}
            />    
            <Input 
            placeholder="Descripcion del Hotel"
            multiline={true}
            inputContainerStyle={styles.textArea}
            onChange={(e) => sethotelDescription(e.nativeEvent.text)}

            /> 
        </View>
    )
}


function Map(props) {
    const {
        isVisibleMap, 
        setIsVisibleMap, 
        setLocationHotel, 
        toastRef} = props
    const [location, setLocation] = useState(null);

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
    })();
    }, [])
     
    const confirmLocation = () => {
        setLocationHotel(location) ; 
        toastRef.current.show("Locacion guardada correctamente");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
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
                  <Button 
                  title="Cancelar Ubicacion" 
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
     );

     

     if(resultPermissions === "denied") {
        toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manuelmente.",
        3000
        )
     } else {
         const result = await ImagePicker.launchImageLibraryAsync({
             allowsEditing: true,
             aspect: [4, 3]
         });

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
            "¿Estas seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageURL) => imageURL !== image)
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImages}>
            {size(imageSelected) < 15 && (
              <Icon 
              type="material-community"
              name="camera"
              color= "#7a7a7a"
              containerStyle={styles.containerIcon}
              onPress={imageSelect}
             /> 
            )} 
           {map(imageSelected, (imageHoteles, index) => (
               <Avatar
               key={index}
               style={styles.miniatureStyle}
               source={{ uri: imageHoteles }}
               onPress={() => removeImage(imageHoteles)}
               /> 
           ))}
        </View>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddHoteles: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImages: {
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
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
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
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})