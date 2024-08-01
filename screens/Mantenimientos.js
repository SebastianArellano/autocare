import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/config";
import BottomModal from "../components/BottomModal";

const MaintenanceScreen = ({ navigation }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState("");
  const [costo, setCosto] = useState("");
  const [taller, setTaller] = useState("");
  const [horario, setHorario] = useState("");
  const [observacion, setObservacion] = useState("");
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formattedDate = formatDate(selectedDate);
    setDate(formattedDate);
    hideDatePicker();
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = {};

    if (!tipoMantenimiento) {
      newErrors.tipoMantenimiento = "El tipo de mantenimiento es obligatorio.";
      isValid = false;
    }

    if (!costo) {
      newErrors.costo = "El costo es obligatorio.";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "La fecha es obligatoria.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setModalMessage("Por favor, corrige los errores antes de continuar.");
      setModalVisible(true);
      return;
    }

    try {
      const vehiculoId = await AsyncStorage.getItem("VehiculoId");
      const response = await fetch(
        `${API_BASE_URL}/api/Mantenimiento/Registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TipoMantenimiento: tipoMantenimiento,
            Costo: costo,
            Fecha: date,
            Observacion: observacion,
            VehiculoId: vehiculoId,
            Taller: taller,
            Horario: horario,
          }),
        },
      );

      const result = await response.json();
      if (response.ok) {
        setModalMessage("Mantenimiento registrado con éxito");
        setModalVisible(true);
      } else {
        setModalMessage("Error al registrar mantenimiento");
        setModalVisible(true);
        console.error("Error:", result);
      }
    } catch (error) {
      setModalMessage("Error al registrar mantenimiento");
      setModalVisible(true);
      console.error("Error:", error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleMantenimiento = () => {
    navigation.navigate("Mantenimiento");
  };

  const handleHistorialMantenimiento = () => {
    navigation.navigate("Historial");
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Icon
                name="car"
                size={70}
                color="#294C60"
                style={styles.carIcon}
              />
              <Text style={styles.headerText}>MANTENIMIENTOS</Text>
              <Text style={styles.subHeaderText}>
                Registra los datos para crear un nuevo mantenimiento de tu
                vehículo
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>DATOS DE MANTENIMIENTO</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Mantenimiento</Text>
              <TextInput
                style={styles.defaultInput}
                value={tipoMantenimiento}
                onChangeText={setTipoMantenimiento}
                onBlur={() => {
                  if (!tipoMantenimiento) {
                    setErrors((prev) => ({
                      ...prev,
                      tipoMantenimiento:
                        "El tipo de mantenimiento es obligatorio.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, tipoMantenimiento: "" }));
                  }
                }}
              />
              {errors.tipoMantenimiento ? (
                <Text style={styles.errorText}>{errors.tipoMantenimiento}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Costo ($)</Text>
              <TextInput
                style={styles.defaultInput}
                keyboardType="decimal-pad"
                value={costo}
                onChangeText={setCosto}
                onBlur={() => {
                  if (!costo) {
                    setErrors((prev) => ({
                      ...prev,
                      costo: "El costo es obligatorio.",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, costo: "" }));
                  }
                }}
              />
              {errors.costo ? (
                <Text style={styles.errorText}>{errors.costo}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha Programada</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={showDatePicker}
              >
                <Icon
                  name="calendar"
                  size={20}
                  color="#294C60"
                  style={styles.calendarIcon}
                />
                <Text style={styles.dateInput}>{date || ""}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                locale="es"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              {errors.date ? (
                <Text style={styles.errorText}>{errors.date}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Taller</Text>
              <TextInput
                style={styles.defaultInput}
                value={taller}
                onChangeText={setTaller}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Horario</Text>
              <TextInput
                style={styles.defaultInput}
                multiline
                value={horario}
                onChangeText={setHorario}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observaciones</Text>
              <TextInput
                style={styles.defaultInput}
                multiline
                value={observacion}
                onChangeText={setObservacion}
              />
            </View>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit}
            >
              <Text style={styles.registerButtonText}>REGISTRAR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleMantenimiento}
            >
              <Icon name="car" size={40} color="#294C60" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleHistorialMantenimiento}
            >
              <Icon name="book" size={40} color="#294C60" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={handleHome}>
              <Icon name="home" size={40} color="#294C60" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Icon name="users" size={40} color="#294C60" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Icon name="cog" size={40} color="#294C60" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomModal
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
    marginTop: 40,
  },
  headerContent: {
    alignItems: "center",
  },
  carIcon: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#294C60",
  },
  subHeaderText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    margin: 20,
    padding: 20,
    marginTop: -40,
    alignItems: "center",
    marginBottom: 65
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "regular",
    color: "#294C60",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: "#001B2E",
    borderRadius: 5,
    width: "100%",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#294C60",
  },
  defaultInput: {
    borderBottomWidth: 1,
    borderColor: "#001B2E",
    height: 30,
    fontSize: 16,
    color: "#001B2E",
    paddingHorizontal: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#001B2E",
    height: 40,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateInput: {
    fontSize: 16,
    color: "#001B2E",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: "#001B2E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 51,
    width: "90%",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FD7B01",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MaintenanceScreen;
