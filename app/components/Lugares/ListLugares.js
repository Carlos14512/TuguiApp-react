import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from "react-native-elements"
import { size } from "lodash"
import { useNavigation } from "@react-navigation/native"

export default function ListLugares(props) {
    const { lugares, handleLoadMore, isLoading } = props
    const navigation = useNavigation();

    return (
        <View>
            {size(lugares) > 0 ? (
                <FlatList 
                  data={lugares}
                  renderItem={(lugares) => <Lugares lugares={lugares} navigation={navigation}/>}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReachedThreshold={0.5}
                  onEndReached={handleLoadMore}
                  ListFooterComponent={<FooterList 
                    isLoading={isLoading}
                  />}
                />
            ) : (
                <View style={styles.loaderLugares}>
                    <ActivityIndicator 
                    size="large"
                    />
                    <Text style={{ fontWeight: "bold" }}>
                        Cargando Lugares
                    </Text>
                </View>
            )}
        </View>
    )
}

function Lugares(props) {
    const { lugares, navigation } = props
    const { id, images, name, address, description } = lugares.item;
    const imageLugares = images[0]

    const goLugar = () => {
        navigation.navigate("lugaress", {
            id,
            name,
        })
    }

    return(
       <TouchableOpacity onPress={goLugar}>
         <View style={styles.viewLugar}>
          <View style={styles.viewLugarImage}>
            <Image 
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator color="#fff"/>}
              source={ 
                imageLugares
                ? { uri: imageLugares }
                : require("../../../assets/img/no-image.png") 
              }
              style={styles.imageLugares}
            />
          </View>
          <View>
              <Text style={styles.lugarName}>
                {name}
              </Text>
              <Text style={styles.lugarAddress}>
                  {address}
              </Text>
              <Text style={styles.lugarDescription}>
              {description.substr(0, 60)}...
              </Text>
          </View>
         </View>
       </TouchableOpacity>
    )
}


function FooterList(props) {
    const { isLoading } = props


    if(isLoading) {
        return(
            <View style={styles.loaderLugaress}>
                <ActivityIndicator 
                 size="large"

                />
            </View>
        )
    } else {
        return(
            <View style={styles.notFoundLugares}>
                <Text style={{ fontWeight: "bold" }}>
                    No quedan mas lugares por cargar.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderLugares: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
        
    },
    viewLugar: {
        flexDirection: "row",
        margin: 10
    },
    viewLugarImage: {
        marginRight: 15
    },
    imageLugares: {
        width: 80,
        height: 80
    },
    lugarName: {
        fontWeight: "bold"
    },
    lugarAddress: {
        paddingTop: 2,
        color: "grey"
    },
    lugarDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    notFoundLugares: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    }
})
