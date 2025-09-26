import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it, vi } from "vitest";
import MainLayout from "./MainLayout";

vi.mock("@/components/sidebar/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="app-sidebar" />,
}));

vi.mock("@/components/ui/sidebar", () => ({
  __esModule: true,
  SidebarProvider: ({ children }) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children, className }) => (
    <div data-testid="sidebar-inset" className={className}>
      {children}
    </div>
  ),
  SidebarTrigger: ({ children, ...props }) => <button {...props}>{children}</button>,
  useSidebar: () => ({ isMobile: false }),
}));

vi.mock("@/components/ui/sonner", () => ({
  __esModule: true,
  Toaster: () => <div data-testid="toaster" />,
}));

const createStore = (authState) => {
  const authReducer = (state = authState) => state;

  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe("MainLayout", () => {
  it("renders the public layout when unauthenticated on a public route", () => {
    const store = createStore({ isAuthenticated: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<div>Public Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/get started/i)).toBeInTheDocument();
    expect(screen.getByText("Public Content")).toBeInTheDocument();
    expect(screen.queryByTestId("app-sidebar")).not.toBeInTheDocument();
  });

  it("renders the dashboard layout when authenticated on a protected route", () => {
    const store = createStore({ isAuthenticated: true });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard/admin/1"]}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/dashboard/admin/:id" element={<div>Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText(/get started/i)).not.toBeInTheDocument();
  });
});
