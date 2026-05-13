// src/components/Step4_Completion.jsx
import React, { useEffect, useState } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Step4_Completion() {
  const { profile, setStep, getFitAccuracy, saveUserToVirtualDB } = useFitProfile();
  const { basicInfo, measureMethod, directMeasure, dbMeasure, detailedFit } = profile;

  const accuracy = getFitAccuracy();
  const [gaugeWidth, setGaugeWidth] = useState("0%");

  useEffect(() => {
    // 마운트 후 전역 계산된 실시간 핏 분석 정확도 값(accuracy)만큼 게이지가 스무스하게 차오르는 팽창 애니메이션
    const timer = setTimeout(() => {
      setGaugeWidth(`${accuracy}%`);
    }, 150);
    return () => clearTimeout(timer);
  }, [accuracy]);

  // 선호핏 한글 변환
  const getPreferredFitKo = (id) => {
    if (id === "slim") return "슬림핏";
    if (id === "over") return "오버핏";
    return "레귤러핏";
  };

  // 기준 옷 표시 포맷팅
  const getClothesSummary = () => {
    if (measureMethod === "direct") {
      const { category, shoulder, chest, length, sleeve } = directMeasure;
      const catKo = category === "tshirt" ? "티셔츠" : category === "hoodie" ? "후드·맨투맨" : category === "outer" ? "아우터" : "팬츠";
      const isP = category === "pants";
      return `직접 입력 [${catKo}] (실측: ${isP ? '허리' : '어깨'} ${shoulder} / ${isP ? '허벅지' : '가슴'} ${chest} / 총장 ${length}cm)`;
    } else if (measureMethod === "db" && dbMeasure.selectedItem) {
      const { brand, name, size } = dbMeasure.selectedItem;
      return `${brand} ${name} — ${size} 사이즈`;
    }
    return "설정된 기준 옷 없음";
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "550px", margin: "0 auto", textAlign: "center" }}>
      {/* 완공 마크 & 컨페티 연출 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
          border: "2px solid rgba(168, 85, 247, 0.4)",
          borderRadius: "50%",
          width: "90px",
          height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(168, 85, 247, 0.3)",
          position: "relative"
        }}>
          {/* 체크 SVG 애니메이션 */}
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="url(#completedGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <polyline points="20 6 9 17 4 12" style={{
              strokeDasharray: 50,
              strokeDashoffset: 50,
              animation: "checkmark 0.8s ease-in-out forwards 0.2s"
            }}/>
          </svg>
        </div>
      </div>

      {/* 성공 타이틀 */}
      <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
        핏 기준이 설정됐어요! 🎉
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "36px" }}>
        이제 모든 상품 페이지에서 자동으로 내 체형과 핏을 비교해 드려요.
      </p>

      {/* 핏 정확도 실시간 연동 게이지 박스 (요청에 따라 '온보딩 완료!' 문구 전격 삭제 및 실시간 정확도 일치화) */}
      <div className="glass-card" style={{
        padding: "20px 24px",
        marginBottom: "32px",
        background: "rgba(168, 85, 247, 0.05)",
        border: "1px solid rgba(168, 85, 247, 0.2)",
        borderRadius: "16px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
            ✨ 핏 분석 정확도
          </span>
          <span style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>
            {accuracy}%
          </span>
        </div>
        
        {/* 정확도 바 */}
        <div style={{
          height: "8px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: gaugeWidth,
            background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
            borderRadius: "10px",
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
          }}></div>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "10px", textAlign: "left" }}>
          설정이 완료되었습니다! 저장된 핏 프로필을 기반으로 맞춤 사이즈 상품 매칭이 바로 시작됩니다.
        </p>
      </div>

      {/* 내 기준 정보 요약 카드 (역라우팅 지원) */}
      <div style={{ textAlign: "left", marginBottom: "36px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "10px", paddingLeft: "4px" }}>
          내 핏 프로필 요약 (클릭 시 즉시 수정 가능)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* 1. 신체 정보 */}
          <div
            onClick={() => setStep(1)}
            className="glass-card"
            style={{
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>기본 신체 정보</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>
                {basicInfo.nickname ? `${basicInfo.nickname} / ` : ""}{basicInfo.gender}성 / {basicInfo.height}cm / {basicInfo.weight}kg / 평소 {basicInfo.usualSize}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "500" }}>수정 ➡️</span>
          </div>

          {/* 2. 기준 옷 */}
          <div
            onClick={() => {
              if (measureMethod === "direct") setStep(2.1);
              else if (measureMethod === "db") setStep(2.2);
              else setStep(2);
            }}
            className="glass-card"
            style={{
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>비교 기준 의류</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>
                {getClothesSummary()}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "500" }}>수정 ➡️</span>
          </div>

          {/* 3. 체형 및 선호 핏 */}
          <div
            onClick={() => setStep(3)}
            className="glass-card"
            style={{
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--glass-border)"}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>세부 체형 및 스타일</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>
                체형: {detailedFit.bodyCharacteristics.length > 0 ? detailedFit.bodyCharacteristics.join(", ") : "특이사항 없음"}
                <br />
                선호 핏: {getPreferredFitKo(detailedFit.preferredFit)}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "500" }}>수정 ➡️</span>
          </div>
        </div>
      </div>

      {/* 완료 메인 대시보드 진입 버튼 */}
      <button
        className="btn-primary"
        onClick={() => {
          saveUserToVirtualDB(); // 핏 최종 설정을 마칠 때 가상 메모리 DB에 가입 정보 적재!
          setStep("dashboard");
        }}
        style={{
          width: "100%",
          padding: "18px",
          fontSize: "18px",
          fontWeight: "800",
          background: "#ffffff",
          color: "#09090b",
          border: "1.5px solid #ffffff",
          boxShadow: "0 10px 25px rgba(255, 255, 255, 0.12)",
          animation: "pulse-glow 3s infinite",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(255, 255, 255, 0.12)";
        }}
      >
        내 핏에 맞는 상품 탐색하기
      </button>
    </div>
  );
}
