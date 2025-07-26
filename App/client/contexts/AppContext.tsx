import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export interface Transaction {
  id: string;
  type: "earn" | "redeem";
  title: string;
  amount: number;
  date: string;
  status: "pending" | "delivered" | "completed";
  description?: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  coins: number;
  transactions: Transaction[];
  spinsLeft: number;
  totalSpinsToday: number;
  dailyCheckIn: boolean;
  completedTasks: Set<string>;
}

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  addCoins: (amount: number, title: string, description?: string) => void;
  redeemCoins: (amount: number, title: string, description?: string) => void;
  setDailyCheckIn: (value: boolean) => void;
  addCompletedTask: (taskId: string) => void;
  useSpins: (count: number) => void;
  updateTransactionStatus: (id: string, status: Transaction["status"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  coins: 0,
  transactions: [],
  spinsLeft: 20,
  totalSpinsToday: 0,
  dailyCheckIn: false,
  completedTasks: new Set(),
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const auth = getAuth();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          picture: firebaseUser.photoURL || "/placeholder.svg",
        };
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const login = (user: User) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: true,
    }));
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setState(initialState);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to local state reset
      setState(initialState);
    }
  };

  const addCoins = (amount: number, title: string, description?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "earn",
      title,
      amount,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      description,
    };

    setState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const redeemCoins = (amount: number, title: string, description?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "redeem",
      title,
      amount: -amount,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      description: description || "Request submitted, processing...",
    };

    setState((prev) => ({
      ...prev,
      coins: prev.coins - amount,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const setDailyCheckIn = (value: boolean) => {
    setState((prev) => ({ ...prev, dailyCheckIn: value }));
  };

  const addCompletedTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      completedTasks: new Set(prev.completedTasks).add(taskId),
    }));
  };

  const useSpins = (count: number) => {
    setState((prev) => ({
      ...prev,
      spinsLeft: Math.max(0, prev.spinsLeft - count),
      totalSpinsToday: prev.totalSpinsToday + count,
    }));
  };

  const updateTransactionStatus = (
    id: string,
    status: Transaction["status"],
  ) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, status } : t,
      ),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        addCoins,
        redeemCoins,
        setDailyCheckIn,
        addCompletedTask,
        useSpins,
        updateTransactionStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
