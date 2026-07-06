import {
  Landmark,
  Building2,
  ShieldCheck,
  Home,
  Briefcase,
  Users,
  HandCoins,
  CalendarCheck,
  TrendingUp,
  Moon,
  Bus,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  landmark: Landmark,
  building: Building2,
  shield: ShieldCheck,
  home: Home,
  briefcase: Briefcase,
  users: Users,
  coins: HandCoins,
  calendar: CalendarCheck,
  trending: TrendingUp,
  moon: Moon,
  bus: Bus,
};

type AreaIconProps = {
  name: string;
  className?: string;
};

export default function AreaIcon({ name, className = "h-6 w-6" }: AreaIconProps) {
  const Icon = icons[name] ?? Landmark;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}
