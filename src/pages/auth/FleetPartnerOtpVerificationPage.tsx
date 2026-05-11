import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Button, TextField, Alert, CircularProgress, Typography } from "@mui/material";
import AuthLayout from "../../components/auth/AuthLayout"; // Adjust path if needed; assuming same component exists

export default function FleetPartnerOtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identity = (location.state as { email?: string } | null)?.email?.trim() || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        (nextInput as HTMLElement | null)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      (prevInput as HTMLElement | null)?.focus();
    }
  };

  const handleVerify = async () => {
    if (!otp.every((digit) => digit !== "")) {
      setError("Enter the full OTP code.");
      return;
    }
    if (!identity) {
      setError("Session expired. Start again from forgot password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const otpCode = otp.join("");
    try {
      const { auth } = await import("../../utils/auth"); // dynamic import to avoid circular
      const result = await auth.verifyOtp(identity, otpCode);
      if (!result.verified) {
        setError("Invalid OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }
      const resetRequired = result.resetRequired !== false;
      if (!resetRequired) {
        navigate("/login", { replace: true });
      } else {
        navigate("/auth/reset-password", { state: { identity, otp: otpCode } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Verify OTP" subtitle="Enter the code sent to your email or phone">
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleVerify(); }} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
          {error && <Alert severity="error" sx={{ borderRadius: "12px", fontSize: 13 }}>{error}</Alert>}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, my: 2 }}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-${index}`}
                inputProps={{ inputMode: "numeric", maxLength: 1, pattern: "[0-9]*" }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                sx={{
                  width: 56,
                  height: 64,
                  "& .MuiOutlinedInput-root": {
                    fontSize: 24,
                    fontWeight: 700,
                    textAlign: "center",
                    borderRadius: 3,
                  },
                }}
              />
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            {timer > 0 ? (
              <Typography variant="body2" color="text.secondary">
                Resend code in <span style={{ color: "#f97316", fontWeight: 700 }}>{timer}s</span>
              </Typography>
            ) : (
              <Button variant="text" color="primary" sx={{ fontSize: 12, fontWeight: 600 }}>
                Resend Code
              </Button>
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontSize: 14,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              bgcolor: "#f97316",
              color: "#fff",
              "&:hover": { bgcolor: "#ea580c" },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Verify & Continue"}
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
}
