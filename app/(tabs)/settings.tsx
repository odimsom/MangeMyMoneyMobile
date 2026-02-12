import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GlassCard } from "@/components/ui/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@react-navigation/native"; // Or custom context if we had one
import { Alert, ScrollView, StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Profile Section */}
          <GlassCard variant="default" style={styles.profileCard}>
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarText}>
                {user?.firstName?.charAt(0) || "U"}
              </ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="subtitle">
                {user?.firstName} {user?.lastName}
              </ThemedText>
              <ThemedText style={styles.email}>{user?.email}</ThemedText>
            </View>
          </GlassCard>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>PREFERENCES</ThemedText>
            <GlassCard style={styles.menuItem}>
              <View style={styles.menuRow}>
                <IconSymbol
                  name="moon.fill"
                  size={20}
                  color={theme.colors.text}
                />
                <ThemedText style={styles.menuText}>Dark Mode</ThemedText>
                <Switch value={colorScheme === "dark"} disabled={true} />
              </View>
            </GlassCard>
            <GlassCard style={styles.menuItem}>
              <View style={styles.menuRow}>
                <IconSymbol name="gear" size={20} color={theme.colors.text} />
                <ThemedText style={styles.menuText}>General</ThemedText>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  color={theme.colors.text}
                  style={{ opacity: 0.5 }}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>ACCOUNT</ThemedText>
            <GlassCard style={styles.menuItem}>
              <View style={styles.menuRow}>
                <ThemedText
                  style={[styles.menuText, { color: "#f44336" }]}
                  onPress={handleLogout}
                >
                  Log Out
                </ThemedText>
              </View>
            </GlassCard>
          </View>

          <ThemedText style={styles.version}>v1.0.0</ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scroll: {
    padding: 20,
    gap: 30,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9c7cf4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  profileInfo: {
    gap: 4,
  },
  email: {
    opacity: 0.6,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    opacity: 0.5,
    marginLeft: 5,
  },
  menuItem: {
    paddingVertical: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  version: {
    textAlign: "center",
    opacity: 0.3,
    marginTop: 20,
  },
});
