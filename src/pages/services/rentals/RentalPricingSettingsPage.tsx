import React, { useState } from "react";
import { toastManager } from "../../../utils/toastManager";
import { requireAal2 } from "../../../utils/stepUp";

export default function RentalPricingSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await requireAal2();
      toastManager.show("Pricing settings saved", "success");
    } catch (error) {
      if (error instanceof Error && error.message !== "AAL2 step-up required") {
        toastManager.show(error.message, "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
            Rental pricing settings
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            This page is wired into the Fleet Partner shell. Replace this stub with the full designed canvas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save pricing"}
        </button>
      </div>
    </div>
  );
}
