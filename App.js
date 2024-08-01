import { StyleSheet } from "react-native";

import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./screens/Login";
import Registro from "./screens/Registro";
import Home from "./screens/Home";
import Mantenimiento from "./screens/Mantenimientos";
import RegistroVehiculo from "./screens/RegistroVehiculo";
import Historial from "./screens/HistorialMantenimiento";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Mantenimiento"
          component={Mantenimiento}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Historial"
          component={Historial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistroVehiculo"
          component={RegistroVehiculo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  // return (
  //   <SafeAreaProvider>
  //     <View style={styles.container}>
  //       <StatusBar style="light" />
  //       <Main />
  //     </View>
  //   </SafeAreaProvider>
  // );

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
