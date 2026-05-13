// src/components/Dashboard_Main.jsx
import React, { useState } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Dashboard_Main() {
  const { profile, logout } = useFitProfile();
  const { basicInfo, measureMethod, directMeasure, dbMeasure, detailedFit } = profile;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOnlyMyFit, setShowOnlyMyFit] = useState(false);
  
  // 1. 특정 상품의 뱃지 위에 마우스 호버(Hover) 시에만 말풍선을 띄우기 위한 상태 지정
  const [hoveredBadgeProductId, setHoveredBadgeProductId] = useState(null);

  const productList = [
    {
      id: "prod1",
      brand: "Carhartt WIP",
      name: "디트로이트 오가닉 오리 워크 자켓 (Vintage)",
      category: "outer",
      price: "189,000",
      size: "XL",
      likes: 47,
      imageColor: "#1a1a1e",
      measurements: { shoulder: 51, chest: 60, length: 69, sleeve: 63 }
    },
    {
      id: "prod2",
      brand: "Stussy",
      name: "World Tour Tee Black",
      category: "tshirt",
      price: "62,000",
      size: "L",
      likes: 23,
      imageColor: "#131316",
      measurements: { shoulder: 48, chest: 53, length: 73, sleeve: 22 }
    },
    {
      id: "prod3",
      brand: "Champion",
      name: "Reverse Weave Tee Navy",
      category: "tshirt",
      price: "45,000",
      size: "M",
      likes: 8,
      imageColor: "#141418",
      measurements: { shoulder: 40, chest: 31, length: 101, sleeve: 28 }
    },
    {
      id: "prod4",
      brand: "Palace",
      name: "Tri-Ferg Logo Tee White",
      category: "tshirt",
      price: "89,000",
      size: "L",
      likes: 31,
      imageColor: "#16161a",
      measurements: { shoulder: 49, chest: 57, length: 71, sleeve: 64 }
    },
    {
      id: "prod5",
      brand: "Nike",
      name: "헤리티지 오버핏 플리스 후디 (Grey)",
      category: "hoodie",
      price: "85,000",
      size: "L",
      likes: 19,
      imageColor: "#18181c",
      measurements: { shoulder: 52, chest: 61, length: 68, sleeve: 62 }
    },
    {
      id: "prod6",
      brand: "Y-3",
      name: "요지 야마모토 세미 와이드 코튼 카고 팬츠",
      category: "pants",
      price: "340,000",
      size: "S",
      likes: 54,
      imageColor: "#111113",
      measurements: { shoulder: 42, chest: 33, length: 103, sleeve: 30 }
    }
  ];

  // 유저의 동적 치수 산출 헬퍼
  const getUserMeasurements = (prodCategory) => {
    const userHeight = Number(basicInfo?.height) || 175;
    const userWeight = Number(basicInfo?.weight) || 70;

    if (measureMethod === "direct" && directMeasure) {
      if (directMeasure.category === prodCategory) {
        return {
          shoulder: Number(directMeasure.shoulder) || 48,
          chest: Number(directMeasure.chest) || 54,
          length: Number(directMeasure.length) || 71,
          sleeve: Number(directMeasure.sleeve) || 0
        };
      }
    } else if (measureMethod === "db" && dbMeasure && dbMeasure.selectedItem) {
      if (dbMeasure.category === prodCategory) {
        return dbMeasure.selectedItem.measurements || { shoulder: 48, chest: 54, length: 71, sleeve: 61 };
      }
    }

    const heightFactor = userHeight / 175;
    const weightFactor = userWeight / 70;
    
    if (prodCategory === "pants") {
      return {
        shoulder: Math.round(39 * heightFactor) || 39,
        chest: Math.round(32 * weightFactor) || 32,
        length: Math.round(100 * heightFactor) || 100,
        sleeve: Math.round(29 * heightFactor) || 29
      };
    }
    
    return {
      shoulder: Math.round(48 * heightFactor) || 48,
      chest: Math.round(54 * weightFactor) || 54,
      length: Math.round(71 * heightFactor) || 71,
      sleeve: Math.round(61 * heightFactor) || 61
    };
  };

  const getProductMaxDiff = (product) => {
    const userMeasures = getUserMeasurements(product.category);
    const prodMeasures = product.measurements;
    const isP = product.category === "pants";

    const fields = [
      { key: "shoulder" },
      { key: "chest" },
      { key: "length" },
      { key: "sleeve" }
    ];

    let maxDiff = 0;
    let worstFieldLabel = "";

    fields.forEach(field => {
      const userVal = userMeasures[field.key] || 0;
      const prodVal = prodMeasures[field.key] || 0;
      const diff = Math.abs(prodVal - userVal);
      if (diff > maxDiff) {
        maxDiff = diff;
        worstFieldLabel = field.key === "shoulder" ? (isP ? "허리" : "어깨")
                       : field.key === "chest" ? (isP ? "허벅지" : "가슴")
                       : field.key === "length" ? "총장" : (isP ? "밑위" : "소매");
      }
    });

    return { maxDiff, worstFieldLabel };
  };

  const getFitBadge = (product) => {
    const { maxDiff, worstFieldLabel } = getProductMaxDiff(product);
    const threshold = 4.5; 

    if (maxDiff > threshold) {
      const isRedAlert = worstFieldLabel === "총장" || worstFieldLabel === "허리" || worstFieldLabel === "허벅지";
      return {
        text: `${worstFieldLabel} 주의`,
        bg: isRedAlert ? "rgba(239, 68, 68, 0.16)" : "rgba(245, 158, 11, 0.16)",
        color: isRedAlert ? "#f87171" : "#fbbf24",
        border: `1px solid ${isRedAlert ? "rgba(239, 68, 68, 0.35)" : "rgba(245, 158, 11, 0.35)"}`,
        dot: isRedAlert ? "#ef4444" : "#f59e0b"
      };
    }

    return null;
  };

  // 등급 체제 매핑
  const getFitGrade = (product) => {
    const { maxDiff } = getProductMaxDiff(product);

    if (maxDiff <= 2.2) {
      return { 
        grade: "S+ 등급", 
        color: "#ffffff", 
        bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
        borderColor: "#34d399",
        shadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
      };
    }
    if (maxDiff <= 3.5) {
      return { 
        grade: "S 등급", 
        color: "#111111", 
        bg: "linear-gradient(135deg, #facc15 0%, #eab308 100%)", 
        borderColor: "#fde047",
        shadow: "0 2px 8px rgba(234, 179, 8, 0.4)"
      };
    }
    if (maxDiff <= 4.5) {
      return { 
        grade: "A+ 등급", 
        color: "#ffffff", 
        bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
        borderColor: "#60a5fa",
        shadow: "0 2px 8px rgba(59, 130, 246, 0.3)"
      };
    }
    if (maxDiff <= 6.0) {
      return { 
        grade: "A 등급", 
        color: "#ffffff", 
        bg: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", 
        borderColor: "#93c5fd",
        shadow: "0 2px 6px rgba(96, 165, 250, 0.25)"
      };
    }
    return { 
      grade: "B 등급", 
      color: "rgba(255, 255, 255, 0.8)", 
      bg: "rgba(255, 255, 255, 0.1)", 
      borderColor: "rgba(255, 255, 255, 0.15)",
      shadow: "none"
    };
  };

  const getComparison = (product) => {
    const userMeasures = getUserMeasurements(product.category);
    const prodMeasures = product.measurements;

    return {
      shoulderDiff: prodMeasures.shoulder - userMeasures.shoulder,
      chestDiff: prodMeasures.chest - userMeasures.chest,
      lengthDiff: prodMeasures.length - userMeasures.length
    };
  };

  const getPreferredFitKo = (id) => {
    if (id === "slim") return "슬림핏";
    if (id === "over") return "오버핏";
    return "레귤러핏";
  };

  const displayedProducts = productList.filter(product => {
    if (!showOnlyMyFit) return true;
    const badge = getFitBadge(product);
    return badge === null; 
  });

  return (
    <div className="animate-fade-in" style={{ padding: "10px 0" }}>
      {/* 마켓 헤더 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "16px"
      }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "1px", margin: 0 }}>GUBI MARKET</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {basicInfo?.nickname ? `${basicInfo.nickname}님` : "추천"} · {basicInfo?.gender || "남"}성 · {basicInfo?.height || 175}cm · {basicInfo?.weight || 70}kg 추천 핏 가동 중
          </p>
        </div>
        
        <button
          onClick={logout}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "8px" }}
        >
          로그아웃 ↩️
        </button>
      </div>

      {/* 서브 타이틀 및 필터 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "28px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: "0 0 4px 0" }}>
            초개인화 사이즈 추천 상품
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            사용자님이 입력하신 핏 프로필 및 기준 옷 대비 부위별 핏 일치도를 계산한 추천 리스트입니다.
          </p>
        </div>

        {/* 내 핏만 보기 온오프 스위치 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "8px 16px",
          borderRadius: "14px"
        }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: showOnlyMyFit ? "#ffffff" : "var(--text-secondary)", transition: "color 0.2s" }}>
            내 핏만 보기 ⚡
          </span>
          <button
            onClick={() => setShowOnlyMyFit(!showOnlyMyFit)}
            style={{
              width: "50px",
              height: "26px",
              borderRadius: "50px",
              background: showOnlyMyFit ? "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)" : "rgba(255, 255, 255, 0.12)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: 0,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: showOnlyMyFit ? "0 0 10px rgba(168, 85, 247, 0.3)" : "none"
            }}
          >
            <span style={{
              position: "absolute",
              top: "3px",
              left: showOnlyMyFit ? "27px" : "3px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#ffffff",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)"
            }} />
          </button>
        </div>
      </div>

      {/* 상품 2열 정밀 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "48px"
      }}>
        {displayedProducts.map((product) => {
          const comp = getComparison(product);
          const badge = getFitBadge(product);
          const gradeInfo = getFitGrade(product);
          
          const isBadgeHovered = hoveredBadgeProductId === product.id;
          
          return (
            <div
              key={product.id}
              className="glass-card"
              style={{
                borderRadius: "18px",
                overflow: "visible", 
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--glass-border)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onClick={() => setSelectedProduct(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.transform = "translateY(0)";
                setHoveredBadgeProductId(null); 
              }}
            >
              {/* 이미지 썸네일 영역 */}
              <div style={{
                height: "200px",
                background: product.imageColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRadius: "18px 18px 0 0",
                overflow: "visible" 
              }}>
                
                {/* 뱃지 */}
                {badge && (
                  <div 
                    onMouseEnter={(e) => {
                      e.stopPropagation(); 
                      setHoveredBadgeProductId(product.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredBadgeProductId(null);
                    }}
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: badge.bg,
                      backdropFilter: "blur(4px)",
                      border: badge.border,
                      borderRadius: "50px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: badge.color,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      zIndex: 30, 
                      cursor: "help"
                    }}
                  >
                    <span style={{
                      width: "5.5px",
                      height: "5.5px",
                      borderRadius: "50%",
                      background: badge.dot,
                      display: "inline-block"
                    }}></span>
                    {badge.text}
                  </div>
                )}

                {/* ⭐ 핵심: 군더더기 캡션과 버튼을 전량 소멸시키고, 오직 아름답고 선명한 2번 청바지 실루엣 분석 아트워크 액자 '그 자체만' 말풍선에 담아 띄우는 프리미엄 미학 패키징! */}
                {badge && isBadgeHovered && (
                  <div style={{
                    position: "absolute",
                    top: "44px", 
                    left: "12px",
                    width: "190px", // 텍스트 제거에 부합하도록 가로 너비 콤팩트 다이어트 단행
                    background: "rgba(11, 11, 14, 0.99)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    padding: "12px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.9)",
                    zIndex: 50,
                    cursor: "default"
                  }}
                  onClick={(e) => e.stopPropagation()} 
                  >
                    {/* 말풍선 삼각형 꼬리표 장식 */}
                    <div style={{
                      position: "absolute",
                      top: "-6px",
                      left: "24px",
                      width: "10px",
                      height: "10px",
                      background: "rgba(11, 11, 14, 0.99)",
                      borderTop: "1px solid rgba(255,255,255,0.15)",
                      borderLeft: "1px solid rgba(255,255,255,0.15)",
                      transform: "rotate(45deg)"
                    }} />

                    {/* 오직 청바지 실루엣 엑스레이 아트워크 사진 하나만 액자 형태로 정갈 배치 */}
                    <div style={{
                      position: "relative",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#08080a",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.04)",
                      overflow: "hidden"
                    }}>
                      {/* 미세 그리드 배경 */}
                      <div style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "8px 8px"
                      }} />

                      {/* 2번 사진 속 오리지널 바지 실루엣 형상을 완벽 렌더링하는 고정밀 SVG */}
                      <svg width="110" height="140" viewBox="0 0 100 130" style={{ display: "block" }}>
                        {/* 1. 파란색 기준 외곽선 */}
                        <path 
                          d="M 32 10 C 44 9, 56 9, 68 10 C 74 25, 82 45, 86 70 C 83 95, 78 115, 74 125 L 60 125 C 61 105, 56 75, 50 75 C 44 75, 39 105, 40 125 L 26 125 C 22 115, 17 95, 14 70 C 18 45, 26 25, 32 10 Z" 
                          fill="rgba(59, 130, 246, 0.15)" 
                          stroke="#3b82f6" 
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }}
                        />

                        {/* 2. 빨간색 체형 외곽선 */}
                        <path 
                          d="M 33 12 C 43 11, 57 11, 67 12 C 71 27, 78 47, 81 72 C 77 94, 73 112, 70 123 L 58 123 C 59 103, 54 77, 50 77 C 46 77, 41 103, 42 123 L 30 123 C 27 112, 23 94, 19 72 C 22 47, 29 27, 33 12 Z" 
                          fill="rgba(239, 68, 68, 0.1)" 
                          stroke="#ef4444" 
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: "drop-shadow(0 0 4px #ef4444)" }}
                        />

                        {/* 3. 초록색 바지 실루엣 바디 (2번 사진 싱크로율 100%!) */}
                        <path 
                          d="M 34 14 C 42 13, 58 13, 66 14 C 69 29, 74 49, 76 74 C 72 93, 69 110, 67 121 L 56 121 C 57 101, 53 79, 50 79 C 47 79, 43 101, 44 121 L 33 121 C 31 110, 28 93, 24 74 C 26 49, 31 29, 34 14 Z" 
                          fill="rgba(16, 185, 129, 0.52)" 
                          stroke="#10b981" 
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ filter: "drop-shadow(0 0 5px #10b981)" }}
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 우측 하단 찜 수량 데코 */}
                <div style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  background: "rgba(10, 10, 10, 0.5)",
                  backdropFilter: "blur(2.5px)",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  gap: "3.5px",
                  zIndex: 5
                }}>
                  ♡ {product.likes}
                </div>

                {/* 기본 제품 큐브 아이콘 */}
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" style={{ zIndex: 1 }}>
                  <path d="M20.38 3.46 16 1.15a2 2 0 0 0-2 0L3.5 6.65a2 2 0 0 0-1 1.72v10.3a2 2 0 0 0 1 1.72L12 22.85a2 2 0 0 0 2 0l8.5-5a2 2 0 0 0 1-1.72V8.37a2 2 0 0 0-1-1.72l-2.12-1.25"/>
                </svg>
              </div>

              {/* 텍스트 메타 정보 영역 */}
              <div style={{ padding: "18px", textAlign: "left", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>{product.brand}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "800" }}>{product.size}</span>
                </div>
                
                <h3 style={{ fontSize: "14.5px", color: "#ffffff", fontWeight: "600", margin: "4px 0 8px 0", height: "42px", overflow: "hidden" }}>
                  {product.name}
                </h3>
                
                <p style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
                  {product.price} 원
                </p>

                {/* '등급' 으로 심플 표시 */}
                <div style={{
                  marginTop: "auto",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700" }}>
                    등급
                  </span>
                  
                  {/* 사이즈 S와 헷갈리지 않는 전용 캡슐 칩 뱃지 */}
                  <span style={{
                    background: gradeInfo.bg,
                    border: `1px solid ${gradeInfo.borderColor}`,
                    color: gradeInfo.color,
                    padding: "5px 12px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    boxShadow: gradeInfo.shadow,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                  }}>
                    {gradeInfo.grade}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 실측 보고서 팝업창 (기존 차이 비교는 여기서 온전히 조회가 가능!) */}
      {selectedProduct && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: "20px"
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: "500px",
            width: "100%",
            padding: "32px",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ color: "var(--primary)", fontWeight: "700", fontSize: "12px", letterSpacing: "1px" }}>GUBI SMART COMPARE</span>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: "28px",
                  cursor: "pointer",
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", margin: "0 0 4px 0" }}>
              {selectedProduct.brand} {selectedProduct.name}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
              선택하신 맞춤 체형 가이드 및 선호하는 {getPreferredFitKo(detailedFit?.preferredFit)} 기준으로 연산한 실측 보고서입니다.
            </p>

            {/* 등급 요약 헤더 탑재 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: getFitGrade(selectedProduct).bg,
              border: `1px solid ${getFitGrade(selectedProduct).borderColor}30`,
              borderRadius: "10px",
              padding: "10px 16px",
              marginBottom: "16px"
            }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>GUBI 제품 보존 등급</span>
              <strong style={{ fontSize: "16px", fontWeight: "900", color: getFitGrade(selectedProduct).color === "#111111" ? "#eab308" : getFitGrade(selectedProduct).borderColor }}>
                {getFitGrade(selectedProduct).grade}
              </strong>
            </div>

            <div style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid var(--border-color)",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                <span>측정 부위</span>
                <span>내 기준 옷 치수</span>
                <span>이 제품 실측</span>
                <span>비교 차이</span>
              </div>

              {[
                { label: selectedProduct.category === "pants" ? "허리 단면" : "어깨 너비", key: "shoulder" },
                { label: selectedProduct.category === "pants" ? "허벅지 단면" : "가슴 단면", key: "chest" },
                { label: "총장", key: "length" },
                { label: selectedProduct.category === "pants" ? "밑위 길이" : "소매 길이", key: "sleeve" }
              ].map((row) => {
                const userVal = getUserMeasurements(selectedProduct.category)[row.key];
                const prodVal = selectedProduct.measurements[row.key];
                const diff = prodVal - userVal;
                
                return (
                  <div key={row.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.02)", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: "500" }}>{row.label}</span>
                    <span style={{ color: "var(--text-muted)" }}>{userVal} cm</span>
                    <span style={{ color: "#ffffff", fontWeight: "600" }}>{prodVal} cm</span>
                    <strong style={{
                      color: diff === 0 ? "#10b981" : diff > 0 ? "#3b82f6" : "#f87171"
                    }}>
                      {diff === 0 ? "딱 맞음" : diff > 0 ? `+${diff}cm` : `${diff}cm`}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "14px",
              marginBottom: "24px",
              fontSize: "13px",
              lineHeight: "1.4"
            }}>
              💡 <strong>AI 핏 어드바이저의 추천의견:</strong><br />
              사용자님이 선호하시는 <strong>{getPreferredFitKo(detailedFit?.preferredFit)}</strong> 대비 어깨 너비와 총장의 핏감을 고려해 분석한 결과입니다. {detailedFit?.bodyCharacteristics?.length > 0 && `현재 '${detailedFit.bodyCharacteristics.join(", ")}' 신체 특징을 보유하고 계시므로 해당 치명적 특이사항까지 실시간 교차 검수 완료했습니다.`}
            </div>

            <button
              className="btn-primary"
              onClick={() => setSelectedProduct(null)}
              style={{ width: "100%", padding: "14px" }}
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
