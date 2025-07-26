import { History as HistoryIcon, Clock, CheckCircle, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

export default function History() {
  const { state } = useApp();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const redeemHistory = state.transactions.filter(
    (item) => item.type === "redeem",
  );
  const earnHistory = state.transactions.filter((item) => item.type === "earn");

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <HistoryIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">History</h1>
        </div>
        <p className="text-muted-foreground">
          Track your earnings and redemptions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-success">
              {earnHistory.reduce((sum, item) => sum + item.amount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/20">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-destructive">
              {Math.abs(
                redeemHistory.reduce((sum, item) => sum + item.amount, 0),
              )}
            </div>
            <div className="text-xs text-muted-foreground">Total Redeemed</div>
          </CardContent>
        </Card>
      </div>

      {/* Redeemed Rewards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Gift className="h-5 w-5 mr-2 text-primary" />
          Redeemed Rewards
        </h2>

        {redeemHistory.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No Transactions</p>
              <p className="text-sm text-muted-foreground">
                Start earning coins to redeem rewards!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {redeemHistory.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">
                          {item.title}
                        </h3>
                        <span className="font-semibold text-destructive">
                          {item.amount} coins
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`text-xs ${getStatusColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Earnings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
          Recent Earnings
        </h2>

        {earnHistory.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No Earnings Yet</p>
              <p className="text-sm text-muted-foreground">
                Complete tasks to start earning coins!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {earnHistory.slice(0, 5).map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">
                        {item.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-success">
                        +{item.amount} coins
                      </span>
                      <Badge
                        className={`ml-2 text-xs ${getStatusColor(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1">Completed</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
