import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { GlassCard } from "@/components/ui/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Account, accountService } from "@/services/accountService";
import { Category, categoryService } from "@/services/categoryService";
import {
    CreateExpenseRequest,
    transactionsService,
} from "@/services/transactionsService";
import Toast from "react-native-toast-message";

export default function ModalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accs, cats] = await Promise.all([
          accountService.getAccounts(),
          categoryService.getCategories("Expense"),
        ]);
        setAccounts(accs);
        setCategories(cats);
        if (accs.length > 0) setSelectedAccount(accs[0].id);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      } catch (e) {
        console.error(e);
        Toast.show({ type: "error", text1: "Error loading data" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !description || !selectedAccount || !selectedCategory) {
      Alert.alert("Missing fields", "Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateExpenseRequest = {
        amount: parseFloat(amount),
        description,
        accountId: selectedAccount,
        categoryId: selectedCategory,
        date: new Date().toISOString(),
        currency: "USD", // Should ideally come from Account
      };

      await transactionsService.createExpense(payload);
      Toast.show({ type: "success", text1: "Transaction added" });
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Failed to add transaction" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <ThemedText style={styles.currencySymbol}>$</ThemedText>
          <TextInput
            style={[styles.amountInput, { color: themeColors.text }]}
            placeholder="0.00"
            placeholderTextColor={themeColors.icon}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            color={themeColors.tint}
          />
        ) : (
          <View style={styles.formContainer}>
            {/* Description */}
            <GlassCard style={styles.inputCard}>
              <IconSymbol
                name="pencil.and.outline"
                size={20}
                color={themeColors.icon}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Description"
                placeholderTextColor={themeColors.icon}
                value={description}
                onChangeText={setDescription}
              />
            </GlassCard>

            {/* Account Selection (Simple Horizontal Scroll) */}
            <View>
              <ThemedText style={styles.label}>Account</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectionScroll}
              >
                {accounts.map((acc) => (
                  <Pressable
                    key={acc.id}
                    onPress={() => setSelectedAccount(acc.id)}
                    style={[
                      styles.chip,
                      { borderColor: themeColors.border },
                      selectedAccount === acc.id && {
                        backgroundColor: themeColors.tint,
                        borderColor: themeColors.tint,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.chipText,
                        selectedAccount === acc.id && { color: "#fff" },
                      ]}
                    >
                      {acc.name}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Category Selection */}
            <View>
              <ThemedText style={styles.label}>Category</ThemedText>
              <View style={styles.wrapContainer}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.chip,
                      { borderColor: themeColors.border },
                      selectedCategory === cat.id && {
                        backgroundColor: themeColors.tint,
                        borderColor: themeColors.tint,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.chipText,
                        selectedCategory === cat.id && { color: "#fff" },
                      ]}
                    >
                      {cat.name}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.submitBtn, { backgroundColor: themeColors.tint }]}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.submitBtnText}>
                  Add Transaction
                </ThemedText>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: "bold",
    opacity: 0.5,
  },
  amountInput: {
    fontSize: 60,
    fontWeight: "bold",
    minWidth: 100,
    textAlign: "center",
  },
  formContainer: {
    gap: 25,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 16,
    gap: 15,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    opacity: 0.7,
  },
  selectionScroll: {
    flexDirection: "row",
    marginHorizontal: -5,
  },
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 5,
    backgroundColor: "transparent",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: 20,
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
