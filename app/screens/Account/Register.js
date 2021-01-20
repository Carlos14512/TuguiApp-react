import React, { useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/Account/RegisterForm";


export default function Register() {
  const toastRef = useRef();
  return (
      <KeyboardAwareScrollView>
          <Image 
          source={require("../../../assets/img/TuGuiApp.png")}
          resizeMode="contain" 
          style={styles.logo}
          />
          <View STYLE={styles.viewForm}>
              <RegisterForm toastRef={toastRef}/>
          </View>
          <Toast ref={toastRef} position="center" opacity={0.9}/>
      </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  logo: {
      width: "100%",
      height: 225,
      marginTop: 8,
  },
  viewForm: {
     marginRight: 40,
     marginLeft: 40,
  },

});