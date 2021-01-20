import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating } from "react-native-elements";
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function LisTopHoteles(props) {
    const { hoteles, navigation } = props
    return (
     <FlatList 
       data={hoteles}
       renderItem={(hoteless) => <Hoteless 
          hoteless={hoteless}
          navigation={navigation}
       /> }
       keyExtractor={(item, index) => index.toString()}
     />
    )
}

function Hoteless(props) {
    const { hoteless, navigation } = props
    const {id, name, rating, images, description} = hoteless.item; 
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if(hoteless.index === 0) {
            setIconColor("#efb819")
        } else if(hoteless.index === 1) {
           setIconColor("#929292")
        } else if(hoteless.index === 2) {
            setIconColor("#cd7f32")
        }  
    }, []);

    return (
        <TouchableOpacity onPress={() => 
            navigation.navigate("hoteles", {screen: "hoteless", params: { id, name }})
           }>
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
