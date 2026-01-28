import type { Component } from "vue";
import { BanknotesIcon, CalendarDaysIcon, Cog6ToothIcon } from "@/ui/icons";
export type NavItem = {
  label: string;
  to: string;
  icon?: Component;
  exact?: boolean;
};

export const APP_NAV: NavItem[] = [
  { label: 'Calendar', to: '/calendar', icon: CalendarDaysIcon, exact: true },
  { label: 'Insights', to: '/insights', icon: BanknotesIcon },
  { label: 'Settings', to: '/settings', icon: Cog6ToothIcon },
];
