import {
  Coins,
  Calendar,
  Play,
  RotateCcw,
  CheckCircle,
  Target,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { fetchUserCoins, incrementCoins } from "@/lib/firebase";

interface Task {
  id: string;
  title: string;
  reward: number;
  icon: React.ElementType;
  completed?: boolean;
}

const tasks: Task[] = [
  {
    id: "watch-ad",
    title: "Watch Ad",
    reward: 5,
    icon: Play,
  },
  {
    id: "spin-wheel",
    title: "Spin & Win",
    reward: 0,
    icon: RotateCcw,
  },
];

export default function Home() {
  const { state, setDailyCheckIn, addCompletedTask, logout } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    const getCoins = async () => {
      const total = await fetchUserCoins(state.user?.email || "");
      setCoins(total);
    };
    getCoins();
  }, [state.user]);

  const addCoins = async (amount: number, source: string) => {
    await incrementCoins(state.user?.email || "", amount);
    const total = await fetchUserCoins(state.user?.email || "");
    setCoins(total);

    toast({
      title: `${source} Complete!`,
      description: `+${amount} coins earned`,
    });
  };

  const showRewardedAd = (onReward: () => void) => {
    // @ts-ignore
    if (window.AndroidRewardedAds?.showRewardedAd) {
      // @ts-ignore
      window.AndroidRewardedAds.showRewardedAd("ca-app-pub-5756792626790546~7544385810", () => {
        onReward();
      });
    } else {
      onReward(); // fallback for web
    }
  };

  const handleDailyCheckIn = async () => {
    if (!state.dailyCheckIn) {
      showRewardedAd(async () => {
        await addCoins(25, "Daily Check-in");
        setDailyCheckIn(true);
      });
    }
  };

  const handleTaskComplete = async (task: Task) => {
    if (state.completedTasks.has(task.id)) return;

    if (task.id === "spin-wheel") {
      navigate("/spin-win");
      return;
    }

    if (task.id === "watch-ad") {
      showRewardedAd(async () => {
        await addCoins(task.reward, task.title);
        addCompletedTask(task.id);
      });
      return;
    }

    await addCoins(task.reward, task.title);
    addCompletedTask(task.id);
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage
              src={state.user?.picture || "/placeholder.svg"}
              alt="Profile"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {state.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {state.user?.name || "User"}
            </h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Coin Balance */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 card-hover">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coins className="h-8 w-8 text-primary coin-spin" />
            <span className="text-3xl font-bold text-foreground">
              {coins.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Coins</p>
        </CardContent>
      </Card>

      {/* Daily Check-in */}
      <Card className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Daily Check-in</h3>
                <p className="text-sm text-muted-foreground">Earn 25 coins daily</p>
              </div>
            </div>
            <Button
              onClick={handleDailyCheckIn}
              disabled={state.dailyCheckIn}
              size="sm"
              className={state.dailyCheckIn ? "bg-success hover:bg-success" : ""}
            >
              {state.dailyCheckIn ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Done
                </>
              ) : (
                "Check-in"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Earn More Coins
        </h2>
        <div className="space-y-3">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isCompleted = state.completedTasks.has(task.id);
            return (
              <Card key={task.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{task.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {task.id === "spin-wheel" ? "2-8 coins" : `+${task.reward} coins`}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleTaskComplete(task)}
                      disabled={isCompleted}
                      size="sm"
                      variant={isCompleted ? "secondary" : "default"}
                      className={
                        isCompleted
                          ? "bg-success hover:bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Done
                        </>
                      ) : (
                        "Start"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
