import { useState } from "react";
import { MainScreen } from "./components/MainScreen";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { DataInputScreen } from "./components/DataInputScreen";
import { PredictionScreen } from "./components/PredictionScreen";
import { DashboardScreen } from "./components/DashboardScreen";

type Screen =
  | "main"
  | "login"
  | "signup"
  | "dataInput"
  | "prediction"
  | "dashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("사용자");
  const [healthData, setHealthData] = useState<any>(null);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentScreen("main");
  };

  const handleSignup = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    setCurrentScreen("main");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setHealthData(null);
    setCurrentScreen("main");
  };

  const handleDataSaved = (data: any) => {
    setHealthData(data);
    setCurrentScreen("prediction");
  };

  return (
    <div className="size-full">
      {currentScreen === "main" && (
        <MainScreen
          isLoggedIn={isLoggedIn}
          onLogin={() => setCurrentScreen("login")}
          onSignup={() => setCurrentScreen("signup")}
          onDataInput={() => setCurrentScreen("dataInput")}
          onPrediction={() => setCurrentScreen("prediction")}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === "login" && (
        <LoginScreen
          onBack={() => setCurrentScreen("main")}
          onLoginComplete={handleLogin}
          onForgotPassword={() => setCurrentScreen("signup")}
        />
      )}

      {currentScreen === "signup" && (
        <SignupScreen
          onBack={() => setCurrentScreen("main")}
          onSignupComplete={handleSignup}
        />
      )}

      {currentScreen === "dataInput" && (
        <DataInputScreen
          onBack={() => setCurrentScreen("main")}
          onDataSaved={handleDataSaved}
        />
      )}

      {currentScreen === "prediction" && (
        <PredictionScreen
          onBack={() => setCurrentScreen("main")}
          healthData={healthData}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen
          onBack={() => setCurrentScreen("main")}
        />
      )}
    </div>
  );
}
