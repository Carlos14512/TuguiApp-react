import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating } from "react-native-elements";

export default function ListTopLugares(props) {
    const { lugares, navigation } = props
    return (
        <FlatList 
          data={lugares}
          renderItem={(lugaress) => <Lugaress 
           lugaress={lugaress}
           navigation={navigation}

          />}
          keyExtractor={(item, index) => index.toString()}
        /> 
    )
}

function Lugaress (props) {
    const { lugaress, navigation } = props
    const { id, name, rating, images, description } = lugaress.item
    const [iconColor, setIconColor] = useState("#000")


    useEffect(() => {
        if(lugaress.index === 0) {
            setIconColor("#efb819")
        } else if(lugaress.index === 1) {
           setIconColor("#929292")
        } else if(lugaress.index === 2) {
            setIconColor("#cd7f32")
        }  
    }, []);

    return (
        <TouchableOpacity onPress={() => navigation.navigate("lugares", { screen: "lugaress", params: { id, name } })}>
            <Card containerStyle={styles.containerCard}>
            <Icon 
              type="material-community"
              name="chess-queen"
              color={iconColor}
              size={40}
              containerStyle={styles.containerIcon}
            />
            <Image 
            style={styles.restaurantImage}
            resizeMode="cover"
            source= {
               images[0]
                ? { uri: images[0]}
                : require("../../../assets/img/no-image.png")
            }
           />
            <View style={styles.titleRating}> 
              <Text style={styles.title}>{name}</Text>
              <Rating 
              imageSize={20}
              startingValue={rating}
              readonly
              /> 
            </View> 
            <Text style={styles.description}>{description}</Text>
        </Card>   
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 30,
        borderWidth: 0,
    },
    containerIcon: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1,
    },
    restaurantImage: {
        width: "100%",
        height: 200,
    },
    titleRating: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    title: {
       fontSize: 20,
       fontWeight: "bold",
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    }
})


