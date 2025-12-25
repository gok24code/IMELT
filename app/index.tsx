import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSession } from "./SessionContext";

export default function Index() {
  const { user, setSession } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userInfo");
    setSession({ user: null, isLoading: false });
    router.replace("/login");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: user.location.coords.latitude,

            longitude: user.location.coords.longitude,

            latitudeDelta: 0.0922,

            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: user.location.coords.latitude,

              longitude: user.location.coords.longitude,
            }}
            title="You are here"
          />
        </MapView>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.paragraph}>Adı Soyadı: {user.username}</Text>

        <Text style={styles.paragraph}>
          Öğrenci Numarası: {user.userNumber}
        </Text>
        {user.username === "admin" && (
          <Button title="Logout" onPress={handleLogout} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "black",
  },

  mapContainer: {
    flex: 1,
  },

  userInfoContainer: {
    position: "absolute",

    bottom: 20,

    left: 20,

    right: 20,

    padding: 16,

    backgroundColor: "#161616ff",

    borderRadius: 40,

    zIndex: 1,
  },

  paragraph: {
    color: "#d6d6d6ff",

    fontSize: 18,

    textAlign: "center",

    backgroundColor: "#00000000",
  },

  map: {
    width: "100%",

    height: "100%",
  },
});
