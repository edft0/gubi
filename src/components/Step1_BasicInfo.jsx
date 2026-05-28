// src/components/Step1_BasicInfo.jsx
import React, { useState, useEffect } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Step1_BasicInfo() {
  const { profile, updateBasicInfo, setStep } = useFitProfile();
  const { nickname, gender, height, weight, usualSize, sizeType } = profile.basicInfo;

  const [localNickname, setLocalNickname] = useState(nickname || "");
  const [nicknameError, setNicknameError] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const [localHeight, setLocalHeight] = useState(height || "");
  const [localWeight, setLocalWeight] = useState(weight || "");
  const [activeSizeType, setActiveSizeType] = useState(sizeType || "alphabet"); // 'alphabet' | 'number'

  const alphabetSizes = ["S", "M", "L", "XL", "XXL", "3XL"];
  const numberSizes = ["90", "95", "100", "105", "110", "115"];

  // 가상의 테스트 식별 데이터베이스 (중복 가입 방지용 블랙리스트 설정)
  const reservedNicknames = ["gubi", "admin", "stylish", "kream", "musinsa", "koo", "test", "구비", "어드민", "스타일리시"];

  // 닉네임 실시간 중복 체크 및 정합성 검증 엔진
  useEffect(() => {
    if (!localNickname) {
      setNicknameError("");
      setIsNicknameChecked(false);
      return;
    }

    // 닉네임 패턴 정규식: 한글/영문/숫자 조합 2~10자
    const regex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    if (!regex.test(localNickname)) {
      setNicknameError("닉네임은 한글/영문/숫자 2~10자만 가능합니다.");
      setIsNicknameChecked(false);
      return;
    }

    // 예약어 중복 방지 타깃링
    if (reservedNicknames.includes(localNickname.toLowerCase())) {
      setNicknameError("이미 존재하는 닉네임입니다. (식별 중복)");
      setIsNicknameChecked(false);
    } else {
      setNicknameError("");
      setIsNicknameChecked(true);
      // 유효할 때 Context에 저장
      updateBasicInfo({ nickname: localNickname });
    }
  }, [localNickname]);

  // 성별, 키, 몸무게 연쇄 잠금 상태값 정의
  const isGenderSelected = !!gender;
  const isHeightWeightValid = localHeight > 50 && localHeight < 250 && localWeight > 20 && localWeight < 250;
  const isUsualSizeSelected = !!usualSize;

  // 키/몸무게 동기화용 이펙트
  useEffect(() => {
    if (isHeightWeightValid) {
      updateBasicInfo({
        height: Number(localHeight),
        weight: Number(localWeight),
        sizeType: activeSizeType
      });
    } else {
      updateBasicInfo({
        height: "",
        weight: ""
      });
    }
  }, [localHeight, localWeight, activeSizeType]);

  // 공백 제어용 이펙트
  useEffect(() => {
    if (!height) setLocalHeight("");
    if (!weight) setLocalWeight("");
  }, [height, weight]);

  const handleNext = () => {
    if (!isNicknameChecked || !localHeight || !localWeight || !usualSize) return;
    setStep(2); // STEP 2 기준설정 방법 선택 진입
  };

  const handleGenderToggle = (selectedGender) => {
    if (gender === selectedGender) {
      updateBasicInfo({ gender: "" });
    } else {
      updateBasicInfo({ gender: selectedGender });
    }
  };

  const handleSizeSelect = (selectedSize) => {
    if (usualSize === selectedSize) {
      updateBasicInfo({ usualSize: "" });
    } else {
      updateBasicInfo({ usualSize: selectedSize });
    }
  };

  // 모든 폼이 100% 무결성하게 기입되었는지 최종 스크리닝!
  const isFormValid = isNicknameChecked && isHeightWeightValid && isUsualSizeSelected && isGenderSelected;

  const getToggleButtonStyle = (isSelected) => {
    return {
      flex: 1,
      padding: "16px",
      textAlign: "center",
      cursor: "pointer",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "700",
      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      background: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
      color: isSelected ? "#09090b" : "var(--text-secondary)",
      border: `1.5px solid ${isSelected ? "#ffffff" : "var(--border-color)"}`,
      boxShadow: isSelected ? "0 4px 15px rgba(255, 255, 255, 0.12)" : "none"
    };
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "500px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* 타이틀 및 서브타이틀 */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          나에게 맞는 핏을 찾아드릴게요 🔍
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          식별 가능한 내 전용 닉네임과 신체정보를 정확하게 설정해주세요.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "32px", textAlign: "left", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* STEP 1-0: 닉네임란 (최상단 신설!) */}
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label className="form-label" style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
            닉네임 <span style={{ color: "#3b82f6", marginLeft: "2px" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="styled-input"
              placeholder="예: 구비구비, koo12"
              value={localNickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                border: `1.5px solid ${nicknameError ? "rgba(239, 68, 68, 0.5)" : isNicknameChecked ? "rgba(16, 185, 129, 0.5)" : "var(--border-color)"}`,
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                outline: "none",
                transition: "all 0.2s"
              }}
            />
          </div>
          {/* 실시간 유효성 피드백 라벨 */}
          {nicknameError && (
            <span style={{ fontSize: "12.5px", color: "#f87171", fontWeight: "600", display: "block", marginTop: "2px", paddingLeft: "4px" }}>
              ⚠️ {nicknameError}
            </span>
          )}
          {!nicknameError && isNicknameChecked && (
            <span style={{ fontSize: "12.5px", color: "#34d399", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", paddingLeft: "4px" }}>
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                color: "#34d399",
                textShadow: "1.5px 1.5px 0px rgba(0, 0, 0, 0.4)", // 입체 섀도우!
                userSelect: "none"
              }}>v</span> 사용 가능한 닉네임입니다.
            </span>
          )}
        </div>

        {/* STEP 1-1: 성별 (닉네임이 정상 검증 통과 완료되었을 때 페이드인 노출) */}
        {isNicknameChecked && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "24px" }}>
            <label className="form-label" style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>성별</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                onClick={() => handleGenderToggle("남")}
                style={getToggleButtonStyle(gender === "남")}
              >
                남성
              </div>
              <div
                onClick={() => handleGenderToggle("여")}
                style={getToggleButtonStyle(gender === "여")}
              >
                여성
              </div>
            </div>
          </div>
        )}

        {/* STEP 1-2: 키 및 몸무게 (성별까지 골랐을 때 연쇄 노출) */}
        {isNicknameChecked && isGenderSelected && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "24px" }}>
            <label className="form-label" style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>키 및 몸무게</label>
            <div style={{ display: "flex", gap: "16px" }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="styled-input"
                    placeholder="키 (cm)"
                    value={localHeight}
                    onChange={(e) => setLocalHeight(e.target.value)}
                    min="50"
                    max="250"
                    required
                  />
                  <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "13px" }}>cm</span>
                </div>
              </div>

              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="styled-input"
                    placeholder="몸무게 (kg)"
                    value={localWeight}
                    onChange={(e) => setLocalWeight(e.target.value)}
                    min="20"
                    max="250"
                    required
                  />
                  <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "13px" }}>kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1-3: 평소 사이즈 (키 & 몸무게까지 입력 시 연쇄 노출) */}
        {isNicknameChecked && isGenderSelected && isHeightWeightValid && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>평소 사이즈</label>

              <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "2px" }}>
                <button
                  onClick={() => {
                    setActiveSizeType("alphabet");
                    if (usualSize && !alphabetSizes.includes(usualSize)) {
                      updateBasicInfo({ usualSize: "" });
                    }
                  }}
                  style={{
                    border: "none",
                    background: activeSizeType === "alphabet" ? "rgba(255,255,255,0.12)" : "transparent",
                    color: activeSizeType === "alphabet" ? "#ffffff" : "var(--text-muted)",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  알파벳
                </button>
                <button
                  onClick={() => {
                    setActiveSizeType("number");
                    if (usualSize && !numberSizes.includes(usualSize)) {
                      updateBasicInfo({ usualSize: "" });
                    }
                  }}
                  style={{
                    border: "none",
                    background: activeSizeType === "number" ? "rgba(255,255,255,0.12)" : "transparent",
                    color: activeSizeType === "number" ? "#ffffff" : "var(--text-muted)",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  숫자
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(activeSizeType === "alphabet" ? alphabetSizes : numberSizes).map((size) => {
                const isSelected = usualSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    style={{
                      flex: "1 1 65px",
                      minWidth: "65px",
                      padding: "14px 10px",
                      background: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
                      border: `1.5px solid ${isSelected ? "#ffffff" : "var(--border-color)"}`,
                      borderRadius: "10px",
                      color: isSelected ? "#09090b" : "var(--text-secondary)",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isSelected ? "0 4px 15px rgba(255, 255, 255, 0.12)" : "none"
                    }}
                    onMouseEnter={(e) => {
                      if (usualSize !== size) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (usualSize !== size) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      }
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1-4: 하단 이전/다음 단계 이동 버튼군 */}
        {isNicknameChecked && isGenderSelected && isHeightWeightValid && isUsualSizeSelected && (
          <div className="animate-fade-in" style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "24px" }}>
            <button
              className="btn-secondary"
              onClick={() => setStep(0)}
              style={{ flex: 1, padding: "16px", borderRadius: "12px", fontWeight: "700" }}
            >
              이전
            </button>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isFormValid}
              style={{
                flex: 2,
                padding: "16px",
                borderRadius: "12px",
                fontWeight: "800",
                background: "#ffffff",
                color: "#09090b",
                border: "1.5px solid #ffffff",
                boxShadow: "0 4px 15px rgba(255, 255, 255, 0.15)",
                cursor: isFormValid ? "pointer" : "not-allowed",
                transition: "all 0.2s ease-in-out",
                opacity: isFormValid ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (isFormValid) e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                if (isFormValid) e.currentTarget.style.transform = "scale(1)";
              }}
            >
              다음 단계로 계속
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
