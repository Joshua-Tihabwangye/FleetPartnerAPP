import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";

export default function FleetPartnerTwoFactorSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const backupCodes = [
    "A7X2-M9P4-K3L8",
    "B5N1-J6W2-H9T4",
    "C3Q8-R7Y5-F2V1",
    "D9Z4-S1X6-G8M3",
    "E6K2-P4N9-L7W5",
    "F8T1-Q3Y7-J5R2"
  ];

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      toastManager.show("Please enter a 6-digit code", "error");
      return;
    }
    setStep(3);
    toastManager.show("2FA setup complete!", "success");
  };

  const handleComplete = () => {
    localStorage.setItem("2fa_enabled", "true");
    toastManager.show("Two-factor authentication is now active", "success");
    navigate("/settings/account-security");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-10 py-6 bg-slate-50">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/settings/account-security"
            className="text-sm text-slate-600 hover:text-slate-900 mb-2 inline-block"
          >
            ← Back to Account Security
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Set up Two-Factor Authentication</h1>
          <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                    ? "bg-ev-green text-white"
                    : "bg-slate-200 text-slate-500"
                  }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 ${step > s ? "bg-ev-green" : "bg-slate-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Scan QR Code */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Scan QR Code</h2>
            <p className="text-sm text-slate-600 mb-4">
              Use an authenticator app (like Google Authenticator or Authy) to scan this QR code.
            </p>

            {/* Mock QR Code */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 flex items-center justify-center mb-4">
              <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-7 gap-1">
                  {Array(49).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-sm ${Math.random() > 0.5 ? "bg-slate-900" : "bg-white"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">Can't scan? Enter this code manually:</p>
              <code className="text-sm font-mono text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                EVZN-FLTP-ABCD-1234-EFGH-5678
              </code>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white font-medium hover:opacity-90 transition"
            >
              I've scanned the code →
            </button>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Verify Setup</h2>
            <p className="text-sm text-slate-600 mb-4">
              Enter the 6-digit code from your authenticator app to verify the setup.
            </p>

            <label className="block mb-4">
              <span className="text-xs font-medium text-slate-700">Authentication Code</span>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full mt-1 px-4 py-3 text-center text-2xl font-mono tracking-widest rounded-lg border border-slate-300 focus:ring-2 focus:ring-ev-green focus:outline-none"
                placeholder="000000"
                maxLength={6}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                onClick={handleVerifyCode}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white font-medium hover:opacity-90 transition"
              >
                Verify →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Save Backup Codes</h2>
            <p className="text-sm text-slate-600 mb-4">
              Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-600">⚠️</span>
                <p className="text-xs text-amber-800">
                  Each code can only be used once. Keep these codes private and secure.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <div
                    key={i}
                    className="bg-white px-3 py-2 rounded border border-slate-200 font-mono text-sm text-center"
                  >
                    {showBackupCodes ? code : "••••-••••-••••"}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="mt-3 text-xs text-ev-green hover:text-ev-green-dark font-medium"
              >
                {showBackupCodes ? "Hide codes" : "Show codes"}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                  toastManager.show("Codes copied to clipboard", "success");
                }}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                📋 Copy codes
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'evzone-backup-codes.txt';
                  a.click();
                  toastManager.show("Codes downloaded", "success");
                }}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ⬇️ Download
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-ev-green to-emerald-600 text-white font-medium hover:opacity-90 transition"
            >
              Complete Setup ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
