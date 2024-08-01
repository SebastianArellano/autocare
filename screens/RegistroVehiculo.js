import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import BottonModal from "../components/BottomModal";
import { API_BASE_URL } from "../config/config";

const VehicleRegistrationScreen = ({ navigation }) => {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const value = await AsyncStorage.getItem("UsuarioId");
        if (value !== null) {
          setUsuarioId(value);
        }
      } catch (e) {
        console.error("Error al recuperar UsuarioId:", e);
      }
    };
    fetchUserId();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setModalMessage("Se requiere permiso para acceder a la galería");
      setModalVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      convertToBase64(result.assets[0].uri);
      console.log(image);
    }
  };

  // Convertir la imagen a Base64 y almacenarla en el estado
  const convertToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        //const base64 = reader.result.replace(/^data:.+;base64,/, "");
        setImage(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleRegister = async () => {
    if (!marca || !modelo || !anio || !kilometraje) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const data = {
      Marca: marca,
      Modelo: modelo,
      Año: anio,
      Kilometraje: kilometraje,
      UsuarioId: usuarioId,
      Imagen: image,
      Observacion: observaciones,
    };

    try {
      // Suponiendo que 'apiUrl' es la URL de tu API
      const response = await fetch(`${API_BASE_URL}/api/Vehiculo/Registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(data);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setModalMessage("Vehículo registrado exitosamente.");
        setModalVisible(true);
        setTimeout(() => navigation.navigate("Home"), 1500);
      } else {
        setModalMessage("No se pudo registrar el vehículo.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setModalMessage("Ocurrió un error al registrar el vehículo.");
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.header}>
          <Icon name="car" size={70} color="#294C60" style={styles.carIcon} />
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>VEHÍCULO</Text>
            <Text style={styles.subHeaderText}>
              Registra toda la información necesaria para tu vehículo
            </Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>DATOS DE VEHÍCULO</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              value={marca}
              onChangeText={setMarca}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              value={modelo}
              onChangeText={setModelo}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Año</Text>
            <TextInput
              style={styles.input}
              value={anio}
              onChangeText={setAnio}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kilometraje</Text>
            <TextInput
              style={styles.input}
              value={kilometraje}
              onChangeText={setKilometraje}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={styles.input}
              value={observaciones}
              onChangeText={setObservaciones}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto del Vehículo</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {image ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
          </View>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>GUARDAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: "#FD7B01",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 213,
  },
  carIcon: {
    marginBottom: 10,
  },
  headerContent: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#294C60",
  },
  subHeaderText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 20,
    padding: 20,
    marginTop: -50,
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#001B2E",
    borderRadius: 5,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#294C60",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#001B2E",
    paddingVertical: 5,
    fontSize: 16,
    color: "#182D39",
  },
  imagePicker: {
    backgroundColor: "#001B2E",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerText: {
    color: "#FAFAFA",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  registerButton: {
    backgroundColor: "#001B2E",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
    width: "90%",
    height: 51,
  },
  registerButtonText: {
    color: "#FAFAFA",
    fontWeight: "bold",
    fontSize: 20,
  },
  formHeader:{
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 10
  },
  formHeaderText:{
    fontSize: 15,
    color: "#294C60",
  },
});

export default VehicleRegistrationScreen;
