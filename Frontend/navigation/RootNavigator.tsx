import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import OtpVerifyScreen from "../screens/OtpVerifyScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import BottomTabs from "./BottomTabs";
import CourseDetailsScreen from "../screens/CourseDetailsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      {/* App Main Screens */}
      <Stack.Screen name="Home" component={BottomTabs} />
      <Stack.Screen name="Details" component={CourseDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

    </Stack.Navigator>
  );
}
