// src/components/Step2_2_DbSelection.jsx
import React, { useState, useEffect } from "react";
import { useFitProfile } from "../context/FitProfileContext";
import { CLOTHES_DB } from "../constants/clothesDB";

const DB_IMAGE_MAP = {
  // 티셔츠
  t1: "/t1.png",
  t2: "/t2.png",
  t3: "/t3.png",
  t4: "/t4.png",
  t5: "/t5.png",
  t6: "/t6.png",

  // 후드·맨투맨
  h1: "/h1.png",
  h2: "/h2.png",
  h3: "/h3.png",
  h4: "/h4.png",
  h5: "/h5.png",

  // 아우터
  o1: "/o1.png",
  o2: "/o2.png",
  o3: "/o3.png",
  o4: "/o4.png",
  o5: "/o5.png",
  o6: "/o6.png",
  o7: "/o7.png",
  o8: "/o8.png",

  // 팬츠
  p1: "/p1.png",
  p2: "/p2.png",
  p3: "/p3.png",
  p4: "/p4.png",
  p5: "/p5.png",
  p6: "/p6.png",
  p7: "/p7.png",
  p8: "/p8.png",
  p9: "/p9.png",
  p10: "/p10.png",
  p11: "/p11.png"
};

export default function Step2_2_DbSelection() {
  const { profile, updateDbMeasures, setStep, resetMeasures } = useFitProfile();
  const { directMeasures, dbMeasures } = profile;

  // 카테고리 순서 정의
  const tabSequence = ["tshirt", "hoodie", "outer", "pants"];

  // 1. 실측 및 DB 완료 상태 진단 헬퍼
  const isCategoryDirectFilled = (cat) => {
    const m = directMeasures[cat];
    if (cat === "pants") {
      return m.length > 0 && m.waist > 0 && m.hip > 0 && m.thigh > 0 && m.rise > 0 && m.hem > 0;
    }
    return m.length > 0 && m.shoulder > 0 && m.chest > 0 && m.sleeve > 0;
  };

  const isCategoryDbFilled = (cat) => {
    return dbMeasures && dbMeasures[cat] !== null && !dbMeasures[cat].isSkipped;
  };

  const isCategorySkipped = (cat) => {
    return dbMeasures && dbMeasures[cat] !== null && dbMeasures[cat].isSkipped === true;
  };

  // 사용자가 실측을 썼거나, DB를 골랐거나, "해당하는 옷이 없어요"를 선언했거나
  const isCategoryCompleted = (cat) => {
    return isCategoryDirectFilled(cat) || isCategoryDbFilled(cat) || isCategorySkipped(cat);
  };

  // 2. 초기 탭 선택 시, 어떤 조치(실측/DB/스킵)도 취해지지 않은 최초의 '빈 탭'을 찾아 매핑
  const [activeTab, setActiveTab] = useState(() => {
    const firstEmpty = tabSequence.find(cat => !isCategoryCompleted(cat));
    return firstEmpty || "tshirt";
  });

  // 카테고리별 브랜드 의류 아이템 조회
  const filteredItems = CLOTHES_DB.filter(item => item.category === activeTab);

  // 사이즈 칩 원클릭 자동 매핑 처리기 (토글 온/오프 포함)
  const handleSizeClick = (item, size) => {
    const currentlySelected = dbMeasures && dbMeasures[activeTab];
    const isAlreadyThisSize = currentlySelected && currentlySelected.id === item.id && currentlySelected.size === size;

    if (isAlreadyThisSize) {
      // 1. 이미 동일 브랜드의 동일 사이즈가 활성화되어 있는 상태에서 재클릭했다면 토글 오프(해제) 실행!
      updateDbMeasures(activeTab, null);
    } else {
      // 2. 다른 사이즈 선택 시 토글 온(선택 완료) 및 전진 진행!
      const measurements = item.measurements[size];

      updateDbMeasures(activeTab, {
        id: item.id,
        brand: item.brand,
        name: item.name,
        size: size,
        measurements: measurements,
        isSkipped: false
      });

      // 다음 빈 카테고리 탭이나 최종 완료 단계로 이행
      moveToNextTabOrStep();
    }
  };

  // 다음 탭 혹은 단계로 순차 전진
  const moveToNextTabOrStep = () => {
    const currentIndex = tabSequence.indexOf(activeTab);

    // 다음 탭들 중 의사 표시가 안 된 탭이 있는지 조회
    const nextEmptyTab = tabSequence.slice(currentIndex + 1).find(cat => !isCategoryCompleted(cat));

    if (nextEmptyTab) {
      setActiveTab(nextEmptyTab);
    } else {
      // 잔여 빈 탭 검출
      const residualEmptyTab = tabSequence.find(cat => !isCategoryCompleted(cat));
      if (residualEmptyTab) {
        setActiveTab(residualEmptyTab);
      } else {
        // 모든 범주가 채워지거나 스킵 표기가 마쳐졌다면 세부 체형 단계로 우아하게 이행!
        setStep(3);
      }
    }
  };

  // 해당하는 옷이 없어요 수동 스킵 액션 처리 (필수 요건 우회 출구)
  const handleNoClothes = (e) => {
    e.preventDefault();

    // 해당 카테고리는 스킵된 상태임을 더미 객체 형태로 각인시킴 (핏 분석 가점 대상에서 영리하게 배제)
    updateDbMeasures(activeTab, {
      id: "skipped_" + activeTab,
      brand: "없음",
      name: "해당하는 옷 없음",
      size: "없음",
      isSkipped: true
    });

    moveToNextTabOrStep();
  };

  // 이전 처리
  const handleBack = () => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabSequence[currentIndex - 1]);
    } else {
      resetMeasures(); // 측정 임시 내역 깔끔하게 소거!
      setStep(2); // 분기 선택 화면으로 회군
    }
  };

  // 모든 카테고리가 어떤 수단으로든 다 체크/기입 완료되었는지 판별 (체형 화면 진입 잠금 제어용)
  const isAllCategoriesActioned = tabSequence.every(cat => isCategoryCompleted(cat));

  // 실측 직접 입력에서 몇 개를 채우고 넘어왔는지 여부 판별
  const hasSomeDirectMeasures = tabSequence.some(cat => isCategoryDirectFilled(cat));

  return (
    <div className="animate-fade-in" style={{ maxWidth: "840px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          자주 입는 브랜드 옷을 골라주세요
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", lineHeight: "1.6" }}>
          {hasSomeDirectMeasures ? (
            <span style={{ color: "#ffffff", fontWeight: "700" }}>
              실측을 건너뛰신 범주들의 브랜드를 입력해 주시면 정교한 핏 비교가 지속됩니다.
            </span>
          ) : (
            "선택하신 브랜드 의류의 실측을 바탕으로 고객님의 체형 정확도를 완벽 산출해 드립니다."
          )}
        </p>
      </div>

      {/* 카테고리 탭 리스트 (입력 완료 / 해당 없음 표시 연동) */}
      <div style={{
        display: "flex",
        background: "rgba(0, 0, 0, 0.2)",
        borderRadius: "14px",
        padding: "6px",
        border: "1px solid var(--border-color)",
        marginBottom: "32px",
        maxWidth: "640px",
        margin: "0 auto 32px auto"
      }}>
        {tabSequence.map((tabId) => {
          const isSelected = activeTab === tabId;
          const directFilled = isCategoryDirectFilled(tabId);
          const dbFilled = isCategoryDbFilled(tabId);
          const skipped = isCategorySkipped(tabId);
          const label = tabId === "tshirt" ? "티셔츠" : tabId === "hoodie" ? "후드·맨투맨" : tabId === "outer" ? "아우터" : "팬츠";

          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              style={{
                flex: 1,
                padding: "12px 6px",
                border: "none",
                borderRadius: "10px",
                background: isSelected ? "#ffffff" : "transparent",
                color: isSelected ? "#09090b" : "var(--text-secondary)",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px"
              }}
            >
              <span>{label}</span>
              {directFilled && (
                <span style={{ fontSize: "10px", color: isSelected ? "#10b981" : "rgba(16, 185, 129, 0.75)", fontWeight: "800" }}>
                  입력 완료
                </span>
              )}
              {!directFilled && dbFilled && (
                <span style={{ fontSize: "10px", color: isSelected ? "#10b981" : "rgba(16, 185, 129, 0.75)", fontWeight: "800" }}>
                  입력 완료
                </span>
              )}
              {!directFilled && skipped && (
                <span style={{ fontSize: "10px", color: isSelected ? "#71717a" : "rgba(113, 113, 122, 0.75)", fontWeight: "800" }}>
                  해당 없음
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 의류 가이드 리스트 그리드 (사이즈 원클릭 버튼 상시 노출 버전 - 2열 콤팩트 최적화!) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", /* 2열 정밀 그리드 이식 */
        gap: "10px", /* 콤팩트 갭 조율 */
        marginBottom: "40px"
      }}>
        {filteredItems.map((item) => {
          const currentlySelected = dbMeasures && dbMeasures[activeTab];
          const isThisItemChosen = currentlySelected && currentlySelected.id === item.id;

          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                borderRadius: "14px", /* 콤팩트 곡률 */
                overflow: "hidden",
                border: `1.5px solid ${isThisItemChosen ? "#ffffff" : "var(--glass-border)"}`,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px 10px", /* 내부 여백 최적화 */
                textAlign: "center"
              }}
            >
              {/* 💡 [피드백 완벽 반영] 회원가입 DB 의류 실제 고해상도 이미지 데코 */}
              <div style={{
                height: "110px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                marginBottom: "12px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                overflow: "hidden"
              }}>
                <img
                  src={DB_IMAGE_MAP[item.id] || "/gubi_logo.png"}
                  alt={item.name}
                  style={{
                    height: "90%",
                    objectFit: "contain",
                    transition: "all 0.3s ease",
                    filter: isThisItemChosen ? "drop-shadow(0 4px 8px rgba(255, 255, 255, 0.15))" : "none"
                  }}
                />
                <span style={{
                  position: "absolute",
                  bottom: "4px",
                  left: "4px",
                  fontSize: "8.5px",
                  color: "#ffffff",
                  fontWeight: "900",
                  letterSpacing: "0.5px",
                  background: "rgba(0, 0, 0, 0.65)",
                  padding: "2px 6px",
                  borderRadius: "6px"
                }}>
                  {item.brand}
                </span>
              </div>

              {/* 옷 정보 (텍스트 오버플로우 높이 통일성 정밀 정합!) */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff", marginBottom: "2px", lineHeight: "1.4", height: "34px", overflow: "hidden" }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600" }}>
                    {activeTab === "tshirt" ? "티셔츠" : activeTab === "hoodie" ? "후드·맨투맨" : activeTab === "outer" ? "아우터" : "팬츠"}
                  </p>
                </div>
              </div>

              {/* 하이라이트: 사이즈 칩 버튼 상시 띄워두고 원클릭 자동 매핑 콤팩트 패키징 */}
              <div>
                <span style={{ display: "block", fontSize: "9px", color: "var(--text-muted)", fontWeight: "700", marginBottom: "6px" }}>
                  사이즈 클릭 즉시 매핑:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: "center" }}>
                  {item.availableSizes.map((size) => {
                    const isSizeActive = isThisItemChosen && currentlySelected.size === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeClick(item, size)}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "6px",
                          border: isSizeActive ? "1.5px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.15)",
                          background: isSizeActive ? "#ffffff" : "transparent",
                          color: isSizeActive ? "#09090b" : "#ffffff",
                          fontWeight: "800",
                          fontSize: "11px",
                          cursor: "pointer",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        onMouseEnter={(e) => {
                          if (!isSizeActive) {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSizeActive) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                          }
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 조작 버튼 영역 (4개 카테고리 전체 조치가 완수되기 전까지 체형 설정으로 가기 비활성 잠금 처리) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "400px" }}>
          <button
            className="btn-secondary"
            onClick={handleBack}
            style={{ flex: 1, padding: "16px", borderRadius: "12px", fontWeight: "700" }}
          >
            이전
          </button>
          <button
            disabled={!isAllCategoriesActioned}
            onClick={() => {
              if (isAllCategoriesActioned) {
                setStep(3);
              }
            }}
            style={{
              flex: 1.5,
              padding: "16px",
              borderRadius: "12px",
              fontWeight: "800",
              background: isAllCategoriesActioned ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
              color: isAllCategoriesActioned ? "#09090b" : "rgba(255, 255, 255, 0.2)",
              border: isAllCategoriesActioned ? "1.5px solid #ffffff" : "1.5px solid rgba(255, 255, 255, 0.05)",
              boxShadow: isAllCategoriesActioned ? "0 4px 15px rgba(255, 255, 255, 0.1)" : "none",
              cursor: isAllCategoriesActioned ? "pointer" : "not-allowed",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            세부 체형 설정으로
          </button>
        </div>

        {/* 하단 해당하는 옷이 없어요 예외 회피 출구 링크로 전면 교정 */}
        <div style={{ textAlign: "center" }}>
          <a
            href="#no-brand-clothes"
            onClick={handleNoClothes}
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "14px",
              fontWeight: "700",
              textDecoration: "underline",
              transition: "all 0.25s"
            }}
            onMouseEnter={(e) => e.target.style.color = "#ffffff"}
            onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.4)"}
          >
            해당하는 옷이 없어요
          </a>
        </div>
      </div>
    </div>
  );
}
