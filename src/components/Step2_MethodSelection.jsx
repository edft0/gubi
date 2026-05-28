// src/components/Step2_MethodSelection.jsx
import React from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Step2_MethodSelection() {
  const { profile, setMeasureMethod, setStep } = useFitProfile();
  const { measureMethod } = profile;

  const handleNext = () => {
    if (measureMethod === "direct") {
      setStep(2.1); // 직접 입력 화면으로 스무스하게 이동
    } else if (measureMethod === "db") {
      setStep(2.2); // DB 아이템 선택 화면으로 스무스하게 이동
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {/* 헤더 - 이모지 제거 */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          실측 측정 방법을 선택해주세요
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          세컨핸드 특성상 옷마다 실측이 달라요. 내 기준을 먼저 세워보세요!
        </p>
      </div>

      {/* 두 가지 카드 분기 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 직접 입력 카드 */}
        <div
          onClick={() => setMeasureMethod("direct")}
          className="glass-card"
          style={{
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            cursor: "pointer",
            border: `1.5px solid ${measureMethod === "direct" ? "#ffffff" : "var(--glass-border)"}`,
            boxShadow: measureMethod === "direct" ? "0 4px 15px rgba(255, 255, 255, 0.08)" : "none",
            transform: measureMethod === "direct" ? "scale(1.01)" : "none",
            transition: "all 0.25s ease-in-out",
            textAlign: "left"
          }}
          onMouseEnter={(e) => {
            if (measureMethod !== "direct") e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            if (measureMethod !== "direct") e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            {/* 눈금자 일러스트 가로 자 SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }}>
              <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
              <path d="M19 13v4" />
              <path d="M15 13v4" />
              <path d="M11 13v4" />
              <path d="M7 13v4" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>
              내 사이즈 직접 입력하기(추천)
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.4" }}>
              내 사이즈를 직접 입력합니다. 가장 정밀한 비교가 가능해요!
            </p>
          </div>
          <div style={{ marginLeft: "auto", minWidth: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {measureMethod === "direct" && (
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "22px",
                color: "#ffffff",
                lineHeight: "1",
                userSelect: "none",
                textShadow: "2.5px 2.5px 0px #3f3f3f" // 👾 3D 입체 픽셀 그림자 완벽 동기화!
              }}>
                v
              </span>
            )}
          </div>
        </div>

        {/* DB 아이템 선택 카드 */}
        <div
          onClick={() => setMeasureMethod("db")}
          className="glass-card"
          style={{
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            cursor: "pointer",
            border: `1.5px solid ${measureMethod === "db" ? "#ffffff" : "var(--glass-border)"}`,
            boxShadow: measureMethod === "db" ? "0 4px 15px rgba(255, 255, 255, 0.08)" : "none",
            transform: measureMethod === "db" ? "scale(1.01)" : "none",
            transition: "all 0.25s ease-in-out",
            textAlign: "left"
          }}
          onMouseEnter={(e) => {
            if (measureMethod !== "db") e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            if (measureMethod !== "db") e.currentTarget.style.borderColor = "var(--glass-border)";
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }}>
              <path d="M20.38 3.46 16 1.15a2 2 0 0 0-2 0L3.5 6.65a2 2 0 0 0-1 1.72v10.3a2 2 0 0 0 1 1.72L12 22.85a2 2 0 0 0 2 0l8.5-5a2 2 0 0 0 1-1.72V8.37a2 2 0 0 0-1-1.72l-2.12-1.25" />
              <path d="M12 22V12" />
              <path d="M12 12 3 7" />
              <path d="M12 12l9-5" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>
              DB 의류 선택하기
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.4" }}>
              유니클로, 나이키, 무신사 스탠다드 등 대중적인 브랜드의 잘 맞던 스테디셀러 아이템과 사이즈를 골라 기준으로 삼습니다.
            </p>
          </div>
          <div style={{ marginLeft: "auto", minWidth: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {measureMethod === "db" && (
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "22px",
                color: "#ffffff",
                lineHeight: "1",
                userSelect: "none",
                textShadow: "2.5px 2.5px 0px #3f3f3f" // 👾 3D 입체 픽셀 그림자 완벽 동기화!
              }}>
                v
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 이전 / 다음 버튼 - 일괄 ffffff 배경 및 텍스트 아이콘 제거 */}
      <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
        <button
          className="btn-secondary"
          onClick={() => setStep(1)}
          style={{ flex: 1, padding: "16px", borderRadius: "12px", fontWeight: "700" }}
        >
          이전으로
        </button>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!measureMethod}
          style={{
            flex: 2,
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "800",
            background: "#ffffff",
            color: "#09090b",
            border: "1.5px solid #ffffff",
            boxShadow: "0 4px 15px rgba(255, 255, 255, 0.15)",
            cursor: measureMethod ? "pointer" : "not-allowed",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: measureMethod ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (measureMethod) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            if (measureMethod) e.currentTarget.style.transform = "scale(1)";
          }}
        >
          선택한 방식으로 측정하기
        </button>
      </div>
    </div>
  );
}
