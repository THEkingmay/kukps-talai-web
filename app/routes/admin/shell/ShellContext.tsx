import { createContext, useContext, useState } from "react";

interface AdminShellContextValue {
  /** Extra breadcrumb segment set by detail pages (e.g. car number / route name). */
  breadcrumb: string | null;
  setBreadcrumb: (label: string | null) => void;
}

const AdminShellContext = createContext<AdminShellContextValue>({
  breadcrumb: null,
  setBreadcrumb: () => {},
});

export const useAdminShell = () => useContext(AdminShellContext);

export function AdminShellProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumb, setBreadcrumb] = useState<string | null>(null);

  return (
    <AdminShellContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </AdminShellContext.Provider>
  );
}
