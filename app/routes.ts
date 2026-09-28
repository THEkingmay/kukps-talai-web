import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/page.tsx"),
  layout("routes/admin/layout.tsx", [
    route("admin/dashboard", "routes/admin/dashboard/page.tsx"),
  ]),
  layout("routes/auth/layout.tsx", [
    route("auth", "routes/auth/page.tsx"),
    route("auth/reset-password", "routes/auth/reset_password/page.tsx"),
  ]),
  layout("routes/driver/layout.tsx", [
    route("driver/dashboard", "routes/driver/dashboard/page.tsx"),
  ]),
  layout("routes/eta/layout.tsx", [route("eta", "routes/eta/page.tsx")]),
] satisfies RouteConfig;
