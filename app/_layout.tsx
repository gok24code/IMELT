import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SessionProvider, useSession } from "./SessionContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Layout />
    </SessionProvider>
  );
}

function Layout() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  // This useEffect handles navigation based on session state.
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, user, router]);

  // This useEffect handles the background location sending task.
  useEffect(() => {
    // Only run the task if the user is logged in.
    if (!user) {
      return;
    }

    const sendData = async () => {
      console.log("Attempting to send user and location data...");

      // Check for permissions
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        // Request permissions only once if not granted.
        let { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") {
          console.log("Location permission denied. Cannot send data.");
          // Optionally, you could alert the user here on the first denial.
          // Alert.alert("Permission Denied", "Location access is needed to track data.");
          return; // Stop the function if permission is not granted.
        }
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log(`Location acquired: ${latitude}, ${longitude}`);

        // !!!! ---- API ADRESİNİZİ BURAYA GİRİN ---- !!!!
        const apiEndpoint = "https://45.84.189.66";

        const payload = {
          username: user.username,
          userNumber: user.userNumber,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          console.log("Data sent successfully at", payload.timestamp);
        } else {
          const responseText = await response.text();
          console.error(
            "Failed to send data. Server responded with:",
            response.status,
            responseText
          );
        }
      } catch (error) {
        console.error("An error occurred while sending data:", error);
      }
    };

    // Run once immediately on login, then set up the interval.
    sendData();
    const intervalId = setInterval(sendData, 5 * 60 * 1000); // 5 minutes

    // Cleanup function to clear the interval when the component unmounts or user logs out.
    return () => {
      clearInterval(intervalId);
      console.log("Background data sending stopped.");
    };
  }, [user]); // Rerun this effect if the user state changes (login/logout)

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#3053c7ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
