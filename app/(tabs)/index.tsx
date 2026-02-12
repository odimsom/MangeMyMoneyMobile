import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { dashboardService } from "@/services/dashboardService";
import { AccountSummary, Expense, FinancialSummary } from "@/types/dashboard";

export default function DashboardScreen() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [accSummary, setAccSummary] = useState<AccountSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const now = new Date();
      // Simple start/end of month calculation
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
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error(error);
      }
      // If unauthorized, login redirection is handled in api.ts interceptor
    } finally {
      if (loading) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chart.pie.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
      </ThemedView>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <ThemedView style={styles.content}>
          {/* Financial Summary */}
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">This Month</ThemedText>
            <ThemedView style={styles.summaryRow}>
              <ThemedView style={styles.summaryItem}>
                <ThemedText style={styles.label}>Income</ThemedText>
                <ThemedText style={[styles.amount, { color: "#4caf50" }]}>
                  {summary?.currency}{" "}
                  {summary?.totalIncome?.toFixed(2) || "0.00"}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.summaryItem}>
                <ThemedText style={styles.label}>Expenses</ThemedText>
                <ThemedText style={[styles.amount, { color: "#f44336" }]}>
                  {summary?.currency}{" "}
                  {summary?.totalExpenses?.toFixed(2) || "0.00"}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={[
                styles.summaryRow,
                {
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderColor: "#eee",
                },
              ]}
            >
              <ThemedText type="defaultSemiBold">Net Balance</ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  color:
                    (summary?.netBalance || 0) >= 0 ? "#4caf50" : "#f44336",
                }}
              >
                {summary?.currency} {summary?.netBalance?.toFixed(2) || "0.00"}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Account Summary */}
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">Total Balance</ThemedText>
            <ThemedText type="title" style={{ marginTop: 5 }}>
              {accSummary?.currency}{" "}
              {accSummary?.totalBalance?.toFixed(2) || "0.00"}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: "#666" }}>
              Across {accSummary?.activeAccountsCount} active accounts
            </ThemedText>
          </ThemedView>

          {/* Recent Transactions */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
          </ThemedView>

          {recentTransactions.map((tx) => (
            <ThemedView key={tx.id} style={styles.transactionCard}>
              <ThemedView style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {tx.categoryName}
                </ThemedText>
                <ThemedText style={{ fontSize: 12 }}>
                  {tx.accountName} • {new Date(tx.date).toLocaleDateString()}
                </ThemedText>
                {tx.description ? (
                  <ThemedText style={{ fontSize: 12, fontStyle: "italic" }}>
                    {tx.description}
                  </ThemedText>
                ) : null}
              </ThemedView>
              <ThemedText type="defaultSemiBold" style={{ color: "#f44336" }}>
                - {tx.currency} {tx.amount.toFixed(2)}
              </ThemedText>
            </ThemedView>
          ))}

          {recentTransactions.length === 0 && (
            <ThemedText
              style={{ textAlign: "center", marginTop: 10, opacity: 0.6 }}
            >
              No recent transactions.
            </ThemedText>
          )}
        </ThemedView>
      )}
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
  header: {
    marginBottom: 10,
  },
  content: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff", // Ideally use themed color
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: -8,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
});
