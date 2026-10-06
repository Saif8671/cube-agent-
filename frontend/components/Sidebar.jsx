"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FileCheck2,
  TrendingUp,
  FolderSync,
  Database,
  ShieldCheck,
  Scale,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Operations Center", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Charges Explorer", href: "/charges", icon: Receipt },
      { name: "Recovery Pipeline", href: "/recovery", icon: TrendingUp },
      { name: "Claims & Audit", href: "/claims", icon: FileCheck2 },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { name: "Evidence Records", href: "/evidence", icon: FolderSync },
    ],
  },
  {
    title: "DATA",
    items: [
      { name: "Data Ingestion", href: "/data-sources", icon: Database },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Listen for mobile sidebar toggle events from Navbar
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("rcy-toggle-mobile-sidebar", handleToggle);
    window.addEventListener("rcy-close-mobile-sidebar", handleClose);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("rcy-toggle-mobile-sidebar", handleToggle);
      window.removeEventListener("rcy-close-mobile-sidebar", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isItemActive = (href) => {
    if (pathname === href) return true;
    if (href !== "/dashboard" && pathname?.startsWith(href)) return true;
    // Map investigation drilldown to Charges Explorer
    if (href === "/charges" && pathname?.startsWith("/investigations")) return true;
    return false;
  };

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col flex-1 justify-between min-h-0">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-gray-200 flex items-center shrink-0 ${
            !isMobile && collapsed ? "justify-center px-2" : "px-5 justify-between"
          }`}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF9900] shadow-sm shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            {(isMobile || !collapsed) && (
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 tracking-tight text-sm font-sans">
                    RCY RECOVERY
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 font-mono px-1.5 py-0.5 rounded font-semibold border border-gray-200">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  Evidence Operations Center
                </p>
              </div>
            )}
          </div>

          {/* Close button for mobile drawer */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-4 flex-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {(isMobile || !collapsed) && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!isMobile && collapsed ? item.name : undefined}
                    className={`relative flex items-center ${
                      !isMobile && collapsed ? "justify-center px-2" : "space-x-3 px-3"
                    } py-2 rounded-lg text-xs font-medium transition-colors group ${
                      active
                        ? "bg-orange-50/80 text-gray-900 font-semibold border border-orange-200/70"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {active && (isMobile || !collapsed) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FF9900] rounded-r-full" />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        active ? "text-[#FF9900]" : "text-gray-500 group-hover:text-gray-800"
                      }`}
                    />
                    {(isMobile || !collapsed) && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-3 space-y-3 border-t border-gray-100 shrink-0">
        {/* Conservative AI Engine Badge Card */}
        {(isMobile || !collapsed) && (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/90 text-xs shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-gray-900 font-semibold text-xs">
                <div className="w-5 h-5 rounded-md bg-orange-100 text-[#FF9900] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Conservative AI</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-700 font-bold tracking-wider">
                  ACTIVE
                </span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
              Zero hallucinated claims. Missing physical proof strictly yields{" "}
              <span className="font-mono text-gray-800 font-bold bg-white px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                SILENT
              </span>
              .
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-full flex items-center justify-center py-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 text-xs"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-medium">Collapse Sidebar</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP PERMANENT NAVIGATION RAIL (Visible on lg screens and wider) */}
      <aside
        className={`hidden lg:flex ${
          collapsed ? "w-[72px]" : "w-64"
        } h-screen bg-white border-r border-gray-200 flex-col justify-between shrink-0 select-none z-30 transition-all duration-200 ease-in-out`}
      >
        {renderNavContent(false)}
      </aside>

      {/* 2. MOBILE & TABLET RESPONSIVE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50 transform transition-transform duration-200 ease-in-out">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
