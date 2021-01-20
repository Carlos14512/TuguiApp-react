import React, { useState } from "react";
import {  View, Text, StyleSheet, ScrollView, Image, Dimensions, ImageBackground } from "react-native";
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";
import { render } from "react-dom";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp)


export default function Home() {
    const navigation = useNavigation();
    const [userLogged, setUserLogged] = useState(false)
   



    firebase.auth().onAuthStateChanged((user) => {
     user ? setUserLogged (true) : setUserLogged(false)
    });
    
    
    return(
           
            <ImageBackground
            source={require("../../assets/img/home2.jpg")}
            style={styles.container}
            >
             <View style={styles.viewButton}>
             <Button
            title="⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀" 
            buttonStyle={styles.btnStyle}
            
            containerStyle={styles.btnContainers}
            onPress={() => navigation.navigate("home-search")}
            
            />
            <Button 
              buttonStyle={styles.btnStyle}
              containerStyle={styles.btnContainersH}
              title="⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
              onPress={() => navigation.navigate("hotel-search")}
            />

            <Button 
              buttonStyle={styles.btnStyle}
              containerStyle={styles.btnContainersl}
              title="⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ " 
              onPress={() => navigation.navigate("lugar-search")}
            />
            </View>
               
            {/* {userLogged ? (
                
              <Button
              title="Hechale un vistazo a tu cuenta!" 
              buttonStyle={styles.btnStyle}
              containerStyle={styles.btnContainer}
              onPress={() => navigation.navigate("Account")}
              />
            ) : (
                <Button
                title="Registrate!" 
                buttonStyle={styles.btnStyle}
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("login")}
                />
            )} */}
            </ImageBackground>
            
     
        // <View style={{ marginTop: -15, width, height }}>
        // <View style={styles.viewBtn}>
        
        //     <ScrollView 
        //       pagingEnabled 
        //       horizontal
        //       showsHorizontalScrollIndicator={false} 
        //       style={{ width, height }}>
        //     {
        //         images.map((image, index) => (
                    
        //         <Image
        //           key={index}
        //           source={{ uri: image }}
        //           style={{ width, height, resizeMode: "cover" }}
        //         />
        //         ))
        //     }
            
        //       </ScrollView>
              
        //       <Button
        //     title="Mira nuestro top 5 " 
        //     buttonStyle={styles.btnStyle}
        //     containerStyle={styles.btnContainer}
        //     onPress={() => navigation.navigate("topRestaurants")}
        //     />
        //     {userLogged ? (
        //       <Button
        //       title="Hechale un vistazo a tu cuenta!" 
        //       buttonStyle={styles.btnStyle}
        //       containerStyle={styles.btnContainer}
        //       onPress={() => navigation.navigate("Account")}
        //       />
        //     ) : (
        //         <Button
        //         title="Registrate!" 
        //         buttonStyle={styles.btnStyle}
        //         containerStyle={styles.btnContainer}
        //         onPress={() => navigation.navigate("login")}
        //         />
        //     )}
             
        //     </View>
        // </View>
        
        
        
        
      
        
        
        
        
        
        
        
       
    )
    
}


const styles = StyleSheet.create({
    viewBody:{
    // marginLeft: 40,
    // marginRight: 40
    },
    image: {
    height: 300,
    width: "100%",
    marginBottom: 40
    },
    title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
    width:0, height:0
    },
    btnStyle: {
        backgroundColor: "transparent",
        color: "transparent"
        

    },
    viewBtn: {
        flex: 100,
        alignItems: "center",
    },
    btnContainer: {
        width: "100%",
        alignItems: "center",
        
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    description: {
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center",
        marginBottom: 25,
        fontWeight: "bold",
        width:0, height:0
    },
    btnContainers: {
        width: "100%",
        alignItems: "center",
        paddingTop: 20,
        
    },
    btnStyleH: {
        backgroundColor: "transparent",
        color: "transparent"
    },
   
    viewButton: {
        flexDirection: "column",
        alignItems:"center",
    },
    btnContainersH: {
        width: "100%",
        justifyContent: "center",
        paddingTop: 200,
    },
    btnContainersl: {
        width: "100%",
        alignItems: "center",
        paddingTop: 200
    },
    viewButtonL: {
        flexDirection: "column",
        justifyContent:"center",
    },
})