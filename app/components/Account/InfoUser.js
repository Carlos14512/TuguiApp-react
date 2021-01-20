import React from "react";
import { StyleSheet, View, Text, Image  } from 'react-native';
import { Avatar, Accessory } from "react-native-elements";
import firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { result } from "lodash";


export default function Infouser(props) {
    const { 
        userInfo: { uid, photoURL, displayName, email },
        toastRef,
        setLoading,
        setLoadingText,
    } = props;
    
    
  
    const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)    
    const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

    if(resultPermissionCamera === "denied") {
     toastRef.current.show("Es necesario aceptar los permisos de la galeria");
    }else {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [16,12]
        });

       if(result.cancelled) {
           toastRef.current.show("Has cerrado la seleccion de imagenes");
       }else {
       uploadImage(result.uri).then(() => {
           updatePhotoUrl();
       })
       }
    }
    };

    const uploadImage =  async (uri) => {
        setLoadingText("Actualizando avatar");
        setLoading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const ref = firebase.storage().ref().child(`avatar/${uid}`);
      return ref.put(blob);
    };

    const updatePhotoUrl = () => {
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async (response) => {
          const update = {
              photoURL: response
          }
          await firebase.auth().currentUser.updateProfile(update);
          
          setLoading(false);
        });
    }


    return (
        <View style={styles.viewUserInfo}>
            <Avatar
            rounded
            size="large"
            showEditButton
            onPress={changeAvatar}
            containerStyle={styles.userInfoAvatar}
            source={
                photoURL
                ? { uri: photoURL}
                : require("../../../assets/img/descarga.png")
            }
            
            >
            <Accessory
            onPress={changeAvatar}
            />        
            </Avatar>
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anonimo"}
                </Text>
                <Text>
                    {email ? email: "Social Login"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
});