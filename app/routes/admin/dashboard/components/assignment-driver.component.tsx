import { Plus, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAssignmentDriver } from "../hooks/useAssignmentDriver";
import AssignmentFilters from "./assignment-driver/AssignmentFilters";
import { AssignmentDriverSheet } from "./assignment-driver/AssignmentDriverSheet";
import { AssignmentDriverTable } from "./assignment-driver/AssignmentDriverTable";

export default function AssignmentDriverComponent() {
  const assignment = useAssignmentDriver();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">มอบหมายงานคนขับ</h2>
          <p className="text-muted-foreground text-sm">
            จัดการตารางงานและผูกรถให้กับคนขับแต่ละช่วงเวลา
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={assignment.fetchData}
            disabled={assignment.isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${assignment.isLoading ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </Button>
          <Button onClick={assignment.handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มตารางงาน
          </Button>
        </div>
      </div>

      <AssignmentFilters
        searchTerm={assignment.searchTerm}
        onSearchChange={assignment.setSearchTerm}
        statusFilter={assignment.statusFilter}
        onStatusFilterChange={assignment.setStatusFilter}
        dateFilter={assignment.dateFilter}
        onDateFilterChange={assignment.setDateFilter}
        driverFilter={assignment.driverFilter}
        onDriverFilterChange={assignment.setDriverFilter}
        driverOptions={assignment.driverOptions}
        getDriverEmail={assignment.getDriverEmail}
        hasAnyFilter={assignment.hasAnyFilter}
        onClearFilters={assignment.clearFilters}
      />

      <AssignmentDriverTable
        assignments={assignment.filteredShifts}
        isLoading={assignment.isLoading}
        onEdit={assignment.handleOpenEdit}
        onDelete={assignment.handleDelete}
      />

      <AssignmentDriverSheet
        open={assignment.isSheetOpen}
        onOpenChange={assignment.setIsSheetOpen}
        initialData={assignment.editingData}
        driverOptions={assignment.driverOptions}
        carOptions={assignment.carOptions}
        existingAssignments={assignment.shifts}
        onSubmit={assignment.handleSubmit}
        isSubmitting={assignment.isSubmitting}
      />
    </div>
  );
}
