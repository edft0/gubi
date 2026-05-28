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

      {/* 완공 마크 - 픽셀 체크 스타일 구현 (오직 v 글리프 단독 거대 투사 + 3D 픽셀 입체 섀도우) */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <span style={{
          fontSize: "80px", // 네모 상자가 빠졌으므로 거대하게 극대화!
          color: "#ffffff",
          fontFamily: "var(--font-pixel)",
          lineHeight: "1",
          userSelect: "none",
          textShadow: "6px 6px 0px #3f3f3f" // 👾 캡처와 소름 돋게 똑같은 8비트 입체 픽셀 그림자 완벽 매칭!
        }}>
          v
        </span>
      </div>

      {/* 성공 타이틀 (픽셀 톤앤매너 싱크 및 띄어쓰기 박멸!) */}
      <h2 style={{
        fontSize: "24px",
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: "12px",
        letterSpacing: "1px",
        fontFamily: "var(--font-pixel)"
      }}>
        succeeded!
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", marginBottom: "36px", fontWeight: "600" }}>
        이제 모든 상품 페이지에서 자동으로 내 체형과 핏을 비교해 드려요.
      </p>

      {/* 📊 핏 정확도 게이지 박스 (지저분한 보라색/보라바 싹 지우고 "블랙앤화이트" 라인아트로 세공!) */}
      <div className="glass-card" style={{
        padding: "20px 24px",
        marginBottom: "32px",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        textAlign: "left"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.5px" }}>
            ◆ 핏 분석 정확도
          </span>
          <span style={{ fontSize: "15px", fontWeight: "900", color: "#ffffff", fontFamily: "var(--font-pixel)" }}>
            {accuracy}%
          </span>
        </div>

        {/* 정확도 바 (솔리드 화이트 게이지 충전 바!) */}
        <div style={{
          height: "8px",
          background: "rgba(255, 255, 255, 0.06)",
          borderRadius: "0px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.15)"
        }}>
          <div style={{
            height: "100%",
            width: gaugeWidth,
            background: "#ffffff", // 보라색 삭제하고 오직 순백색 솔리드로 100% 채움!
            borderRadius: "0px",
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
          }}></div>
        </div>
        <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5", fontWeight: "600" }}>
          설정이 완료되었습니다! 저장된 핏 프로필을 기반으로 맞춤 사이즈 상품 매칭이 바로 시작됩니다.
        </p>
      </div>

      {/* 내 기준 정보 요약 카드 (역라우팅 지원) */}
      <div style={{ textAlign: "left", marginBottom: "36px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "800", marginBottom: "12px", paddingLeft: "4px", letterSpacing: "0.5px" }}>
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
              alignItems: "center",
              borderRadius: "8px",
              border: "1.5px solid rgba(255, 255, 255, 0.07)",
              transition: "all 0.2s ease-in-out"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", fontWeight: "700", marginBottom: "4px" }}>기본 신체 정보</span>
              <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                {basicInfo.nickname ? `${basicInfo.nickname} / ` : ""}{basicInfo.gender}성 / {basicInfo.height}cm / {basicInfo.weight}kg / 평소 {basicInfo.usualSize}
              </span>
            </div>
            <span style={{ fontSize: "11.5px", color: "#ffffff", fontWeight: "800" }}>EDIT ➡️</span>
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
              alignItems: "center",
              borderRadius: "8px",
              border: "1.5px solid rgba(255, 255, 255, 0.07)",
              transition: "all 0.2s ease-in-out"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", fontWeight: "700", marginBottom: "4px" }}>비교 기준 의류</span>
              <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                {getClothesSummary()}
              </span>
            </div>
            <span style={{ fontSize: "11.5px", color: "#ffffff", fontWeight: "800" }}>EDIT ➡️</span>
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
              alignItems: "center",
              borderRadius: "8px",
              border: "1.5px solid rgba(255, 255, 255, 0.07)",
              transition: "all 0.2s ease-in-out"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", fontWeight: "700", marginBottom: "4px" }}>세부 체형 및 스타일</span>
              <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                체형: {detailedFit.bodyCharacteristics.length > 0 ? detailedFit.bodyCharacteristics.join(", ") : "특이사항 없음"}
                <br />
                선호 핏: {getPreferredFitKo(detailedFit.preferredFit)}
              </span>
            </div>
            <span style={{ fontSize: "11.5px", color: "#ffffff", fontWeight: "800" }}>EDIT ➡️</span>
          </div>
        </div>
      </div>

      {/* 완료 메인 대시보드 진입 버튼 (블랙앤화이트 글로우 디자인) */}
      <button
        onClick={() => {
          saveUserToVirtualDB(); // 핏 최종 설정을 마칠 때 가상 메모리 DB에 가입 정보 적재!
          setStep("dashboard");
        }}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "900",
          background: "#ffffff",
          color: "#000000",
          border: "2px solid #ffffff",
          boxShadow: "0 8px 24px rgba(255, 255, 255, 0.15)",
          borderRadius: "0px", // 시크하고 단호한 각진 픽셀 프레임 버튼
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          fontFamily: "var(--font-pixel)",
          letterSpacing: "1px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#000000";
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 255, 255, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.color = "#000000";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 255, 255, 0.15)";
        }}
      >
        START ↩
      </button>
    </div>
  );
}
