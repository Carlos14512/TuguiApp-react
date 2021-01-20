import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { Image, Icon, Button } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../components/Loading"
import { size } from "lodash"

import { firebaseApp } from "../utils/firebase"
import firebase from "firebase";
import "firebase/firestore"


const db = firebase.firestore(firebaseApp);


export default function Favorites(props) {
    const { navigation } = props;
    const [hoteless, setHoteless] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)
    const toastRef = useRef()

    
    firebase.auth().onAuthStateChanged((user) => {
     user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            if(userLogged) {
              const idUser = firebase.auth().currentUser.uid;
              db.collection("favoritesH")
                .where("idUser", "==", idUser)
                .get()
                .then((response) => {
                    const idHotelessArray = []
                  response.forEach((doc) => {
                   idHotelessArray.push(doc.data().idHoteless)
                  })
                  getDataHotel(idHotelessArray).then((response) => {
                    const hoteles = [];
                    response.forEach((doc) => {
                     const hoteless = doc.data();
                     hoteless.id = doc.id
                     hoteles.push(hoteless);
                    })
                    setHoteless(hoteles)
                  })
                })
            }
            setReloadData(false)
        }, [userLogged, reloadData])
    )



    const getDataHotel = (idHotelessArray) => {
      const arrayHoteless = [];
      idHotelessArray.forEach((idHoteless) => {
       const result = db.collection("Hoteles").doc(idHoteless).get()
       arrayHoteless.push(result);
      })
      return Promise.all(arrayHoteless)
    }

    if(!userLogged) {
        return <UserNoLogged navigation={navigation}/> 
      }
    
    
    if(hoteless?.length === 0) {
        return <NotFoundHoteless />
    }

    return (
        <View styles={styles.viewBody}>
            {hoteless ? (
                <FlatList 
                 data={hoteless}
                 renderItem={(hoteless) => (
                  <Hoteless hoteless={hoteless} 
                 setIsLoading={setIsLoading}  
                 toastRef={toastRef}
                 setReloadData={setReloadData}
                 navigation={navigation}
                 />
                 )}
                 keyExtractor={(item, index) => index.toString()}
                />
            ): (<View style={styles.loaderHoteles}>
                <ActivityIndicator 
                size="large"
                />
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Cargando Hoteles
                </Text> 
               </View>    
            )}
            <Toast 
             ref={toastRef}
             position="center"
             opacity={0.9}
            />
            <Loading 
              text="Eliminando Hotel"
              isVisible={isLoading}
            /> 
        </View>
    )
} 

function NotFoundHoteless() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Icon type="material-community" name="alert-outline" size={50} />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            No tienes hoteles en tu lista
            </Text> 
        </View>
      )
   }


function UserNoLogged(props) {
    const { navigation } = props;

    return (
      <View style={{ flex: 1, alignItems:"center", justifyContent: "center" }}>
        <Icon type="material-community" name="alert-outline" size={50} /> 
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Necesitas estar logeado para ver esta seccion
        </Text>
        <Button 
         title="Ir al login"
         containerStyle={{ marginTop: 20, width: "80%" }}
         buttonStyle={{ backgroundColor: "#00a680" }}
         onPress={() => navigation.navigate("account", { screen: "login" })}
        /> 
      </View>
    )
  }

function Hoteless(props) {
    const { hoteless, setIsLoading, toastRef, setReloadData, navigation } = props
    const { id, name, images } = hoteless.item


    const confirmRemoveFavorites = () => {
      Alert.alert(
        "Eliminar Hotel de Favoritos",
        "¿Estas seguro de que quieres eliminar el hotel de tus favoritos?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar",
            onPress: removefavorites
          },
        ],
        {cancelable: false}
      )
    }

    const removefavorites = () => {
      setIsLoading(true)
      db.collection("favoritesH")
        .where("idHoteless", "==", id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
         response.forEach((doc) => {
           const idFavoritess = doc.id;
           db.collection("favoritesH")
           .doc(idFavoritess)
           .delete()
           .then(() => {
             setIsLoading(false);
             setReloadData(true)
             toastRef.current.show("Hotel eliminado correctamente")
           })
            .catch(() => {
              toastRef.current.show("Error al eliminar el hotel")
            }) 
         })
        })
    }

    return (
        <View style={styles.Hotel}>
              <TouchableOpacity onPress={() => 
       navigation.navigate("hoteles", {screen: "hoteless", params: { id, name }})
      }>
            <Image
              resizeMode="cover"
              style={styles.image}
              PlaceholderContent={<ActivityIndicator  color="#fff"/>}
              source={
                  images[0]
                  ? { uri: images[0]}
                  : require("../../assets/img/no-image.png")
              }
            />
            <View style={styles.info}>
             <Text style={styles.name}>
                 {name}
             </Text>
              <Icon 
              type="material-community"
              name="heart"
              color="#f00"
              containerStyle={styles.favorite}
              onPress={confirmRemoveFavorites}
              underlayColor="transparent"
             />
             </View> 
            </TouchableOpacity>
        </View>
    )
}
  

const styles = StyleSheet.create({
    viewBody: {
        backgroundColor: "#f2f2f2",
    },
    loaderHoteles: {
        marginTop: 10,
        marginBottom: 10
    },
    Hotel: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
      },
      info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
        borderColor: "#000"
      
      },
      name: {
        fontWeight: "bold",
        fontSize: 20,
      },
      favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
    
      }
})
