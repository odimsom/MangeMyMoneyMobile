import { useThemeColor } from "@/hooks/use-theme-color";
import { View, ViewProps } from "react-native";

export type GlassCardProps = ViewProps & {
  variant?: "default" | "elite";
};

export function GlassCard({
  style,
  variant = "default",
  ...otherProps
}: GlassCardProps) {
  const backgroundColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border"); // I need to make sure 'border' key works in useThemeColor

  // "Elite" card in web has 2.5rem radius (approx 40px)
  // "Glass" panel has backdrop blur (not easily doable without expo-blur) and border

  const baseStyle = {
    backgroundColor:
      variant === "elite" ? backgroundColor : "rgba(255, 255, 255, 0.03)", // approximate glass
    borderColor: borderColor || "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: variant === "elite" ? 40 : 20,
    padding: 20,
    overflow: "hidden" as const,
  };

  return <View style={[baseStyle, style]} {...otherProps} />;
}
