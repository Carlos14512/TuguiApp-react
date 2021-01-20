import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import * as Font from 'expo-font';
import { decode, encode } from "base-64";

LogBox.ignoreAllLogs();

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;




export default function App() {

  return <Navigation />;
}
