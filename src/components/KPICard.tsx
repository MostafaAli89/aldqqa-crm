import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = "bg-blue-500",
  subtitle
}: KPICardProps) {
  const getTextColor = () => "text-white";
  const getSubtitleColor = () => "text-gray-200";

  return (
    <div className="group p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
          background: color === 'bg-blue-500' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)' :
                     color === 'bg-green-500' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)' :
                     color === 'bg-purple-500' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)' :
                     color === 'bg-indigo-500' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)' :
                     color === 'bg-cyan-500' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.2) 100%)' :
                     color === 'bg-rose-500' ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(225, 29, 72, 0.2) 100%)' :
                     color === 'bg-amber-500' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)' : color
        }}>
          <Icon size={24} className="text-white group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-white shadow-sm group-hover:scale-105 transition-all duration-300">
          {change > 0 ? "+" : ""}{change}%
        </div>
      </div>
      <div className="space-y-1">
        <div className={`text-2xl font-bold ${getTextColor()}`}>
          {value}
        </div>
        <div className={`text-sm ${getSubtitleColor()}`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-xs ${getSubtitleColor()}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}