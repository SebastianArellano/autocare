import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Asegúrate de tener react-native-vector-icons instalado
import { API_BASE_URL } from "../config/config";
import BottonModal from "../components/BottomModal";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // Esta función se ejecuta cada vez que la pantalla se enfoca
      setEmail("");
      setPassword("");
    }, []),
  );

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("El correo o usuario es obligatorio.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
    } else {
      setPasswordError("");
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage("Todos los campos son obligatorios.");
      setModalVisible(true);
      return;
    }
    if (emailError || passwordError) {
      setModalMessage("Por favor, corrige los errores antes de continuar.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Usuario/Login`, {
        // Reemplaza con la URL de tu API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Correo: email,
          Contraseña: password,
          UsuarioSistema: email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.Respuesta === "LOGEADOCORRECTO") {
          await AsyncStorage.setItem("UsuarioId", data.UsuarioId.toString());
          if (data.VehiculoResgistrado) {
            showModal("Inicio de sesión correcto");
            setTimeout(() => navigation.navigate("Home"), 1500);
          } else {
            showModal("Registro de Vehiculo");
            showModal("Inicio de sesión correcto");
            setTimeout(() => navigation.navigate("RegistroVehiculo"), 1500);
          }
        }

        if (data.Respuesta === "NOEXISTEUSUARIO") {
          showModal("El correo no esta registrado ");
        }

        if (data.Respuesta === "CREDENCIALESINCORRECTAS") {
          showModal("El correo o la contraseña son incorrectos ");
        }
      } else {
        console.error("Error en el registro:", response.status);
        // Aquí puedes manejar errores, como mostrar un mensaje al usuario
      }
    } catch (error) {
      console.error("Error de red:", error);
      // Aquí puedes manejar errores de red, como mostrar un mensaje al usuario
    }
  };

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextPrimary}>Auto</Text>
            <Text style={styles.logoTextSecondary}>Care</Text>
          </Text>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/icon.png")}
              style={styles.logoImage}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Inicia sesión ahora</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onBlur={handleEmailBlur}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                onBlur={handlePasswordBlur}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="#ADB6C4"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => {
              /* navegación a pantalla de recuperación de contraseña */
            }}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña? Recupérala aquí
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>REGISTRARSE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottonModal
        visible={modalVisible}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    justifyContent: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 219,
    backgroundColor: "#FD7B01",
    alignItems: "center",
    padding: 20,
  },
  logoText: {
    marginTop: -50,
    flexDirection: "row",
    alignItems: "center",
  },
  logoTextPrimary: {
    fontSize: 53,
    fontWeight: "bold",
    color: "#294C60",
  },
  logoTextSecondary: {
    fontSize: 53,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Permite que el iconContainer se posicione dentro y fuera del header
    bottom: -80, // Coloca la mitad inferior del iconContainer fuera del header
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 90, // Ajuste para añadir espacio entre el formContainer y el iconContainer
  },
  title: {
    fontSize: 25,
    color: "#FD7B01",
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#F7A028",
    borderRadius: 5,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    fontSize: 15,
    color: "#294C60", // Margen para separar el label del borde del input
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#F7A028",
    paddingVertical: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  forgotPasswordText: {
    color: "#294C60",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 12,
  },
  loginButton: {
    width: "85%",
    height: 51,
    backgroundColor: "#001B2E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#FAFAFA",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerButton: {
    width: "85%",
    height: 51,
    borderColor: "#FD7B01",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FD7B01",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
});

export default LoginScreen;
