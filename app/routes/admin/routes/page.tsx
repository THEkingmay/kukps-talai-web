import { useEffect } from "react";

import RouteTable from "../dashboard/components/routes/RouteTable";
import CreateRouteModal from "../dashboard/components/routes/CreateRouteModal";
import EditRouteModal from "../dashboard/components/routes/EditRouteModal";
import RoutePointModal from "../dashboard/components/routes/RoutePoint.component";
import { useAdminShell } from "../shell/ShellContext";
import { formatDate } from "~/helper";

import RouteSearchToolbar from "./components/RouteSearchToolbar";
import RoutesPageHeader from "./components/RoutesPageHeader";
import { useRoutesList } from "./hooks/useRoutesList";

export function meta() {
  return [
    { title: "สายการเดินรถ — KUKPS smart talai" },
    {
      name: "description",
      content: "จัดการเส้นทางเดินรถและจุดจอดต่างๆ ของรถตะไล",
    },
  ];
}

export default function RoutesListPage() {
  const { setBreadcrumb } = useAdminShell();
  const routes = useRoutesList();

  useEffect(() => {
    setBreadcrumb(null);
  }, [setBreadcrumb]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <RoutesPageHeader
        isLoading={routes.isLoading}
        onRefresh={routes.refresh}
        onCreate={routes.openCreateModal}
      />

      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <RouteSearchToolbar
          searchQuery={routes.searchQuery}
          onSearchChange={routes.setSearchQuery}
          totalRoutes={routes.routes.length}
        />

        <div className="p-0">
          {routes.error && (
            <div className="m-4 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
              <span>{routes.error}</span>
              <button
                onClick={routes.refresh}
                className="underline font-semibold hover:text-destructive/80"
              >
                ลองอีกครั้ง
              </button>
            </div>
          )}

          <RouteTable
            routes={routes.routes}
            filteredRoutes={routes.filteredRoutes}
            isLoading={routes.isLoading}
            deletingId={routes.deletingId}
            onOpenEdit={routes.openEditModal}
            onOpenPoints={routes.openPointsEditor}
            onDelete={routes.requestDelete}
            onRestore={routes.requestRestore}
            formatDate={formatDate}
          />
        </div>
      </div>

      <CreateRouteModal
        isOpen={routes.isCreateModalOpen}
        routeName={routes.newRouteName}
        isSubmitting={routes.isSubmitting}
        onChangeName={routes.setNewRouteName}
        onSubmit={routes.submitCreate}
        onClose={routes.closeCreateModal}
      />

      <EditRouteModal
        route={routes.editingRoute}
        editName={routes.editRouteName}
        isSubmitting={routes.isSubmitting}
        onChangeName={routes.setEditRouteName}
        onSubmit={routes.submitUpdate}
        onClose={routes.closeEditModal}
      />

      <RoutePointModal
        isOpen={Boolean(routes.pointsRoute)}
        route={routes.pointsRoute}
        onClose={routes.closePointsEditor}
      />
    </div>
  );
}
