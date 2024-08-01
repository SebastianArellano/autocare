import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BottonModal from "../components/BottomModal";
import { API_BASE_URL } from "../config/config";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Por favor, ingrese un correo electrónico válido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres y contener números y caracteres especiales.",
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setModalMessage("Todos los campos son obligatorios.");
      setModalVisible(true);
      return;
    }
    if (emailError || passwordError || confirmPasswordError) {
      setModalMessage("Por favor, corrige los errores antes de continuar.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Usuario/Registrar`, {
        // Reemplaza con la URL de tu API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: firstName,
          Correo: email,
          Contraseña: password,
          Apellido: lastName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data === "CREADO") {
          setModalMessage("Registro completado.");
          setModalVisible(true);
          setTimeout(() => navigation.navigate("Login"), 1500);
        }

        if (data === "CORREOEXISTE") {
          setModalMessage("EL correo ya se encuentra registrado.");
          setModalVisible(true);
        }

        if (data === "USUARIOEXISTE") {
          setModalMessage("EL usuario ya se encuentra registrado.");
          setModalVisible(true);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#182D39" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Icon name="user" size={57} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.headerText}>Regístrate, es gratis!</Text>
            <Text style={styles.subHeaderText}>
              Completa el formulario de registro y crea tu cuenta
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Datos Personales</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombres</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Apellidos</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                onBlur={handleEmailBlur}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={handlePasswordBlur}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Icon
                    name={passwordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#ADB6C4"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={handleConfirmPasswordBlur}
                />
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <Icon
                    name={confirmPasswordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#ADB6C4"
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>REGISTRARSE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottonModal
        visible={modalVisible}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#182D39",
  },
  container: {
    flex: 1,
    backgroundColor: "#182D39",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    height: 219,
    backgroundColor: "#FD7B01",
    alignItems: "center",
    padding: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  icon: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    margin: 20,
    padding: 20,
    paddingTop: 30,
    marginTop: -50,
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#ADB6C4",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#001B2E",
    borderRadius: 5,
  },
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 5,
    fontSize: 15,
    color: "#294C60",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#001B2E",
    paddingVertical: 5,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: "#001B2E",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "90%",
    height: 51,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  loginButton: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FCA34A",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    width: "90%",
    height: 51,
  },
  loginButtonText: {
    color: "#FCA34A",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RegisterScreen;
