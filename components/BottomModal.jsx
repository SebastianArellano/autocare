// BottomModal.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';

const BottomModal = ({ visible, message, onClose }) => {
  const animation = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, 4000); // Modal se cierra automáticamente después de 15 segundos

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: animation }]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0, // Posiciona el modal en la parte inferior de la pantalla
    left: 0,
    right: 0,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#FD7B01',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BottomModal;
