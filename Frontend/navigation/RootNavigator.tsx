import { getToken } from "../utils/Storage";
import { useEffect, useState } from "react";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

export default function RootNavigator() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setAuth(!!token);
    };
    checkAuth();
  }, []);

  if (auth === null) return null;

  return auth ? <AppStack /> : <AuthStack />;
}
