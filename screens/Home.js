import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomModal from "../components/BottomModal";
import { API_BASE_URL } from "../config/config";
import { useFocusEffect } from "@react-navigation/native";


const defaultCarImage = require("../assets/car-image.png"); // Imagen predeterminada

const HomeScreen = ({ navigation }) => {
  const [carImage, setCarImage] = useState(defaultCarImage);
  const [carTitle, setCarTitle] = useState("MI AUTO SEDÁN");
  const [info, setInfo] = useState({
    model: "Sedán",
    year: "2020",
    mileage: "20 000 km",
    lastMaintenance: "12/07/2024",
    nextMaintenance: "12/12/2024"
  });

  const fetchCarData = useCallback(async () => {
    try {
      // Obtener usuarioId de AsyncStorage
      const usuarioId = await AsyncStorage.getItem('UsuarioId');
      if (usuarioId) {
        // URL con parámetro usuarioId
        const response = await fetch(`${API_BASE_URL}/api/Home/ObtenerInformacion?usuarioId=${usuarioId}`);
        const data = await response.json();
        
        await AsyncStorage.setItem("VehiculoId", data.VehiculoId.toString());

        if (data.Imagen) {
          setCarImage({ uri: data.Imagen });
        } else {
          setCarImage(defaultCarImage); // Imagen predeterminada si la base64 es nula
        }

        setCarTitle(data.Titulo || "MI AUTO SEDÁN");
        setInfo({
          model: data.Modelo || "Sedán",
          year: data.Año || "2020",
          mileage: data.Kilometraje || "20 000 km",
          lastMaintenance: data.UltimoMantenimiento || "12/07/2024",
          nextMaintenance: data.ProximoMantenimiento || "12/12/2024"
        });
      } else {
        console.error("UsuarioId no encontrado en AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      setCarImage(defaultCarImage); // Imagen predeterminada en caso de error
    }
  }, []);

  // Ejecuta fetchCarData cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      fetchCarData();
    }, [fetchCarData])
  );

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
      <View style={styles.header}>
        <Icon name="bars" size={24} color="#294C60" style={styles.menuIcon} />
        <Icon
          name="bell"
          size={24}
          color="#294C60"
          style={styles.notificationIcon}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.carImageContainer}>
          <Image
            source={carImage}
            style={styles.carImage}
          />
        </View>
        <Text style={styles.carTitle}>{carTitle}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modelo:</Text>
            <Text style={styles.infoText}>{info.model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Año:</Text>
            <Text style={styles.infoText}>{info.year}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kilometraje:</Text>
            <Text style={styles.infoText}>{info.mileage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Último mantenimiento:</Text>
            <Text style={styles.infoText}>{info.lastMaintenance}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Próximo mantenimiento:</Text>
            <Text style={styles.infoText}>{info.nextMaintenance}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleHome} 
        >
          <Icon name="home" size={40} color="#294C60" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="users" size={40} color="#294C60" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="cog" size={40} color="#294C60" />
        </TouchableOpacity>
      </View>
      {/* Aquí puedes agregar el BottomModal si es necesario */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#182D39",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FD7B01",
    padding: 15,
    marginTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuIcon: {
    marginLeft: 10,
  },
  notificationIcon: {
    marginRight: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  carImageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 160, // Mismo radio de borde que el contenedor
    padding: 10,
    marginBottom: 10,
    height: 320,
    width: 320,
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden', // Asegura que la imagen sea recortada en forma de círculo
  },
  carImage: {
    width: '100%', // Ajusta la imagen al ancho del contenedor
    height: '100%', // Ajusta la imagen a la altura del contenedor
    resizeMode: 'cover', // 'cover' para llenar el contenedor sin distorsionar
    borderRadius: 160,
  },
  carTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#264658",
    padding: 20,
    borderRadius: 20,
    width: 311,
    height: 228,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    width: 180,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 15,
    flexShrink: 1,
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#264658",
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FD7B01",
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
