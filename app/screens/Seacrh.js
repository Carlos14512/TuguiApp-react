import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })


export default function Search(props) {
   const { navigation } = props;
   const [search, setSearch] = useState("");
   const [restaurants, setRestaurants] = useState([]);
   const [hoteles, setHoteles] = useState([])
   const [lugares, setLugares] = useState([])
   
   useEffect(() => {
    if(search) {
     fireSQL
     .query(`SELECT * FROM Hoteles WHERE name LIKE '${search}%'`)
     .then((response) => {
        setHoteles(response);
     })
    }
}, [search])


   useEffect(() => {
       if(search) {
        fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
        .then((response) => {
            setRestaurants(response);
        })
       }
   }, [search])

   useEffect(() => {
    if(search) {
     fireSQL
     .query(`SELECT * FROM Lugares WHERE name LIKE '${search}%'`)
     .then((response) => {
      setLugares(response);
     })
    }
}, [search])

  
    return(
        <View>
            <SearchBar 
              placeholder="Busca tu restaurante, hotel o lugar..."
              onChangeText={(e) => setSearch(e)}
              value={search}
              containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 ? (
             <NotFoundRestaurants 
              
             />
            ) : (
            <FlatList 
              data={restaurants}
              renderItem={(restaurant) => (
              <Restaurant 
                restaurant={restaurant}
                navigation={navigation}
              />)}
              keyExtractor={(item, index) => index.toString()}
            />
            )}
            {hoteles.length === 0 ? (
                <NotFoundRestaurants />
            ): (
                <FlatList 
            data={hoteles}
            renderItem={(hoteless) => (
            <Hoteless 
            hoteless={hoteless}
              navigation={navigation}
            />)}
            keyExtractor={(item, index) => index.toString()}
          />
            )} 
            {lugares.length === 0 ? (
              <NotFoundRestaurants />
          ): (
              <FlatList 
          data={lugares}
          renderItem={(lugaress) => (
          <Lugaress 
          lugaress={lugaress}
            navigation={navigation}
          />)}
          keyExtractor={(item, index) => index.toString()}
        />
          )} 
        </View>
    );
}

function NotFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center" }}> 
        <Image 
          source={require("../../assets/img/no-result-found.png")}
          resizeMode="cover"
          style={{ width: 200, height: 200}}
        />
        </View>
    )
  
}

function Restaurant(props) {
 const {restaurant, navigation} = props;
 const { id, name, images } = restaurant.item;


 return (
     <ListItem 
       title={name}
       leftAvatar={{ 
           source: images[0] ? { uri : images[0] } : require("../../assets/img/no-image.png")
        }}
        rightIcon={<Icon type="material-community" name="chevron-right" />}
        onPress={() => navigation.navigate("restaurants", { screen: "restaurant", params: { id, name } })}
     />
 )
}


function Hoteless(props) {
    const {hoteless, navigation} = props;
    const { id, name, images } = hoteless.item;
   
   
    return (
        <ListItem 
          title={name}
          leftAvatar={{ 
              source: images[0] ? { uri : images[0] } : require("../../assets/img/no-image.png")
           }}
           rightIcon={<Icon type="material-community" name="chevron-right" />}
           onPress={() => navigation.navigate("hoteles", { screen: "hoteless", params: { id, name } })}
        />
    )
   }


   function Lugaress(props) {
    const {lugaress, navigation} = props;
    const { id, name, images } = lugaress.item;
   
   
    return (
        <ListItem 
          title={name}
          leftAvatar={{ 
              source: images[0] ? { uri : images[0] } : require("../../assets/img/no-image.png")
           }}
           rightIcon={<Icon type="material-community" name="chevron-right" />}
           onPress={() => navigation.navigate("lugares", { screen: "lugaress", params: { id, name } })}
        />
    )
   }
   
   const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
    }
})

  