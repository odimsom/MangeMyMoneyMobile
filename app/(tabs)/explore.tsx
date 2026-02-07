import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MoreScreen() {
  const router = useRouter();

  const menuItems = [
    { title: "Categories", icon: "tag.fill", route: "/categories" },
    { title: "Accounts", icon: "creditcard.fill", route: "/accounts" },
    { title: "Reports", icon: "chart.bar.fill", route: "/reports" },
    { title: "Settings", icon: "gear", route: "/settings" },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="line.3.horizontal"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">More</ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <ThemedView key={index} style={styles.menuItem}>
            <IconSymbol
              name={item.icon as any}
              size={24}
              color="#666"
              style={{ marginRight: 16 }}
            />
            <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
              {item.title}
            </ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#ccc" />
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        <ThemedView style={styles.menuItem}>
          <IconSymbol
            name="arrow.right.square"
            size={24}
            color="#f44336"
            style={{ marginRight: 16 }}
          />
          <ThemedText
            type="defaultSemiBold"
            style={{ flex: 1, color: "#f44336" }}
            onPress={() => router.replace("/login")} // In a real app, call logout() from context
          >
            Log Out (Navigate)
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  menuContainer: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
});
