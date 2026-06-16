import { auth } from "./auth";

export async function requireAal2(): Promise<void> {
  if (auth.isAal2()) {
    return;
  }

  await auth.requestAal2StepUp();
  throw new Error("AAL2 step-up required");
}
