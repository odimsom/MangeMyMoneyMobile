import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GlassCard } from "@/components/ui/GlassCard";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Budget, budgetsService } from "@/services/budgetsService";

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme() ?? "light";
  const accentColor = Colors[colorScheme].tint;

  const loadBudgets = async () => {
    try {
      const data = await budgetsService.getBudgets();
      setBudgets(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBudgets();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const calculateProgress = (spent: number, limit: number) => {
    if (limit === 0) return 0;
    const progress = (spent / limit) * 100;
    return Math.min(progress, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Budgets</ThemedText>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={accentColor}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={budgets}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={accentColor}
              />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const progress = calculateProgress(item.spentAmount, item.amount);
              const isExceeded = item.spentAmount > item.amount;
              const barColor = isExceeded ? "#f44336" : accentColor;

              return (
                <GlassCard style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <ThemedText type="defaultSemiBold">
                      {item.categoryName}
                    </ThemedText>
                    <ThemedText style={{ opacity: 0.6 }}>
                      {formatCurrency(item.spentAmount, item.currency)} /{" "}
                      {formatCurrency(item.amount, item.currency)}
                    </ThemedText>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progress}%`, backgroundColor: barColor },
                      ]}
                    />
                  </View>

                  <View style={styles.budgetFooter}>
                    <ThemedText style={{ fontSize: 12, opacity: 0.5 }}>
                      {isExceeded ? "Exceeded by" : "Remaining"}{" "}
                      {formatCurrency(
                        Math.abs(item.amount - item.spentAmount),
                        item.currency,
                      )}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, opacity: 0.5 }}>
                      {progress.toFixed(0)}%
                    </ThemedText>
                  </View>
                </GlassCard>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={{ opacity: 0.5 }}>
                  No active budgets
                </ThemedText>
              </View>
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  listContent: {
    padding: 20,
    gap: 15,
  },
  budgetCard: {
    padding: 20,
    borderRadius: 24,
    gap: 15,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
});
