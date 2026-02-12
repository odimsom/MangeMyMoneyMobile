import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { budgetsService } from "@/services/budgetsService";
import { Budget } from "@/types/budget";

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBudgets = async () => {
    try {
      const data = await budgetsService.getBudgets();
      setBudgets(data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error(error);
      }
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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Budgets</ThemedText>
      </ThemedView>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const progress = Math.min(item.spentAmount / item.amount, 1);
            const isOverBudget = item.spentAmount > item.amount;

            return (
              <ThemedView style={styles.budgetCard}>
                <ThemedView style={styles.budgetHeader}>
                  <ThemedText type="subtitle">{item.categoryName}</ThemedText>
                  <ThemedText style={{ fontSize: 12, fontWeight: "bold" }}>
                    {item.percentage}%
                  </ThemedText>
                </ThemedView>

                <ThemedText style={styles.periodText}>
                  {item.period} Budget
                </ThemedText>

                {/* Progress Bar */}
                <ThemedView style={styles.progressTrack}>
                  <ThemedView
                    style={[
                      styles.progressBar,
                      {
                        width: `${progress * 100}%`,
                        backgroundColor: isOverBudget ? "#f44336" : "#9c7cf4",
                      },
                    ]}
                  />
                </ThemedView>

                <ThemedView style={styles.budgetFooter}>
                  <ThemedView>
                    <ThemedText style={styles.label}>Spent</ThemedText>
                    <ThemedText
                      style={[
                        styles.amount,
                        { color: isOverBudget ? "#f44336" : "#000" },
                      ]}
                    >
                      {item.currency} {item.spentAmount.toFixed(2)}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={{ alignItems: "flex-end" }}>
                    <ThemedText style={styles.label}>Limit</ThemedText>
                    <ThemedText style={styles.amount}>
                      {item.currency} {item.amount.toFixed(2)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            );
          }}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <IconSymbol name="chart.pie" size={48} color="#ccc" />
              <ThemedText style={{ marginTop: 10, textAlign: "center" }}>
                No budgets set yet.
              </ThemedText>
            </ThemedView>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  periodText: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#666",
    letterSpacing: 1,
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#999",
    marginBottom: 2,
  },
  amount: {
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    opacity: 0.6,
  },
});
