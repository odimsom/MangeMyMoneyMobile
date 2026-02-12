import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
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
    AccountSummary,
    Expense,
    FinancialSummary,
    dashboardService,
} from "@/services/dashboardService";

export default function DashboardScreen() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [accSummary, setAccSummary] = useState<AccountSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme() ?? "light";

  const loadData = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).toISOString();

      const [finData, accData, txData] = await Promise.all([
        dashboardService.getFinancialSummary(startOfMonth, endOfMonth),
        dashboardService.getAccountSummary(),
        dashboardService.getRecentTransactions(),
      ]);

      setSummary(finData);
      setAccSummary(accData);
      setRecentTransactions(txData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const getAccentColor = () => Colors[colorScheme].tint;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={getAccentColor()}
            />
          }
        >
          <View style={styles.header}>
            <ThemedText type="title">Dashboard</ThemedText>
          </View>

          {loading && !refreshing && !summary ? (
            <ActivityIndicator
              size="large"
              color={getAccentColor()}
              style={styles.loader}
            />
          ) : (
            <View style={styles.contentGap}>
              {/* Spending Overview Placeholder */}
              <GlassCard variant="elite" style={styles.chartCard}>
                <View>
                  <ThemedText type="subtitle" style={styles.chartTitle}>
                    Spending Overview
                  </ThemedText>
                  <ThemedText style={styles.chartSubtitle}>
                    DAILY INDICATOR
                  </ThemedText>
                </View>

                <View style={styles.chartBars}>
                  {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bar,
                        { height: `${h}%`, backgroundColor: getAccentColor() },
                      ]}
                    />
                  ))}
                </View>
              </GlassCard>

              {/* Current Balance - Accent Card */}
              <View
                style={[
                  styles.balanceCard,
                  { backgroundColor: getAccentColor() },
                ]}
              >
                <ThemedText style={styles.balanceLabel}>
                  CURRENT BALANCE
                </ThemedText>
                <ThemedText style={styles.balanceValue}>
                  {formatCurrency(
                    accSummary?.totalBalance || 0,
                    accSummary?.currency || "USD",
                  )}
                </ThemedText>
                <ThemedText style={styles.balanceSub}>
                  Across {accSummary?.activeAccountsCount || 0} accounts
                </ThemedText>
              </View>

              {/* Income / Expense Grid */}
              <View style={styles.row}>
                <GlassCard style={styles.summaryCard}>
                  <ThemedText style={styles.summaryLabel}>Income</ThemedText>
                  <ThemedText
                    style={[styles.summaryValue, { color: "#4caf50" }]}
                  >
                    {formatCurrency(
                      summary?.totalIncome || 0,
                      summary?.currency || "USD",
                    )}
                  </ThemedText>
                </GlassCard>
                <GlassCard style={styles.summaryCard}>
                  <ThemedText style={styles.summaryLabel}>Expenses</ThemedText>
                  <ThemedText
                    style={[styles.summaryValue, { color: "#f44336" }]}
                  >
                    {formatCurrency(
                      summary?.totalExpenses || 0,
                      summary?.currency || "USD",
                    )}
                  </ThemedText>
                </GlassCard>
              </View>

              {/* Recent Transactions */}
              <View style={styles.section}>
                <ThemedText type="subtitle">Recent Transactions</ThemedText>
                <View style={styles.transactionsList}>
                  {recentTransactions.map((tx) => (
                    <GlassCard key={tx.id} style={styles.transactionRow}>
                      <View style={styles.transactionInfo}>
                        <ThemedText type="defaultSemiBold">
                          {tx.description}
                        </ThemedText>
                        <ThemedText style={styles.transactionDate}>
                          {new Date(tx.date).toLocaleDateString()}
                        </ThemedText>
                      </View>
                      <View style={styles.transactionAmount}>
                        <ThemedText
                          type="defaultSemiBold"
                          style={{ color: "#f44336" }}
                        >
                          - {formatCurrency(tx.amount, tx.currency)}
                        </ThemedText>
                        <ThemedText style={styles.categoryTag}>
                          {tx.categoryName}
                        </ThemedText>
                      </View>
                    </GlassCard>
                  ))}
                  {recentTransactions.length === 0 && (
                    <ThemedText style={styles.emptyText}>
                      No recent transactions
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <Link href="/modal" asChild>
          <Pressable
            style={[styles.fab, { backgroundColor: getAccentColor() }]}
          >
            <IconSymbol name="plus" size={28} color="#fff" />
          </Pressable>
        </Link>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  contentGap: {
    gap: 20,
  },
  loader: {
    marginTop: 50,
  },
  chartCard: {
    height: 300,
    justifyContent: "space-between",
  },
  chartTitle: {
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 10,
    fontWeight: "900",
    opacity: 0.5,
    letterSpacing: 1,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    gap: 8,
  },
  bar: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    opacity: 0.3,
  },
  balanceCard: {
    borderRadius: 40,
    padding: 30,
    shadowColor: "#9c7cf4",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  balanceValue: {
    color: "#fff", // Always white on the purple card
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  balanceSub: {
    color: "rgba(255,255,255,0.5)",
    marginTop: 5,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
    gap: 15,
  },
  transactionsList: {
    gap: 12,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 24,
  },
  transactionInfo: {
    gap: 4,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  transactionAmount: {
    alignItems: "flex-end",
    gap: 4,
  },
  categoryTag: {
    fontSize: 10,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  emptyText: {
    opacity: 0.5,
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
