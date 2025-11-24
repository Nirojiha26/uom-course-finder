import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import OtpVerifyScreen from "../screens/OtpVerifyScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Always start here */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Auth flows */}
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      {/* After login */}
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
}
