"use client";
import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  Building2,
  ChevronDown,
  Check,
  RefreshCw,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { api } from "../lib/api";

export default function Navbar({ onRefresh }) {
  const { companies, currentCompany, currentCompanyName, switchCompany } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBatchAnalyze = async () => {
    try {
      setRunningBatch(true);
      setBatchResult(null);
      const res = await api.batchInvestigate(currentCompany);
      setBatchResult(res);
      if (onRefresh) onRefresh();
      setTimeout(() => setBatchResult(null), 8000);
    } catch (err) {
      console.error("Batch investigation failed:", err);
      alert(`Recovery Agent run failed: ${err.message}`);
    } finally {
      setRunningBatch(false);
    }
  };

  const handleMobileMenuToggle = () => {
    window.dispatchEvent(new CustomEvent("rcy-toggle-mobile-sidebar"));
  };

  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 sticky top-0 z-20 shrink-0 select-none">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button, Enterprise Tenant Switcher & Security Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Tenant Switcher Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 px-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 flex items-center space-x-2 text-xs font-semibold text-gray-900 transition-colors shadow-subtle group focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            >
              <div className="w-5 h-5 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF9900] group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-gray-900 tracking-tight max-w-[130px] sm:max-w-[200px] truncate">
                {currentCompanyName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-modal p-2 z-50 animate-scale-in">
                <div className="px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-gray-400 border-b border-gray-100 flex items-center justify-between">
                  <span>Enterprise Workspaces</span>
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                    RLS ENABLED
                  </span>
                </div>
                <div className="space-y-1 mt-1.5 max-h-64 overflow-y-auto">
                  {companies.map((comp) => {
                    const isSelected = comp.id === currentCompany;
                    return (
                      <button
                        key={comp.id}
                        onClick={() => {
                          switchCompany(comp.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-orange-50 text-gray-900 font-semibold border border-orange-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-gray-900 truncate">{comp.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{comp.id}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#FF9900] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tenant Isolation Status Pill */}
          <div className="h-9 hidden md:flex items-center space-x-2 px-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 font-medium select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="tracking-tight text-[11px] font-semibold text-gray-700">
              Tenant Isolated RLS
            </span>
          </div>
        </div>

        {/* Right Side: Primary Action, Divider & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* Run Recovery Agent Button (Amazon Primary CTA) */}
          <button
            onClick={handleBatchAnalyze}
            disabled={runningBatch}
            className="btn-primary h-9 px-3.5 sm:px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF9900] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 shrink-0 text-gray-950 ${
                runningBatch ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
            <span className="hidden sm:inline">
              {runningBatch ? "Evaluating Evidence..." : "Run Recovery Agent"}
            </span>
            <span className="sm:hidden">
              {runningBatch ? "Evaluating..." : "Run Agent"}
            </span>
          </button>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-gray-200 mx-0.5" />

          {/* User Profile Area */}
          <div className="h-9 flex items-center space-x-2.5 pl-1 cursor-default select-none">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#FF9900] shadow-subtle">
                SC
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-gray-900 leading-tight">Sarah Chen</div>
              <div className="text-[10px] text-gray-500 leading-tight">Claims Analyst</div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch run result notification toast */}
      {batchResult && (
        <div className="absolute top-16 right-4 sm:right-8 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-modal text-xs text-gray-900 z-50 flex items-center space-x-3 animate-fade-in-down max-w-md sm:max-w-lg">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
            <Check className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900">Recovery Agent Evaluation Complete</div>
            <div className="text-[11px] text-gray-600 font-mono mt-0.5 leading-relaxed">
              {batchResult.processed} evaluated &bull;{" "}
              <span className="text-emerald-700 font-bold">{batchResult.contradicted} Recoverable</span> &bull;{" "}
              {batchResult.silent} Silent &bull; {batchResult.uncertain} Uncertain &bull;{" "}
              {batchResult.supported} Supported
            </div>
          </div>
          <button
            onClick={() => setBatchResult(null)}
            className="text-gray-400 hover:text-gray-700 text-lg ml-2 shrink-0 p-1"
            aria-label="Dismiss alert"
          >
            &times;
          </button>
        </div>
      )}
    </header>
  );
}
