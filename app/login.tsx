import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "./SessionContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const router = useRouter();
  const { setSession } = useSession();

  const handleLogin = async () => {
    if (!username || !userNumber) {
      Alert.alert("Error", "Please enter both username and user number.");
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access location was denied"
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const userData = {
      username,
      userNumber,
      location,
    };

    await SecureStore.setItemAsync("userInfo", JSON.stringify(userData));
    setSession({ user: { username, userNumber, location }, isLoading: false });

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#3053c7ff",
          fontSize: 24,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        ISUBÜ IMELT
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Öğrenci Numarası"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={userNumber}
        onChangeText={setUserNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#161616ff",
  },
  input: {
    height: 50,
    backgroundColor: "#101010",
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#3053c7ff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
