import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { Image, Icon, Button } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../components/Loading"

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)

export default function FavoritesL(props) {
    const { navigation } = props
    const [lugares, setLugares] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [isloading, setIsloading] = useState(false)
    const [reloadData, setReloadData] = useState(false);
    const toastRef = useRef()



    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
           if(userLogged) {
              const idUser = firebase.auth().currentUser.uid;
              db.collection("favoritesl")
              .where("idUser", "==", idUser)
              .get()
              .then((response) => {
                  const idLugaresArray = []
                response.forEach((doc) => {
                   idLugaresArray.push(doc.data().idLugares)
                })
                getDataLugaress(idLugaresArray).then((response) => {
                  const lugares = []
                  response.forEach((doc) => {
                    const lugaress = doc.data()
                    lugaress.id = doc.id
                    lugares.push(lugaress)
                  })
                  setLugares(lugares)
                })
              })
           }
           setReloadData(false)
        }, [userLogged, reloadData])
    )

   


    const getDataLugaress = (idLugaresArray) => {
    const arrayLugares = []
    idLugaresArray.forEach((idLugares) => {
     const result = db.collection("Lugares").doc(idLugares).get()
     arrayLugares.push(result)
    })
      return Promise.all(arrayLugares)
    }

    if(!userLogged) {
        return <UserNoLogged 
           navigation={navigation}        
        />
    }
    
    if(lugares?.length === 0) {
      return <NotFoundLugares />
    }
    


    return (
        <View style={styles.viewBody}>
         {lugares ? (
             <FlatList 
               data={lugares}
               renderItem={(lugaress) => <Lugaress lugaress={lugaress} setIsloading={setIsloading} toastRef={toastRef} setReloadData={setReloadData} navigation={navigation}/>}
               keyExtractor={(item, index) => index.toString()}
             />
         ) : (
             <View style={styles.loaderLugares}>
                 <ActivityIndicator 
                   size="large"
                 />
                 <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                     Cargando Lugares
                 </Text>
             </View>
         )}
         <Toast 
            ref={toastRef} position="center" opacity={0.9}
         />
         <Loading 
           text="Eliminando lugar" isVisible={isloading}
         />
        </View>
    )
}




function NotFoundLugares() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restaurantes en tu lista
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



function Lugaress(props) {
    const { lugaress, setIsloading, toastRef, setReloadData, navigation } = props
    const { id, name, images } = lugaress.item


   const confirmRemoveFavorite = () => {
      Alert.alert(
          "Eliminar lugar de favoritos",
          "Estas seguro de eliminar el lugar de favoritos?",
          [ 
            {
                text: "Cancelar",
                 style: "cancel"
            },
            {
                text: "Eliminar",
                onPress: removeFavorite
            },
          ],
          { cancelable: false }
      )
   }


   const removeFavorite = () => {
       setIsloading(true)
       db.collection("favoritesl")
       .where("idLugares", "==", id)
       .where("idUser", "==", firebase.auth().currentUser.uid)
       .get()
       .then((response) => {
         response.forEach((doc) => {
            const idFavorite = doc.id
            db.collection("favoritesl")
            .doc(idFavorite)
            .delete()
            .then(() => {
                setIsloading(false)
                setReloadData(true)
                toastRef.current.show("Lugar eliminado correctamente")
            })
            .catch(() => {
                toastRef.current.show("Error al eliminar el lugar de favoritos");
            })
         })
       })
   }


    return (
        <View style={styles.lugares}>
            <TouchableOpacity onPress={() => 
       navigation.navigate("lugares", {
           screen: "lugaress",
           params: { id }
       })
      }>
                <Image 
                  resizeMode="cover"
                  style={styles.image}
                  PlaceholderContent={<ActivityIndicator color="#fff" />}
                  source={
                      images[0]
                       ? { uri: images[0] }
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
                  onPress={confirmRemoveFavorite}
                  underlayColor="transparent"
                 />
                </View>
            </TouchableOpacity>
        </View>
    )
} 

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2",
      },
      loaderLugares: {
        marginTop: 10,
        marginBottom: 10,
      },
      lugares: {
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
