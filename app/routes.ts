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
  layout("routes/auth/layout.tsx", [route("auth", "routes/auth/page.tsx")]),
] satisfies RouteConfig;
