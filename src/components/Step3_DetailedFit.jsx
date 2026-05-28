// src/components/Step3_DetailedFit.jsx
import React, { useState } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Step3_DetailedFit() {
  const { profile, updateDetailedFit, setStep } = useFitProfile();
  const { bodyCharacteristics, preferredFit } = profile.detailedFit;
  const { measureMethod } = profile;

  // 정교한 경고 넛지 팝업 가동 상태
  const [showWarningModal, setShowWarningModal] = useState(false);

  const characteristicsList = [
    "어깨가 넓은 편",
    "어깨가 좁은 편",
    "팔이 긴 편",
    "팔이 짧은 편",
    "가슴이 넓은 편",
    "가슴이 좁은 편",
    "배가 나온 편",
    "허리가 긴 편"
  ];

  const fitStyles = [
    {
      id: "slim",
      label: "슬림핏",
      desc: "몸에 딱 붙는 타이트한 실루엣",
      emoji: "🕴️"
    },
    {
      id: "regular",
      label: "레귤러핏",
      desc: "몸 라인을 따라 흐르는 적당한 여유감",
      emoji: "👕"
    },
    {
      id: "over",
      label: "오버핏",
      desc: "스타일리시하고 넉넉한 루즈핏",
      emoji: "🧥"
    }
  ];

  const handleChipClick = (char) => {
    let updated;
    if (bodyCharacteristics.includes(char)) {
      updated = bodyCharacteristics.filter(item => item !== char);
    } else {
      updated = [...bodyCharacteristics, char];
    }
    updateDetailedFit({ bodyCharacteristics: updated });
  };

  // 선호 스타일 핏 토글 온/오프 가능
  const handleFitClick = (fitId) => {
    if (preferredFit === fitId) {
      updateDetailedFit({ preferredFit: "" });
    } else {
      updateDetailedFit({ preferredFit: fitId });
    }
  };

  const handleBack = () => {
    if (measureMethod === "direct") {
      setStep(2.1);
    } else if (measureMethod === "db") {
      setStep(2.2);
    } else {
      setStep(2);
    }
  };

  // 체형 특수사항(최소 1개)과 선호 스타일 핏이 둘 다 완벽히 기입되었는지 판별 (메인 버튼 필수화 조건)
  const isAnyOptionSelected = bodyCharacteristics.length > 0 && (preferredFit && preferredFit !== "");

  // 우측 메인 '설정 완료' 버튼 클릭 시 (활성화된 상태에서만 눌림)
  const handleNext = () => {
    if (isAnyOptionSelected) {
      setStep(4); // 바로 정상 완료 이행!
    }
  };

  // "선택하지 않고 넘어가기" 클릭 시 팝업을 띄우는 새로운 기획 반영!
  const handleSkipDetailed = (e) => {
    e.preventDefault();
    setShowWarningModal(true); // 경고 팝업 가동하여 넛지!
  };

  // 팝업 제어 기능들
  const handleKeepSetting = () => {
    setShowWarningModal(false); // 팝업 닫고 마저 설정하기
  };

  const handleForceComplete = () => {
    setShowWarningModal(false);
    // 선택 사항을 명확히 공백화해주고 다음 설정완료로 강제 전입!
    updateDetailedFit({ bodyCharacteristics: [], preferredFit: "" });
    setStep(4);
  };

  const getPreferredFitKo = (id) => {
    if (id === "slim") return "슬림핏";
    if (id === "over") return "오버핏";
    if (id === "regular") return "레귤러핏";
    return "선택 없음";
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "650px", margin: "0 auto", paddingBottom: "110px" }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          상세 체형 및 선호 핏
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          해당하는 항목을 선택해 주시면 더 정밀하게 비교 분석해 드려요! (선택 사항)
        </p>
      </div>

      {/* 체형 특이사항 멀티 칩 */}
      <div className="glass-card" style={{ padding: "28px", marginBottom: "24px", textAlign: "left" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
          체형 특이사항 (복수 선택 가능)
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {characteristicsList.map((char) => {
            const isSelected = bodyCharacteristics.includes(char);
            return (
              <button
                key={char}
                onClick={() => handleChipClick(char)}
                style={{
                  background: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                  color: isSelected ? "#09090b" : "var(--text-secondary)",
                  border: `1.5px solid ${isSelected ? "#ffffff" : "var(--border-color)"}`,
                  borderRadius: "50px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? "0 4px 12px rgba(255, 255, 255, 0.12)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선호 스타일 */}
      <div className="glass-card" style={{ padding: "28px", textAlign: "left" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
          선호하는 스타일 핏 (단일 선택)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {fitStyles.map((fit) => {
            const isSelected = preferredFit === fit.id;
            return (
              <div
                key={fit.id}
                onClick={() => handleFitClick(fit.id)}
                style={{
                  background: isSelected ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.02)",
                  border: `1.5px solid ${isSelected ? "#ffffff" : "var(--border-color)"}`,
                  borderRadius: "12px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? "0 4px 15px rgba(255, 255, 255, 0.08)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <div style={{ fontSize: "28px" }}>{fit.emoji}</div>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#ffffff" }}>
                    {fit.label}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                    {fit.desc}
                  </p>
                </div>
                <div style={{ marginLeft: "auto", minWidth: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {isSelected && (
                    <span style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "20px",
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
            );
          })}
        </div>

        {/* 하단 버튼군 (최소 선택되지 않으면 '설정 완료' 활성 잠금 처리) */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button
            className="btn-secondary"
            onClick={handleBack}
            style={{ flex: 1, padding: "16px", borderRadius: "12px", fontWeight: "700" }}
          >
            이전 단계
          </button>
          <button
            disabled={!isAnyOptionSelected}
            onClick={handleNext}
            style={{
              flex: 2,
              padding: "16px",
              borderRadius: "12px",
              fontWeight: "800",
              background: isAnyOptionSelected ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
              color: isAnyOptionSelected ? "#09090b" : "rgba(255, 255, 255, 0.2)",
              border: isAnyOptionSelected ? "1.5px solid #ffffff" : "1.5px solid rgba(255, 255, 255, 0.05)",
              boxShadow: isAnyOptionSelected ? "0 4px 15px rgba(255, 255, 255, 0.15)" : "none",
              cursor: isAnyOptionSelected ? "pointer" : "not-allowed",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            설정 완료
          </button>
        </div>

        {/* 선택하지 않고 넘어가기 비상탈출구 추가 (클릭 시 팝업 가동) */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a
            href="#skip-detailed"
            onClick={handleSkipDetailed}
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14.4px",
              fontWeight: "700",
              textDecoration: "underline",
              transition: "all 0.25s"
            }}
            onMouseEnter={(e) => e.target.style.color = "#ffffff"}
            onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.4)"}
          >
            선택하지 않고 넘어가기
          </a>
        </div>
      </div>

      {/* 하단 플로팅 실시간 요약 바 */}
      <div style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        background: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-color)",
        padding: "16px 24px",
        zIndex: 90,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          maxWidth: "650px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "13px"
        }}>
          <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)", textAlign: "left" }}>
            <div>
              <span style={{ color: "var(--text-muted)" }}>선택된 체형: </span>
              <span style={{ color: "#ffffff", fontWeight: "600" }}>
                {bodyCharacteristics.length > 0 ? bodyCharacteristics.join(", ") : "선택 없음"}
              </span>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "16px" }}>
              <span style={{ color: "var(--text-muted)" }}>선호 핏: </span>
              <span style={{ color: "#ffffff", fontWeight: "600" }}>
                {getPreferredFitKo(preferredFit)}
              </span>
            </div>
          </div>
          <span style={{ color: "#ffffff", fontWeight: "700" }}>실시간 반영 중</span>
        </div>
      </div>

      {/* 영롱하고 몽환적인 유리 질감 경고 팝업 모달 */}
      {showWarningModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="glass-card" style={{
            maxWidth: "420px",
            width: "90%",
            padding: "32px 24px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(18, 18, 24, 0.95)",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            animation: "fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* 경고 알림 아이콘 데코 */}
            <div style={{
              width: "56px",
              height: "56px",
              background: "rgba(245, 158, 11, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              border: "1px solid rgba(245, 158, 11, 0.25)"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: "19px", fontWeight: "800", color: "#ffffff", marginBottom: "10px", letterSpacing: "-0.5px" }}>
              상세 체형이 설정되지 않았습니다
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
              체형 특이사항이나 선호 스타일 핏을 선택하지 않으시면 핏 분석 정확도가 다소 떨어질 수 있습니다.
            </p>

            {/* 조작권 선택 버튼군 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleKeepSetting}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                마저 설정하기
              </button>
              <button
                onClick={handleForceComplete}
                style={{
                  flex: 1.2,
                  padding: "14px",
                  background: "#ffffff",
                  border: "1.5px solid #ffffff",
                  borderRadius: "10px",
                  color: "#09090b",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
