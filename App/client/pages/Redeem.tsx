import { useState } from "react";
import { Gift, Coins, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface RedeemOption {
  id: string;
  title: string;
  value: string;
  coins: number;
  popular?: boolean;
}

const redeemOptions: RedeemOption[] = [
  {
    id: "play100",
    title: "₹10 Google Play Code",
    value: "₹10",
    coins: 1000,
  },
  {
    id: "play500",
    title: "₹50 Google Play Code",
    value: "₹50",
    coins: 5000,
    popular: true,
  },
];

export default function Redeem() {
  const { state, redeemCoins } = useApp();
  const [requestedCodes, setRequestedCodes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleRequest = async (option: RedeemOption) => {
    if (state.coins < option.coins) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${option.coins} coins to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    if (requestedCodes.has(option.id)) {
      return;
    }

    try {
      await addDoc(collection(db, "redeemRequests"), {
        userName: state.user?.name || "Unknown",
        userEmail: state.user?.email || "No Email",
        reward: option.title,
        coinsSpent: option.coins,
        status: "pending",
        requestedAt: serverTimestamp(),
      });

      redeemCoins(option.coins, option.title);
      setRequestedCodes(new Set(requestedCodes).add(option.id));

      toast({
        title: "Request Submitted!",
        description:
          "Your request has been received. You will get the code soon.",
      });
    } catch (err) {
      console.error("Error saving to Firestore", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const canAfford = (coins: number) => state.coins >= coins;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Gift className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Redeem Rewards</h1>
        </div>
        <p className="text-muted-foreground">
          Exchange your coins for Google Play codes
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold text-foreground">
              {state.coins.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Available Coins</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary" />
          Google Play Codes
        </h2>

        <div className="space-y-4">
          {redeemOptions.map((option) => {
            const isRequested = requestedCodes.has(option.id);
            const affordable = canAfford(option.coins);

            return (
              <Card
                key={option.id}
                className={`card-hover relative ${
                  !affordable ? "opacity-60" : ""
                }`}
              >
                {option.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="text-foreground">{option.title}</span>
                    <span className="text-2xl font-bold text-primary">
                      {option.value}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Required:
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {option.coins.toLocaleString()} coins
                      </span>
                    </div>

                    <Button
                      onClick={() => handleRequest(option)}
                      disabled={!affordable || isRequested}
                      className="w-full"
                      variant={isRequested ? "secondary" : "default"}
                    >
                      {isRequested ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Request Submitted
                        </>
                      ) : !affordable ? (
                        "Not Enough Coins"
                      ) : (
                        "Request Code"
                      )}
                    </Button>

                    {isRequested && (
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <p className="text-sm text-success-foreground">
                          Your request has been received. You will get the code
                          soon.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-2">How it works:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <span className="text-primary font-medium">1.</span>
              <span>Select a Google Play code value</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary font-medium">2.</span>
              <span>Make sure you have enough coins</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary font-medium">3.</span>
              <span>Click "Request Code" to submit your request</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary font-medium">4.</span>
              <span>You'll receive the code within 24-48 hours via email</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
