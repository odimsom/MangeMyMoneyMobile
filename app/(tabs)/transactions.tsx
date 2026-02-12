import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { transactionsService } from "@/services/transactionsService";
import { Transaction, TransactionFilters } from "@/types/transaction";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TransactionFilters>({
    pageNumber: 1,
    pageSize: 20,
    search: "",
  });

  const loadTransactions = useCallback(async () => {
    try {
      const response = await transactionsService.getTransactions(filter);
      setTransactions(response.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error(error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    // Reset page or just reload current view
    // For simplicity, just reload
    loadTransactions();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Transactions</ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={filter.search}
          onChangeText={(text) =>
            setFilter((prev) => ({ ...prev, search: text, pageNumber: 1 }))
          }
        />
      </ThemedView>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ThemedView style={styles.transactionCard}>
              <ThemedView style={styles.iconContainer}>
                {/* Placeholder icon based on category logic if available */}
                <IconSymbol name="cart" size={20} color="#666" />
              </ThemedView>
              <ThemedView style={{ flex: 1, paddingHorizontal: 10 }}>
                <ThemedText type="defaultSemiBold">
                  {item.categoryName}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: "#666" }}>
                  {item.accountName} •{" "}
                  {new Date(item.date).toLocaleDateString()}
                </ThemedText>
                {item.description ? (
                  <ThemedText
                    numberOfLines={1}
                    style={{ fontSize: 12, fontStyle: "italic", opacity: 0.8 }}
                  >
                    {item.description}
                  </ThemedText>
                ) : null}
              </ThemedView>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color: item.type === "Income" ? "#4caf50" : "#f44336",
                }}
              >
                {item.type === "Income" ? "+" : "-"} {item.currency}{" "}
                {item.amount.toFixed(2)}
              </ThemedText>
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No transactions found.
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Safe area top (approx)
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
});
