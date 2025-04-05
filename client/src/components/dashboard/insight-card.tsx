import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import MotionDot from "../ui/motion-dot";
import { type ReactNode } from "react";

interface InsightCardProps {
  title: string;
  children: ReactNode;
}

export function InsightCard({ title, children }: InsightCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white rounded-2xl shadow-sm border-gray-200/30 h-full">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <MotionDot />
            <h3 className="font-display font-semibold ml-2">{title}</h3>
          </div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ProgressInsightProps {
  title: string;
  progress: number;
  label: string;
  trend?: { value: number; isPositive: boolean };
  description?: string;
}

export function ProgressInsight({ 
  title, 
  progress, 
  label, 
  trend, 
  description 
}: ProgressInsightProps) {
  return (
    <InsightCard title={title}>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-500">{label}</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      {trend && (
        <div className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend.isPositive ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
        </div>
      )}
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    </InsightCard>
  );
}

interface ScoreInsightProps {
  title: string;
  score: number;
  maxScore?: number;
  trend?: { value: number; isPositive: boolean };
  description?: string;
}

export function ScoreInsight({ 
  title, 
  score, 
  maxScore = 10, 
  trend, 
  description 
}: ScoreInsightProps) {
  return (
    <InsightCard title={title}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold text-skyBlue">{score.toFixed(1)}</div>
        {trend && (
          <div className={`${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trend.isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}</span>
          </div>
        )}
      </div>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </InsightCard>
  );
}

interface GridInsightProps {
  title: string;
  items: Array<{ label: string; value: string | number; percent?: number }>;
  description?: string;
}

export function GridInsight({ title, items, description }: GridInsightProps) {
  const gridCols = `grid-cols-${Math.min(items.length, 4)}`;
  
  return (
    <InsightCard title={title}>
      <div className={`grid grid-cols-2 gap-2 mb-4`}>
        {items.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-lg font-medium">{item.label}</div>
            <div className="text-sm text-gray-500">
              {item.percent !== undefined ? `${item.percent}%` : item.value}
            </div>
          </div>
        ))}
      </div>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </InsightCard>
  );
}
