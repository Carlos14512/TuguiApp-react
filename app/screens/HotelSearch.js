import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";

export default function HotelSearch() {
    const navigation = useNavigation();



    return (
        // <ImageBackground
        // source={require("../../assets/img/hotelesSearch.jpg")}
        // style={styles.container}
        // >
        <View style={styles.restaurant}>
            <ScrollView>
            {/* <TouchableOpacity onPress={() => navigation.navigate("hoteles")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑯𝒐𝒕𝒆𝒍𝒆𝒔  
                </Text>
            </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate("top-5-hoteles")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1603428760740-c0089e3760f2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑻𝒐𝒑 5  
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("favorites")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1605148517575-3cc146936f38?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑭𝒂𝒗𝒐𝒓𝒊𝒕𝒐𝒔
                </Text>
            </View>
            </TouchableOpacity>
            </ScrollView>
        </View>
        // </ImageBackground>
    )
}

const styles = StyleSheet.create({
    restaurant: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 215,
        marginTop: 15
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 20,
        paddingVertical: 10,
        paddingBottom: 30,
        marginTop: -30,
        backgroundColor: "#fff",
        borderColor: "#000"
      
      },
      name: {
        fontWeight: "bold",
        fontSize: 25,
        marginTop: 10
      },
      container: {
        justifyContent: "center",
        flex: 1,

    },
})
