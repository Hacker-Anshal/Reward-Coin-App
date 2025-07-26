import { useState, useEffect } from "react";
import { RotateCcw, Coins, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";

const wheelSegments = [
  { number: 2, color: "from-purple-600 to-purple-400" },
  { number: 3, color: "from-blue-600 to-blue-400" },
  { number: 4, color: "from-indigo-600 to-indigo-400" },
  { number: 5, color: "from-violet-600 to-violet-400" },
  { number: 6, color: "from-cyan-600 to-cyan-400" },
  { number: 7, color: "from-amber-600 to-amber-400" },
  { number: 8, color: "from-emerald-600 to-emerald-400" },
];

export default function SpinWin() {
  const { state, addCoins, useSpins } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonCoins, setWonCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const canSpin = state.spinsLeft > 0 && !isSpinning;

  const spinWheel = () => {
    if (!canSpin) return;

    setIsSpinning(true);

    // Calculate random rotation (multiple full spins + random position)
    const randomRotation = Math.floor(Math.random() * 360);
    const fullSpins = 1440; // 4 full rotations
    const finalRotation = rotation + fullSpins + randomRotation;

    setRotation(finalRotation);

    // Calculate which segment we landed on
    const segmentAngle = 360 / wheelSegments.length;
    const normalizedAngle = (360 - (finalRotation % 360)) % 360;
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    const landedSegment = wheelSegments[segmentIndex];

    // Update states after animation
    setTimeout(() => {
      setIsSpinning(false);
      useSpins(1);
      addCoins(
        landedSegment.number,
        "Spin & Win",
        `Won ${landedSegment.number} coins from wheel spin`,
      );
      setWonCoins(landedSegment.number);
      setShowResult(true);

      toast({
        title: "🎉 Congratulations!",
        description: `You won ${landedSegment.number} coins!`,
      });
    }, 3000); // 3 second spin animation
  };

  const closeResult = () => {
    setShowResult(false);
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="flex items-center justify-center space-x-2">
          <RotateCcw className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Spin & Win Coins
          </h1>
        </div>
        <p className="text-muted-foreground">
          Try your luck and win up to 8 coins!
        </p>

        {/* Spins Left Counter */}
        <div className="flex items-center justify-center space-x-4">
          <Badge
            variant="secondary"
            className="bg-purple-900/50 text-purple-300 border-purple-600/50"
          >
            <Clock className="h-3 w-3 mr-1" />
            Spins left today: {state.spinsLeft}
          </Badge>
        </div>
      </div>

      {/* Spinning Wheel Section */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Wheel Container */}
            <div className="relative">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
              </div>

              {/* Spinning Wheel */}
              <div className="relative w-64 h-64">
                <svg
                  className={`w-full h-full transition-transform duration-3000 ease-out ${
                    isSpinning ? "animate-spin-custom" : ""
                  }`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))",
                  }}
                  viewBox="0 0 200 200"
                >
                  {wheelSegments.map((segment, index) => {
                    const angle = (360 / wheelSegments.length) * index;
                    const nextAngle =
                      (360 / wheelSegments.length) * (index + 1);

                    const x1 = 100 + 90 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 100 + 90 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 100 + 90 * Math.cos((nextAngle * Math.PI) / 180);
                    const y2 = 100 + 90 * Math.sin((nextAngle * Math.PI) / 180);

                    const largeArcFlag = nextAngle - angle > 180 ? 1 : 0;

                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ");

                    // Text position
                    const textAngle = angle + 360 / wheelSegments.length / 2;
                    const textX =
                      100 + 60 * Math.cos((textAngle * Math.PI) / 180);
                    const textY =
                      100 + 60 * Math.sin((textAngle * Math.PI) / 180);

                    return (
                      <g key={index}>
                        <defs>
                          <linearGradient
                            id={`grad-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{
                                stopColor: getGradientStart(segment.color),
                              }}
                            />
                            <stop
                              offset="100%"
                              style={{
                                stopColor: getGradientEnd(segment.color),
                              }}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={pathData}
                          fill={`url(#grad-${index})`}
                          stroke="#1e293b"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                          style={{
                            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                          }}
                        >
                          {segment.number}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="20"
                    fill="url(#center-grad)"
                    stroke="#fbbf24"
                    strokeWidth="3"
                  />
                  <defs>
                    <radialGradient id="center-grad">
                      <stop offset="0%" style={{ stopColor: "#fbbf24" }} />
                      <stop offset="100%" style={{ stopColor: "#f59e0b" }} />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Spin Button */}
            <Button
              onClick={spinWheel}
              disabled={!canSpin}
              size="lg"
              className={`w-32 h-12 text-lg font-bold transition-all duration-300 ${
                canSpin
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isSpinning ? (
                <>
                  <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                  SPINNING...
                </>
              ) : state.spinsLeft === 0 ? (
                "NO SPINS LEFT"
              ) : (
                "SPIN"
              )}
            </Button>

            {state.spinsLeft === 0 && (
              <div className="text-center space-y-2">
                <p className="text-yellow-400 font-medium">
                  Come back tomorrow!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your spins will reset at midnight
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {state.totalSpinsToday}
              </div>
              <div className="text-xs text-muted-foreground">Spins Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {20 - state.spinsLeft}/20
              </div>
              <div className="text-xs text-muted-foreground">
                Daily Progress
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-900 border-purple-600/50">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Congratulations!
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-lg pt-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Coins className="h-8 w-8 text-yellow-400" />
              <span className="text-3xl font-bold text-yellow-400">
                +{wonCoins}
              </span>
              <span className="text-xl text-muted-foreground">coins</span>
            </div>
            <p className="text-muted-foreground">
              Your coins have been added to your balance!
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              onClick={closeResult}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Awesome!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to extract gradient colors
function getGradientStart(colorClass: string): string {
  const colorMap: { [key: string]: string } = {
    "from-purple-600 to-purple-400": "#9333ea",
    "from-blue-600 to-blue-400": "#2563eb",
    "from-indigo-600 to-indigo-400": "#4f46e5",
    "from-violet-600 to-violet-400": "#7c3aed",
    "from-cyan-600 to-cyan-400": "#0891b2",
    "from-amber-600 to-amber-400": "#d97706",
    "from-emerald-600 to-emerald-400": "#059669",
  };
  return colorMap[colorClass] || "#9333ea";
}

function getGradientEnd(colorClass: string): string {
  const colorMap: { [key: string]: string } = {
    "from-purple-600 to-purple-400": "#c084fc",
    "from-blue-600 to-blue-400": "#60a5fa",
    "from-indigo-600 to-indigo-400": "#818cf8",
    "from-violet-600 to-violet-400": "#a78bfa",
    "from-cyan-600 to-cyan-400": "#22d3ee",
    "from-amber-600 to-amber-400": "#fbbf24",
    "from-emerald-600 to-emerald-400": "#34d399",
  };
  return colorMap[colorClass] || "#c084fc";
}
