import { Target, Play, RotateCcw, Users, Calendar, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const earnMethods = [
  {
    id: "daily",
    title: "Daily Check-in",
    description: "Login daily to earn bonus coins",
    reward: "25 coins",
    icon: Calendar,
    difficulty: "Easy",
  },
  {
    id: "ads",
    title: "Watch Advertisements",
    description: "Watch short video ads to earn coins",
    reward: "50 coins",
    icon: Play,
    difficulty: "Easy",
  },
  {
    id: "wheel",
    title: "Spin the Wheel",
    description: "Try your luck with our daily wheel spin",
    reward: "10-110 coins",
    icon: RotateCcw,
    difficulty: "Medium",
  },
  {
    id: "referral",
    title: "Invite Friends",
    description: "Earn coins when friends join using your code",
    reward: "100 coins",
    icon: Users,
    difficulty: "Medium",
  },
];

export default function Earn() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Earn Coins</h1>
        </div>
        <p className="text-muted-foreground">
          Complete tasks and activities to earn more coins
        </p>
      </div>

      {/* Spin & Win Featured */}
      <Card
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 card-hover cursor-pointer"
        onClick={() => navigate("/spin-win")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  🎰 Spin & Win Coins!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Spin the wheel to win 2-8 coins instantly
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Play Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Banner */}
      <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Double Coins Weekend!
              </h3>
              <p className="text-sm text-muted-foreground">
                Earn 2x coins on all activities this weekend
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earn Methods */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Ways to Earn</h2>

        <div className="space-y-4">
          {earnMethods.map((method) => {
            const Icon = method.icon;

            return (
              <Card key={method.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-foreground">
                          {method.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={
                          method.difficulty === "Easy"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-warning"
                        }
                      >
                        {method.difficulty}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        {method.reward}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-3">💡 Pro Tips</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Complete daily check-ins for consistent earnings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Invite friends to earn the highest coin rewards</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Watch for special events and bonus multipliers</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Save up coins for higher value Google Play codes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
