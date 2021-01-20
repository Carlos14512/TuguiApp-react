import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from "react-native-elements"
import { size } from "lodash"
import { useNavigation } from "@react-navigation/native"

export default function ListHoteles(props) {
    const { hoteles, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();
    return (
        <View>
            {size(hoteles) > 0 ? (
                <FlatList 
                data={hoteles}
                renderItem={(hoteles) => <Hoteles hoteles={hoteles} navigation={navigation}/>}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                ListFooterComponent={<FooterList  isLoading={isLoading}
                isLoading={isLoading}
                />}
                />
            ) : (
            <View style={styles.loaderHoteles}>
                <ActivityIndicator 
                size="large" />
                <Text style={{ fontWeight: "bold" }}>Cargando Hoteles</Text>
            </View>
            )}
        </View>
    )
}



 function Hoteles(props) {
     const { hoteles, navigation } = props;
     const { id, images, name, address ,description } = hoteles.item;
     const imageHotel = images[0]

      
     const  goHotel = () => {
    navigation.navigate("hoteless", {
        id,
        name
    })

    }

     return (
        <TouchableOpacity onPress={goHotel}>
        <View style={styles.viewHotel}>
          <View style={styles.viewHotelImage}>
           <Image 
             resizeMode="cover"
             PlaceholderContent={<ActivityIndicator 
             color="fff"
             />
            }
            source={ 
                imageHotel
                ? { uri: imageHotel }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageHotel}
           />
          </View>
          <View>
              <Text style={styles.HotelName}>
                {name}
              </Text>
              <Text style={styles.HotelAddress}>
                  {address}
              </Text>
              <Text style={styles.HotelDescription}>
                  {description.substr(0, 60)}...
              </Text>
          </View>
        </View>
        </TouchableOpacity>
     )
 }

 function FooterList(props) {
     const { isLoading } = props;

     if(isLoading) {
         return (
         <View style={styles.loaderHoteles}>
          <ActivityIndicator 
          size="large"

          />
         </View>         
        )
     } else {
         return (
             <View style={styles.notFoundHotel}>
                 <Text style={{ fontWeight: "bold"}}>
                     No quedan Hoteles por cargar
                 </Text>
             </View>
         )
     }
 }



const styles = StyleSheet.create({
    loaderHoteles: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewHotel: {
        flexDirection: "row",
        margin: 10
    },
    viewHotelImage: {
        marginRight: 15
    },
    imageHotel: {
        width: 80,
        height: 80
    },
    HotelName: {
        fontWeight: "bold",
    },
    HotelAddress: {
        paddingTop: 2,
        color: "grey"
    },
    HotelDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    notFoundHotel: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
        
    }
})
