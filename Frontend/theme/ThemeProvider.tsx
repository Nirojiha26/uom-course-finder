import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile, updateProfile } from "../services/auth";

type Colors = {
  background: string;
  card: string;
  text: string;
  muted: string;
  primary: string;
  tabBar: string;
  border: string;
  input: string;
};

type ThemeContextValue = {
  dark: boolean;
  toggle: () => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const light: Colors = {
  background: "#ffffff",
  card: "#ffffff",
  text: "#222222",
  muted: "#777777",
  primary: "#491B6D",
  tabBar: "#ffffff",
  border: "#e8e8e8",
  input: "#f4f4f4",
};

const darkColors: Colors = {
  background: "#0f0f0f",
  card: "#121212",
  text: "#ffffff",
  muted: "#bfbfbf",
  primary: "#bb86fc",
  tabBar: "#0b0b0b",
  border: "#1f1f1f",
  input: "#1a1a1a",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(false);
  const anim = useRef(new Animated.Value(1)).current;

  // Load theme preference from AsyncStorage on app init; fall back to server
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("isDarkMode");
        if (stored !== null) {
          setDark(stored === "true");
          return;
        }

        // If not stored locally, try to load user preference from server (if logged in)
        try {
          const res: any = await getProfile();
          const pref =
            res?.data?.preferredDark ?? res?.data?.PreferredDark ?? null;
          if (pref !== null && pref !== undefined) {
            setDark(!!pref);
            await AsyncStorage.setItem("isDarkMode", pref ? "true" : "false");
          }
        } catch {}
      } catch {}
    })();
  }, []);

  const toggle = async () => {
    try {
      // Fade out, toggle, then fade in
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(async () => {
        const newVal = !dark;
        setDark(newVal);
        try {
          await AsyncStorage.setItem("isDarkMode", newVal ? "true" : "false");
        } catch {}

        // Try persisting preference to server (best-effort)
        try {
          await updateProfile({ preferredDark: newVal } as any);
        } catch {}

        Animated.timing(anim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    } catch {}
  };

  const colors = dark ? darkColors : light;

  return (
    <ThemeContext.Provider value={{ dark, toggle, colors }}>
      <Animated.View style={{ flex: 1, opacity: anim }}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeProvider;
