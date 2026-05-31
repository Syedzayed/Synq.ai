"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeBanner } from "./welcome-banner";
import { OnboardingProgress } from "./onboarding-progress";
import { StepIdentity } from "./step-identity";
import { StepGender } from "./step-gender";
import { StepSkills } from "./step-skills";
import { StepInterests } from "./step-interests";
import { StepProjects } from "./step-projects";
import { StepGoals } from "./step-goals";
import { StepLookingFor } from "./step-looking-for";
import { ProfileReview } from "./profile-review";
import { StepGenerating } from "./step-generating";
import { completeOnboarding, type OnboardingData } from "@/actions/onboarding";

const EASE = [0.22, 1, 0.36, 1] as const;

// Steps: 0=welcome, 1–8=form steps, 9=generating
const FORM_STEPS = 8;

interface OnboardingShellProps {
  initialName?: string | null;
  isNewUser?: boolean;
}

const DEFAULT_DATA: OnboardingData = {
  name: "",
  role: "",
  organization: "",
  skills: [],
  interests: [],
  projects: "",
  goals: [],
  lookingFor: [],
  gender: "",
};

export function OnboardingShell({ initialName, isNewUser = true }: OnboardingShellProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setData] = useState<OnboardingData>({
    ...DEFAULT_DATA,
    name: initialName ?? "",
  });
  const [generatingStage, setGeneratingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const patch = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const next = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };
  const goTo = (n: number) => {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  };

  const handleSubmit = async () => {
    setError(null);
    setDirection(1);
    setStep(9); // generating screen
    setGeneratingStage(0);

    // Simulate stage progress while the server action runs
    const stageTimer = setInterval(() => {
      setGeneratingStage((s) => (s < 2 ? s + 1 : s));
    }, 1800);

    try {
      const result = await completeOnboarding(data);
      clearInterval(stageTimer);

      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setStep(8); // back to review (which is step 8 now)
        return;
      }

      setGeneratingStage(3); // "Almost ready!"
      // Brief success moment then redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1400);
    } catch (err) {
      clearInterval(stageTimer);
      console.error("[OnboardingShell] submit error:", err);
      setError("An unexpected error occurred. Please try again.");
      setStep(8);
    }
  };

  // Slide animation direction
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden py-8 px-4"
      style={{ background: "#fdfbf7" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(224,122,95,0.5) 0%, rgba(244,162,97,0.3) 50%, transparent 100%)" }}
      />

      <div className="w-full max-w-2xl mx-auto relative">
        {/* Progress bar (shown during form steps 1–8 only) */}
        <AnimatePresence>
          {step >= 1 && step <= FORM_STEPS && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mb-6"
            >
              <OnboardingProgress currentStep={step} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <div
          className="rounded-3xl w-full overflow-hidden"
          style={{
            background: "rgba(255,252,248,0.98)",
            border: "1px solid rgba(232,226,216,0.9)",
            boxShadow: "0 8px 40px rgba(58,53,48,0.08), 0 2px 8px rgba(58,53,48,0.04)",
          }}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE }}
              className="p-6 sm:p-8"
            >
              {step === 0 && (
                <WelcomeBanner
                  name={initialName}
                  isNewUser={isNewUser}
                  onStart={next}
                />
              )}
              {step === 1 && (
                <StepIdentity data={data} onChange={patch} onNext={next} />
              )}
              {step === 2 && (
                <StepGender data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 3 && (
                <StepSkills data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 4 && (
                <StepInterests data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 5 && (
                <StepProjects data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 6 && (
                <StepGoals data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 7 && (
                <StepLookingFor data={data} onChange={patch} onNext={next} onBack={back} />
              )}
              {step === 8 && (
                <>
                  {error && (
                    <div
                      className="mb-4 flex items-center gap-2.5 rounded-2xl p-3.5 text-[13px]"
                      style={{ background: "rgba(201,96,74,0.07)", border: "1px solid rgba(201,96,74,0.2)", color: "#c9604a" }}
                    >
                      {error}
                    </div>
                  )}
                  <ProfileReview
                    data={data}
                    onSubmit={handleSubmit}
                    onBack={back}
                    isLoading={false}
                  />
                </>
              )}
              {step === 9 && (
                <StepGenerating currentStage={generatingStage} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
