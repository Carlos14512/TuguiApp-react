import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Restaurants from "../screens/Restaurants/Restaurants"
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

export default function HomeSearch() {
    const navigation = useNavigation();



    return (
        <View style={styles.restaurant}>
            <ScrollView>
            {/* <TouchableOpacity onPress={() => navigation.navigate("restaurants")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑹𝒆𝒔𝒕𝒂𝒖𝒓𝒂𝒏𝒕𝒆𝒔  
                </Text>
            </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate("topRestaurants")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1606774473607-49a5a8f22d8c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑻𝒐𝒑 5
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("favoritess")}>
            <Image
             resizeMode="cover"
             style={styles.image}
             PlaceholderContent={<ActivityIndicator color="#fff"/>}
             source={{ uri: "https://images.unsplash.com/photo-1599021344713-953a54a000fe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80"}}
            />
            <View style={styles.info}>
                <Text style={styles.name}>
                𝑭𝒂𝒗𝒐𝒓𝒊𝒕𝒐𝒔
                </Text>
            </View>
            </TouchableOpacity>
            </ScrollView>
        </View>
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
})
