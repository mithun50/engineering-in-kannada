import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

const quotes = [
  "ಕಲಿಕೆಯು ನಿರಂತರ ಪ್ರಯಾಣ - Every day is a new opportunity to learn",
  "ಪ್ರತಿಯೊಂದು ಸವಾಲು ನಿಮ್ಮನ್ನು ಬಲಪಡಿಸುತ್ತದೆ - Each challenge makes you stronger",
  "ನಿಮ್ಮ ಕನಸುಗಳನ್ನು ನನಸಾಗಿಸಲು ಇಂದೇ ಪ್ರಾರಂಭಿಸಿ - Start today to achieve your dreams"
];

interface Props {
  showCelebration?: boolean;
}

export function MotivationalQuote({ showCelebration = false }: Props) {
  const [quote] = React.useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  React.useEffect(() => {
    if (showCelebration) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [showCelebration]);

  return (
    <div className="rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20 p-6">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-lg font-medium text-white text-center">{quote}</p>
      </div>
    </div>
  );
}