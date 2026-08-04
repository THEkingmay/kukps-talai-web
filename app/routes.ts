import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  layout("routes/admin/layout.tsx", [
    route("admin/dashboard", "routes/admin/DashboardPage.tsx"),
  ]),
  layout("routes/auth/layout.tsx", [route("auth", "routes/auth/AuthPage.tsx")]),
] satisfies RouteConfig;
