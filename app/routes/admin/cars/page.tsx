import { useEffect } from "react";

import CarMetrics from "../dashboard/components/cars/CarMetrics";
import CarSearchToolbar from "../dashboard/components/cars/CarSearchToolbar";
import CarTable from "../dashboard/components/cars/CarTable";
import CreateCarModal from "../dashboard/components/cars/CreateCarModal";
import EditCarModal from "../dashboard/components/cars/EditCarModal";
import CredentialModal from "../dashboard/components/cars/CredentialModal";
import { useAdminShell } from "../shell/ShellContext";
import { useCarsList } from "./hooks/useCarsList";

export function meta() {
  return [
    { title: "รถตะไล — KUKPS smart talai" },
    {
      name: "description",
      content: "จัดการข้อมูลรถตะไลประจำสาย และข้อมูลการเดินรถเบื้องต้น",
    },
  ];
}

export default function CarsListPage() {
  const { setBreadcrumb } = useAdminShell();
  const cars = useCarsList();

  useEffect(() => {
    setBreadcrumb(null);
  }, [setBreadcrumb]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">รถตะไล</h2>
          <p className="text-sm text-muted-foreground">
            จัดการข้อมูลรถตะไลประจำสาย และข้อมูลการเดินรถเบื้องต้น
          </p>
        </div>
      </header>

      <CarMetrics
        total={cars.metrics.total}
        active={cars.metrics.active}
        inactive={cars.metrics.inactive}
        deleted={cars.metrics.deleted}
        isLoading={cars.isLoading}
      />

      <div className="overflow-hidden rounded-md border bg-background shadow-sm">
        <CarSearchToolbar
          searchQuery={cars.searchQuery}
          onSearchChange={cars.setSearchQuery}
          statusFilter={cars.statusFilter}
          onStatusFilterChange={cars.setStatusFilter}
          routeFilter={cars.routeFilter}
          onRouteFilterChange={cars.setRouteFilter}
          routes={cars.routes}
          isLoading={cars.isLoading}
          onRefresh={cars.refresh}
          onOpenCreateModal={cars.openCreateModal}
        />

        <div className="p-0">
          {cars.error && (
            <div className="m-4 flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <span>{cars.error}</span>
              <button
                onClick={cars.refresh}
                className="font-semibold underline hover:text-destructive/80"
              >
                ลองอีกครั้ง
              </button>
            </div>
          )}

          <CarTable
            cars={cars.cars}
            filteredCars={cars.filteredCars}
            routeNameMap={cars.routeNameMap}
            isLoading={cars.isLoading}
            deletingId={cars.deletingId}
            onOpenEdit={cars.openEditModal}
            onDelete={cars.requestDelete}
            onRestore={cars.requestRestore}
            onOpenCredential={cars.openCredentials}
          />
        </div>
      </div>

      <CredentialModal
        isOpen={Boolean(cars.credentialCarId)}
        carId={cars.credentialCarId || ""}
        onClose={cars.closeCredentials}
      />

      <CreateCarModal
        isOpen={cars.isCreateModalOpen}
        carNumber={cars.newCarNumber}
        routeId={cars.newRouteId}
        routes={cars.routes}
        isSubmitting={cars.isSubmitting}
        onChangeCarNumber={cars.setNewCarNumber}
        onChangeRouteId={cars.setNewRouteId}
        onSubmit={cars.submitCreate}
        onClose={cars.closeCreateModal}
      />

      <EditCarModal
        car={cars.editingCar}
        carNumber={cars.editCarNumber}
        routeId={cars.editRouteId}
        routes={cars.routes}
        isSubmitting={cars.isSubmitting}
        onChangeCarNumber={cars.setEditCarNumber}
        onChangeRouteId={cars.setEditRouteId}
        onSubmit={cars.submitUpdate}
        onClose={cars.closeEditModal}
      />
    </div>
  );
}
