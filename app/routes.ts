import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/page.tsx"),
  layout("routes/admin/layout.tsx", [
    layout("routes/admin/shell/layout.tsx", [
      route("admin", "routes/admin/index.tsx"),
      route("admin/dashboard", "routes/admin/dashboard/page.tsx"),
      route("admin/users", "routes/admin/users/page.tsx"),
      route("admin/invites", "routes/admin/invites/page.tsx"),
      route("admin/cars", "routes/admin/cars/page.tsx"),
      route("admin/cars/:carId", "routes/admin/cars/$carId.tsx"),
      route("admin/routes", "routes/admin/routes/page.tsx"),
      route("admin/routes/:routeId", "routes/admin/routes/$routeId.tsx"),
      route("admin/assignments", "routes/admin/assignments/page.tsx"),
      route(
        "admin/assignments/:driverId",
        "routes/admin/assignments/$driverId.tsx",
      ),
      route("admin/eta", "routes/admin/eta/page.tsx"),
    ]),
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
