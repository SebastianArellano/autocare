import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/config";

const MaintenanceHistoryScreen = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Seleccionar");
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      try {
        const vehiculoId = await AsyncStorage.getItem("VehiculoId");
        if (vehiculoId) {
          const response = await fetch(
            `${API_BASE_URL}/api/Mantenimiento/Historial?vehiculoId=${vehiculoId}`,
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          // Verifica si data es un array
          if (Array.isArray(data)) {
            // Mapeo de campos
            const mappedData = data.map((item) => ({
              id: item.Id,
              date: item.Fecha,
              type: item.Mantenimiento,
              cost: item.Costo,
            }));
            setMaintenanceHistory(mappedData);
          } else {
            console.error("La respuesta de la API no es un array", data);
          }
        }
      } catch (error) {
        console.error("Error fetching maintenance history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceHistory();
  }, []);

  const filteredData = maintenanceHistory.filter((item) =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()),
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


  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FD7B01" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Icon name="bars" size={24} color="#294C60" style={styles.menuIcon} />
        <Icon
          name="history"
          size={50}
          color="#294C60"
          style={styles.historyIcon}
        />
        <Text style={styles.headerText}>HISTORIAL DE MANTENIMIENTOS</Text>
        <Text style={styles.subHeaderText}>
          Puedes revisar un historial de tus mantenimientos
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.filterLabel}>Filtro</Text>
        <View style={styles.filterRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFilter}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedFilter(itemValue)}
            >
              <Picker.Item label="Seleccionar" value="Seleccionar" />
              <Picker.Item label="Fecha" value="Fecha" />
              <Picker.Item label="Mantenimiento" value="Mantenimiento" />
              <Picker.Item label="Costo" value="Costo" />
            </Picker>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.filterInput}
              placeholder={`Filtrar por ${selectedFilter.toLowerCase()}`}
              placeholderTextColor="#CCCCCC"
              onChangeText={setSearchTerm}
              value={searchTerm}
              editable={selectedFilter !== "Seleccionar"}
            />
            <TouchableOpacity style={styles.searchButton}>
              <View style={styles.searchIconContainer}>
                <Icon name="search" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listHeader}>
          <View style={styles.headerDate}>
            <Text style={styles.listHeaderText}>Fecha</Text>
          </View>
          <View style={styles.headerType}>
            <Text style={styles.listHeaderText}>Mantenimiento</Text>
          </View>
          <View style={styles.headerCost}>
            <Text style={styles.listHeaderText}>Costo</Text>
          </View>
          <View style={styles.headerV}>
            <Text style={styles.listHeaderText}>V</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredData.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemDateContainer}>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
              <View style={styles.itemTypeContainer}>
                <Text style={styles.itemType}>{item.type}</Text>
              </View>
              <View style={styles.itemCostContainer}>
                <Text style={styles.itemCost}>{item.cost}</Text>
              </View>
              <TouchableOpacity style={styles.itemButton}>
                <Icon name="clipboard" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 213,
    marginTop: 40,
  },
  menuIcon: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  historyIcon: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#294C60",
    textAlign: "center",
  },
  subHeaderText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  contentContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 20,
    marginTop: -40,
    height: 520,
  },
  filterLabel: {
    fontSize: 14,
    color: "#001B2E",
    marginBottom: 5,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  picker: {
    height: 35,
    width: "100%",
    color: "#868383",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 35,
    width: 191,
  },
  filterInput: {
    flex: 1,
    color: "#182D39",
    padding: 5,
    fontSize: 16,
    backgroundColor: "#D9D9D9",
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  searchIconContainer: {
    width: 28,
    height: 26,
    backgroundColor: "#294C60",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  listHeader: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  headerDate: {
    backgroundColor: "#182D39",
    borderRadius: 7,
    height: 30,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginRight: 5,
    paddingHorizontal: 10,
  },
  headerType: {
    backgroundColor: "#182D39",
    borderRadius: 7,
    height: 30,
    width: 156,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginRight: 5,
    paddingHorizontal: 10,
  },
  headerCost: {
    backgroundColor: "#182D39",
    borderRadius: 7,
    height: 30,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginRight: 5,
    paddingHorizontal: 10,
  },
  headerV: {
    backgroundColor: "#182D39",
    borderRadius: 7,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 10,
  },
  listHeaderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  listContainer: {
    flexGrow: 1, // Permite que el contenido dentro del ScrollView se expanda
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 7,
    marginVertical: 5,
  },
  itemDateContainer: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#234152",
    borderRadius: 7,
    height: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  itemTypeContainer: {
    width: 156,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#234152",
    borderRadius: 7,
    height: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  itemCostContainer: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#234152",
    borderRadius: 7,
    height: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  itemDate: {
    color: "#FFFFFF",
    fontSize: 11,
  },
  itemType: {
    color: "#FFFFFF",
    fontSize: 11,
  },
  itemCost: {
    color: "#FFFFFF",
    fontSize: 11,
  },
  itemButton: {
    padding: 5,
    backgroundColor: "#234152",
    borderRadius: 7,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 10,
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

export default MaintenanceHistoryScreen;
