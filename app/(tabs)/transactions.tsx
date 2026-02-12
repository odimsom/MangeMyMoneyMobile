import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GlassCard } from "@/components/ui/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    Transaction,
    TransactionFilters,
    transactionsService,
} from "@/services/transactionsService";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TransactionFilters>({
    pageNumber: 1,
    pageSize: 20,
    search: "",
  });

  const colorScheme = useColorScheme() ?? "light";
  const accentColor = Colors[colorScheme].tint;
  const textColor = Colors[colorScheme].text;

  const loadTransactions = useCallback(async () => {
    try {
      const response = await transactionsService.getTransactions(filter);
      setTransactions(response.data);
    } catch (error: any) {
      if (error?.response?.status !== 401) {
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
    loadTransactions();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Transactions</ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <GlassCard style={styles.searchCard}>
            <IconSymbol
              name="magnifyingglass"
              size={18}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search transactions..."
              placeholderTextColor={
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)"
              }
              value={filter.search}
              onChangeText={(text) =>
                setFilter((prev) => ({ ...prev, search: text, pageNumber: 1 }))
              }
            />
          </GlassCard>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={accentColor}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={accentColor}
              />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <GlassCard style={styles.transactionCard}>
                <View style={styles.row}>
                  <View style={styles.iconBox}>
                    <IconSymbol name="bag.fill" size={20} color={accentColor} />
                  </View>
                  <View style={styles.details}>
                    <ThemedText type="defaultSemiBold">
                      {item.description || item.categoryName}
                    </ThemedText>
                    <ThemedText style={styles.subText}>
                      {item.categoryName} •{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </ThemedText>
                  </View>
                  <View style={styles.amountBox}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: "#f44336" }}
                    >
                      - {formatCurrency(item.amount, item.currency)}
                    </ThemedText>
                  </View>
                </View>
              </GlassCard>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={{ opacity: 0.5 }}>
                  No transactions found
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50, // Pill shape
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(156, 124, 244, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 2,
  },
  subText: {
    fontSize: 12,
    opacity: 0.5,
  },
  amountBox: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
});
