// src/App.jsx
import React, { useState } from "react";
import { FitProfileProvider, useFitProfile } from "./context/FitProfileContext";
import Step0_SocialLogin from "./components/Step0_SocialLogin";
import Step1_BasicInfo from "./components/Step1_BasicInfo";
import Step2_MethodSelection from "./components/Step2_MethodSelection";
import Step2_1_DirectInput from "./components/Step2_1_DirectInput";
import Step2_2_DbSelection from "./components/Step2_2_DbSelection";
import Step3_DetailedFit from "./components/Step3_DetailedFit";
import Step4_Completion from "./components/Step4_Completion";
import Dashboard_Main from "./components/Dashboard_Main";
import AdminDashboard from "./components/AdminDashboard"; // 관리자 대시보드 전격 임포트!
import "./App.css";

function AppContent() {
  const { profile, setStep, resetMeasures, getFitAccuracy } = useFitProfile();
  const { step } = profile;

  const accuracy = getFitAccuracy();

  // 어떤 단계 네비게이션 글자에 마우스가 맴도는지 관리하는 상태 (영롱한 호버 시각 대비용)
  const [hoveredNav, setHoveredNav] = useState(null);

  if (step === "dashboard") {
    return (
      <div className="onboarding-container dashboard-mode" style={{ width: "100%" }}>
        <Dashboard_Main />
      </div>
    );
  }

  // 관리자 대시보드 분기 처리
  if (step === "admin") {
    return (
      <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>
        <AdminDashboard />
      </div>
    );
  }

  // 각 스텝 ID를 순차 단편 수치로 정렬하여 크기 비교를 원활히 함
  const getCurrentStepVal = () => {
    if (step === 2 || step === 2.1 || step === 2.2) return 2;
    return step; // 1, 3, 4 등
  };

  const currentVal = getCurrentStepVal();

  // 사용자가 이미 거쳐온 과거의 단계(나보다 작거나 같은 단계)로만 클릭하여 순간이동 가능하게 제어!
  const isTargetNavigable = (targetVal) => {
    return targetVal <= currentVal;
  };

  const handleNavClick = (targetVal) => {
    if (!isTargetNavigable(targetVal)) return; // 아직 오지 않은 미래 단계 클릭 잠금

    if (targetVal === 2) {
      // 2단계(기준설정)로 역회군하는 경우, 작성 중이던 불완전 측정 데이터를 깨끗이 청소하고 분기화면으로 이동!
      resetMeasures();
      setStep(2);
    } else {
      setStep(targetVal);
    }
  };

  const getNavStyle = (targetVal) => {
    const isActive = currentVal === targetVal;
    const isNavigable = targetVal < currentVal; // 나보다 앞선 과거
    
    // 1. 현재 활성화된 주인공 단계 스타일
    if (isActive) {
      return {
        color: targetVal === 4 ? "var(--secondary)" : "var(--primary)",
        fontWeight: "800",
        cursor: "default",
        textDecoration: "none",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "inline-block"
      };
    }
    
    // 2. 뒤로 되돌아갈 수 있는 과거 단계 스타일 (다이내믹 은은한 백색 hover + 1px 부유 효과)
    if (isNavigable) {
      const isHovered = hoveredNav === targetVal;
      return {
        color: isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
        fontWeight: "700",
        cursor: "pointer",
        textDecoration: isHovered ? "underline" : "none",
        textUnderlineOffset: "4px",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "translateY(-1px)" : "none",
        display: "inline-block"
      };
    }
    
    // 3. 아직 도달하지 못한 미래 단계 스타일 (잠금 회색 + 진입 금지 커서)
    return {
      color: "var(--text-muted)",
      fontWeight: "500",
      cursor: "not-allowed",
      textDecoration: "none",
      transition: "all 0.25s",
      display: "inline-block"
    };
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <Step0_SocialLogin />;
      case 1:
        return <Step1_BasicInfo />;
      case 2:
        return <Step2_MethodSelection />;
      case 2.1:
        return <Step2_1_DirectInput />;
      case 2.2:
        return <Step2_2_DbSelection />;
      case 3:
        return <Step3_DetailedFit />;
      case 4:
        return <Step4_Completion />;
      default:
        return <Step0_SocialLogin />;
    }
  };

  return (
    <div className="onboarding-container">
      {step > 0 && step !== "admin" && (
        <div style={{ marginBottom: "32px", width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 상단 타임슬립 프로그레스 인디케이터 바 (상단 가운데 정렬) */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", gap: "8px", fontSize: "13px", fontWeight: "600", alignItems: "center", justifyContent: "center" }}>
              <span
                style={getNavStyle(1)}
                onClick={() => handleNavClick(1)}
                onMouseEnter={() => isTargetNavigable(1) && setHoveredNav(1)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                기본정보
              </span>
              <span style={{ color: "var(--text-muted)", userSelect: "none" }}>•</span>
              
              <span
                style={getNavStyle(2)}
                onClick={() => handleNavClick(2)}
                onMouseEnter={() => isTargetNavigable(2) && setHoveredNav(2)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                기준설정
              </span>
              <span style={{ color: "var(--text-muted)", userSelect: "none" }}>•</span>
              
              <span
                style={getNavStyle(3)}
                onClick={() => handleNavClick(3)}
                onMouseEnter={() => isTargetNavigable(3) && setHoveredNav(3)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                상세체형
              </span>
              <span style={{ color: "var(--text-muted)", userSelect: "none" }}>•</span>
              
              <span
                style={getNavStyle(4)}
                onClick={() => handleNavClick(4)}
                onMouseEnter={() => isTargetNavigable(4) && setHoveredNav(4)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                설정완료
              </span>
            </div>
          </div>

          {/* 게이지 바 */}
          <div style={{
            height: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%"
          }}>
            <div style={{
              height: "100%",
              width: `${accuracy}%`,
              background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
              borderRadius: "10px",
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}></div>
          </div>

          {/* 핏 분석 정확도 수치를 바 아래쪽으로 이동 */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--secondary)" }}>
              핏 분석 정확도: <span style={{ color: "#ffffff", fontWeight: "800" }}>{accuracy}%</span>
            </span>
          </div>
        </div>
      )}

      <div style={{ width: "100%" }}>
        {renderStepComponent()}
      </div>
    </div>
  );
}

function App() {
  return (
    <FitProfileProvider>
      <AppContent />
    </FitProfileProvider>
  );
}

export default App;
