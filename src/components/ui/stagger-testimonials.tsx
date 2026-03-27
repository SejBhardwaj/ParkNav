"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000_UNUSED = Math.sqrt(5000); // kept for reference
void SQRT_5000_UNUSED;

export const parkingTestimonials = [
  { tempId: 0, testimonial: "My favorite solution in the market. We park 5x faster with ParkNav.", by: "Alex, CEO at TechCorp", imgSrc: "https://i.pravatar.cc/150?img=1" },
  { tempId: 1, testimonial: "I used to circle for 30 minutes finding parking near Khan Market. Now I book in advance and walk right in.", by: "Priya Mehta, Business Professional", imgSrc: "https://i.pravatar.cc/150?img=2" },
  { tempId: 2, testimonial: "Saved me 20 minutes every day in Connaught Place! ParkNav is a game-changer for Delhi commuters.", by: "Rahul Sharma, Daily Commuter", imgSrc: "https://i.pravatar.cc/150?img=3" },
  { tempId: 3, testimonial: "The real-time availability feature is incredible. I can see exactly how many spots are left before I even leave home.", by: "Arjun Kapoor, Weekend Shopper", imgSrc: "https://i.pravatar.cc/150?img=4" },
  { tempId: 4, testimonial: "As someone who drives to meetings all day, ParkNav has made my life so much easier.", by: "Neha Singh, Startup Founder", imgSrc: "https://i.pravatar.cc/150?img=5" },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof parkingTestimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer transition-all duration-500 ease-in-out rounded-2xl border",
        isCenter
          ? "z-10 bg-white/10 border-white/20 backdrop-blur-md shadow-2xl"
          : "z-0 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0 0 40px rgba(99,179,237,0.15), 0 8px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="p-8 h-full flex flex-col">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400 text-xl">★</span>
          ))}
        </div>

        {/* Quote */}
        <p className={cn(
          "text-center text-sm sm:text-base leading-relaxed flex-1",
          isCenter ? "text-white" : "text-white/50"
        )}>
          "{testimonial.testimonial}"
        </p>

        {/* Author */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <img
            src={testimonial.imgSrc}
            alt={testimonial.by.split(',')[0]}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
          />
          <div>
            <div className={cn("text-sm font-semibold", isCenter ? "text-white" : "text-white/50")}>
              {testimonial.by.split(',')[0]}
            </div>
            <div className={cn("text-xs", isCenter ? "text-gray-400" : "text-white/30")}>
              {testimonial.by.split(',').slice(1).join(',').trim()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState(parkingTestimonials);

  const handleMove = (steps: number) => {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const update = () => setCardSize(window.matchMedia("(min-width: 640px)").matches ? 365 : 290);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const centerIndex = list.length % 2 ? (list.length + 1) / 2 : list.length / 2;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 520 }}>
      {list.map((t, index) => {
        const position = list.length % 2
          ? index - (list.length + 1) / 2
          : index - list.length / 2;
        return (
          <TestimonialCard
            key={t.tempId}
            testimonial={t}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Nav buttons + dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={() => handleMove(-1)}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-1.5 items-center">
          {list.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => handleMove(i - Math.floor(5 / 2))}
              className={cn(
                "rounded-full transition-all",
                i === Math.floor(centerIndex % 5)
                  ? "w-6 h-2.5 bg-blue-500"
                  : "w-2.5 h-2.5 bg-white/30"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => handleMove(1)}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
