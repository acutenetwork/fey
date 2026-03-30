import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { QRCode } from "@acutenetwork/fey/native";

export default function App() {
  const [exportedUri, setExportedUri] = useState<string | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>@acutenetwork/fey</Text>
      <Text style={styles.subtitle}>React Native Playground</Text>

      {/* Basic QR */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>DEFAULT</Text>
        <QRCode
          data="https://example.com"
          width={200}
          height={200}
        />
      </View>

      {/* Styled QR */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ROUNDED + COLOR</Text>
        <QRCode
          data="https://github.com/acutenetwork/fey"
          width={200}
          height={200}
          dotsOptions={{ type: "rounded", color: "#4267b2" }}
          cornersSquareOptions={{ type: "extra-rounded", color: "#4267b2" }}
          cornersDotOptions={{ type: "dot", color: "#4267b2" }}
          backgroundOptions={{ color: "#e9ebee" }}
        />
      </View>

      {/* Gradient QR */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>GRADIENT</Text>
        <QRCode
          data="https://acute.network"
          width={200}
          height={200}
          dotsOptions={{
            type: "classy-rounded",
            gradient: {
              type: "linear",
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: "#8B5CF6" },
                { offset: 1, color: "#EC4899" },
              ],
            },
          }}
          cornersSquareOptions={{ type: "extra-rounded", color: "#7C3AED" }}
          cornersDotOptions={{ type: "dot", color: "#7C3AED" }}
          backgroundOptions={{ color: "#FAF5FF" }}
        />
      </View>

      {/* Circle shape */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CIRCLE SHAPE</Text>
        <QRCode
          data="https://acute.network"
          width={200}
          height={200}
          shape="circle"
          dotsOptions={{ type: "dots", color: "#059669" }}
          cornersSquareOptions={{ type: "dot", color: "#047857" }}
          cornersDotOptions={{ type: "dot", color: "#047857" }}
          backgroundOptions={{ color: "#ECFDF5" }}
        />
      </View>

      {/* Export example */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>EXPORT TO BASE64</Text>
        <QRCode
          data="https://example.com/export"
          width={200}
          height={200}
          dotsOptions={{ type: "extra-rounded", color: "#DC2626" }}
          backgroundOptions={{ color: "#FEF2F2" }}
          onReady={({ toDataURL }) => {
            toDataURL().then((uri) => {
              setExportedUri(uri);
            });
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (exportedUri) {
              Alert.alert("Data URI", exportedUri.substring(0, 100) + "...");
            }
          }}
        >
          <Text style={styles.buttonText}>Show Data URI</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: "#888",
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 13,
    color: "#333",
  },
});
