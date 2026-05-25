import { createBrowserRouter, redirect } from "react-router";
import { MapView } from "./components/MapView";
import { Profile } from "./components/Profile";
import { TripHistory } from "./components/TripHistory";
import { Subscription } from "./components/Subscription";
import { Reservations } from "./components/Reservations";
import { UnlockBike } from "./components/UnlockBike";
import { ActiveRide } from "./components/ActiveRide";
import { Login } from "./components/Login";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { PartnerLogin } from "./components/PartnerLogin";
import { PartnerDashboard } from "./components/PartnerDashboard";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/home",
    Component: MapView,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/history",
    Component: TripHistory,
  },
  {
    path: "/subscription",
    Component: Subscription,
  },
  {
    path: "/reservations",
    Component: Reservations,
  },
  {
    path: "/unlock",
    Component: UnlockBike,
  },
  {
    path: "/ride/:bikeId",
    Component: ActiveRide,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/partner",
    Component: PartnerLogin,
  },
  {
    path: "/partner/dashboard",
    Component: PartnerDashboard,
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);
