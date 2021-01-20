import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading";


export default function LoginForm(props) {
    const { toastRef } = props;
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setformData] = useState(defaultFormValue());
   const [loading, setLoading] = useState(false);
   const navigation = useNavigation();


   const onChange = (e, type) => {
     setformData({ ...formData, [type]: e.nativeEvent.text})
   };    

   const OnSubmit = () => {
    if (
        isEmpty(formData.email) || 
        isEmpty(formData.password)
        ) {
            toastRef.current.show("Todos los campos son oblitarios");
        }   else if(!validateEmail(formData.email)) {
            toastRef.current.show("El email es incorrecto");
        }   else {
            setLoading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                setLoading(false);
                navigation.navigate("account");
            })
            .catch(err => {
                setLoading(false);
                toastRef.current.show("La contraseña o el gmail son incorrectos");
            });
        }
   };

   return (
       <View style={StyleSheet.formContainer}>
           <Input 
             placeholder="Correo electronico"
             containerStyle={styles.inputForm}
             onChange={(e) => onChange(e, "email")}
             rightIcon={
                 <Icon 
                   type="material-community"
                   name="at"
                   iconStyle={styles.iconRight}
                 /> 
             }
           />
           <Input 
             placeholder="Contraseña"
             containerStyle={styles.inputForm}
             password={true}
             secureTextEntry={showPassword ? false : true}
             onChange={(e) => onChange(e, "password")}
             rightIcon={
                 <Icon 
                  type="material-community"
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  iconStyle={styles.iconRight} 
                  onPress={() => setShowPassword(!showPassword)}
                 />
             }
           />
           <Button 
            title="Iniciar sesion"
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={OnSubmit}
           />
           <Loading isVisible={loading} text="Iniciando sesion"
           /> 
       </View>
   );
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
    };
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color : "#c1c1c1",
    },
})

