// src/components/Step2_1_DirectInput.jsx
import React, { useState, useEffect } from "react";
import { useFitProfile } from "../context/FitProfileContext";

// 이미지 자산 불러오기
import guideTshirt from "../assets/guide_tshirt.png";
import guideHoodie from "../assets/guide_hoodie.png";
import guideOuter from "../assets/guide_outer.png";
import guidePants from "../assets/guide_pants.png";

export default function Step2_1_DirectInput() {
  const { profile, updateDirectMeasures, setStep, resetMeasures } = useFitProfile();
  const { directMeasures } = profile;

  // 카테고리 순서 정의
  const tabSequence = ["tshirt", "hoodie", "outer", "pants"];
  const [activeTab, setActiveTab] = useState("tshirt");

  // 현재 활성화된 탭의 누적 치수를 로컬 폼 상태로 바인딩
  const [localLength, setLocalLength] = useState("");
  const [localShoulder, setLocalShoulder] = useState("");
  const [localChest, setLocalChest] = useState("");
  const [localSleeve, setLocalSleeve] = useState("");

  const [localWaist, setLocalWaist] = useState("");
  const [localHip, setLocalHip] = useState("");
  const [localThigh, setLocalThigh] = useState("");
  const [localRise, setLocalRise] = useState("");
  const [localHem, setLocalHem] = useState("");

  const tabs = [
    { id: "tshirt", label: "티셔츠" },
    { id: "hoodie", label: "후드·맨투맨" },
    { id: "outer", label: "아우터" },
    { id: "pants", label: "팬츠" }
  ];

  const isPants = activeTab === "pants";

  // 탭이 바뀔 때마다, 이미 전역에 채워져 누적 보관된 값이 있다면 로컬 폼으로 순조롭게 복원해오기
  useEffect(() => {
    const data = directMeasures[activeTab] || {};
    if (activeTab === "pants") {
      setLocalLength(data.length || "");
      setLocalWaist(data.waist || "");
      setLocalHip(data.hip || "");
      setLocalThigh(data.thigh || "");
      setLocalRise(data.rise || "");
      setLocalHem(data.hem || "");
    } else {
      setLocalLength(data.length || "");
      setLocalShoulder(data.shoulder || "");
      setLocalChest(data.chest || "");
      setLocalSleeve(data.sleeve || "");
    }
  }, [activeTab, directMeasures]);

  // 다음 카테고리로의 스무스한 이동 처리
  const moveToNextTabOrStep = () => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (currentIndex < tabSequence.length - 1) {
      // 다음 카테고리 탭으로 전진
      setActiveTab(tabSequence[currentIndex + 1]);
    } else {
      // 마지막 탭(pants)이었을 경우: 직접 입력에서 건너뛴 범주 목록을 추출하여 DB 선택에서 메울지 결정!
      const skippedCategories = [];
      const { tshirt, hoodie, outer, pants } = directMeasures;

      if (!(tshirt.length > 0 && tshirt.shoulder > 0 && tshirt.chest > 0 && tshirt.sleeve > 0)) {
        skippedCategories.push("tshirt");
      }
      if (!(hoodie.length > 0 && hoodie.shoulder > 0 && hoodie.chest > 0 && hoodie.sleeve > 0)) {
        skippedCategories.push("hoodie");
      }
      if (!(outer.length > 0 && outer.shoulder > 0 && outer.chest > 0 && outer.sleeve > 0)) {
        skippedCategories.push("outer");
      }
      if (!(pants.length > 0 && pants.waist > 0 && pants.hip > 0 && pants.thigh > 0 && pants.rise > 0 && pants.hem > 0)) {
        skippedCategories.push("pants");
      }

      if (skippedCategories.length > 0) {
        // 건너뛴 범주가 단 하나라도 존재한다면 영리하게 DB 의류 선택 단계로 인도!
        setStep(2.2);
      } else {
        // 4개 범주를 완벽히 실측했으면 곧장 세부 체형 단계로 전진!
        setStep(3);
      }
    }
  };

  // 다음 버튼 인터랙션 (현재 탭 수치 저장 후 다음 탭/단계로 이동)
  const handleNext = () => {
    if (isPants) {
      if (!localLength || !localWaist || !localHip || !localThigh || !localRise || !localHem) return;
      updateDirectMeasures("pants", {
        length: Number(localLength),
        waist: Number(localWaist),
        hip: Number(localHip),
        thigh: Number(localThigh),
        rise: Number(localRise),
        hem: Number(localHem)
      });
    } else {
      if (!localLength || !localShoulder || !localChest || !localSleeve) return;
      updateDirectMeasures(activeTab, {
        length: Number(localLength),
        shoulder: Number(localShoulder),
        chest: Number(localChest),
        sleeve: Number(localSleeve)
      });
    }
    // 다음 카테고리 혹은 세부체형 단계로 전진
    moveToNextTabOrStep();
  };

  // 잘 모르겠어요 | 건너뛰기 인터랙션 (수치 기입 없이 다음 탭/단계로 스킵)
  const handleSkip = (e) => {
    e.preventDefault();
    moveToNextTabOrStep();
  };

  // 현재 탭의 모든 폼 수치가 채워져 있는지 유효성 감사
  const isFormValid = isPants
    ? (localLength > 0 && localWaist > 0 && localHip > 0 && localThigh > 0 && localRise > 0 && localHem > 0)
    : (localLength > 0 && localShoulder > 0 && localChest > 0 && localSleeve > 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "580px", margin: "0 auto", paddingBottom: "70px" }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          실측을 직접 입력해주세요
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
          카테고리별로 하나씩 입력하면 더 정확해요.<br />
          하나만 해도 좋고, 건너뛰어도 됩니다.
        </p>
      </div>

      {/* 카테고리 탭 리스트 */}
      <div style={{
        display: "flex",
        background: "rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        padding: "6px",
        border: "1px solid var(--border-color)",
        marginBottom: "20px"
      }}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: isSelected ? "#ffffff" : "transparent",
                color: isSelected ? "#09090b" : "var(--text-secondary)",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 측정 가이드 도식 카드 */}
      <div className="glass-card" style={{
        padding: "20px",
        marginBottom: "24px",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", alignSelf: "flex-start", marginBottom: "12px" }}>
          측정 범위 기준 가이드
        </span>
        
        {/* 깜빡임(Flicker) 원천 차단을 위해 absolute 레이어 멀티 마운팅 및 크기 강제 확보 */}
        <div style={{
          width: "100%",
          height: "230px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255,255,255,0.01)",
          borderRadius: "12px",
          overflow: "hidden"
        }}>
          {/* 티셔츠 가이드 이미지 */}
          <img 
            src={guideTshirt} 
            alt="tshirt guide" 
            style={{ 
              position: "absolute",
              maxWidth: "100%", 
              maxHeight: "100%", 
              objectFit: "contain",
              filter: "brightness(0.95)",
              opacity: activeTab === "tshirt" ? 1 : 0,
              visibility: activeTab === "tshirt" ? "visible" : "hidden",
              transition: "opacity 0.2s ease-in-out, visibility 0.2s",
              pointerEvents: "none"
            }} 
          />

          {/* 후드맨투맨 가이드 이미지 */}
          <img 
            src={guideHoodie} 
            alt="hoodie guide" 
            style={{ 
              position: "absolute",
              maxWidth: "100%", 
              maxHeight: "100%", 
              objectFit: "contain",
              filter: "brightness(0.95)",
              opacity: activeTab === "hoodie" ? 1 : 0,
              visibility: activeTab === "hoodie" ? "visible" : "hidden",
              transition: "opacity 0.2s ease-in-out, visibility 0.2s",
              pointerEvents: "none"
            }} 
          />

          {/* 아우터 가이드 이미지 */}
          <img 
            src={guideOuter} 
            alt="outer guide" 
            style={{ 
              position: "absolute",
              maxWidth: "100%", 
              maxHeight: "100%", 
              objectFit: "contain",
              filter: "brightness(0.95)",
              opacity: activeTab === "outer" ? 1 : 0,
              visibility: activeTab === "outer" ? "visible" : "hidden",
              transition: "opacity 0.2s ease-in-out, visibility 0.2s",
              pointerEvents: "none"
            }} 
          />

          {/* 팬츠 가이드 이미지 */}
          <img 
            src={guidePants} 
            alt="pants guide" 
            style={{ 
              position: "absolute",
              maxWidth: "100%", 
              maxHeight: "100%", 
              objectFit: "contain",
              filter: "brightness(0.95)",
              opacity: activeTab === "pants" ? 1 : 0,
              visibility: activeTab === "pants" ? "visible" : "hidden",
              transition: "opacity 0.2s ease-in-out, visibility 0.2s",
              pointerEvents: "none"
            }} 
          />
        </div>
      </div>

      {/* 입력 폼 카드 */}
      <div className="glass-card" style={{ padding: "28px", textAlign: "left" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "24px" }}>
          {tabs.find(t => t.id === activeTab)?.label} 사이즈 입력
        </h3>

        {/* 상의 3종 폼 필드 (총장 -> 어깨 너비 -> 가슴 단면 -> 소매 길이 순) */}
        {!isPants && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. 총장 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">총장 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localLength}
                  onChange={(e) => setLocalLength(e.target.value)}
                  style={{ background: localLength > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 목 뒤 중앙 ~ 밑단</p>
            </div>

            {/* 2. 어깨 너비 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">어깨 너비 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localShoulder}
                  onChange={(e) => setLocalShoulder(e.target.value)}
                  style={{ background: localShoulder > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 어깨 솔기 끝 ~ 끝</p>
            </div>

            {/* 3. 가슴 단면 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">가슴 단면 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localChest}
                  onChange={(e) => setLocalChest(e.target.value)}
                  style={{ background: localChest > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 겨드랑이 아래 가로</p>
            </div>

            {/* 4. 소매 길이 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">소매 길이 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localSleeve}
                  onChange={(e) => setLocalSleeve(e.target.value)}
                  style={{ background: localSleeve > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 어깨 솔기 ~ 소매 끝</p>
            </div>
          </div>
        )}

        {/* 하의 팬츠 폼 필드 (총장 -> 허리 단면 -> 엉덩이 단면 -> 허벅지 단면 -> 밑위 -> 밑단단면 순) */}
        {isPants && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. 총장 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">총장 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localLength}
                  onChange={(e) => setLocalLength(e.target.value)}
                  style={{ background: localLength > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 바지 옆선 전체 길이</p>
            </div>

            {/* 2. 허리 단면 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">허리 단면 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localWaist}
                  onChange={(e) => setLocalWaist(e.target.value)}
                  style={{ background: localWaist > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 허리 벨트라인 왼쪽 끝 ~ 오른쪽 끝</p>
            </div>

            {/* 3. 엉덩이 단면 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">엉덩이 단면 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localHip}
                  onChange={(e) => setLocalHip(e.target.value)}
                  style={{ background: localHip > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 엉덩이 최광부 가로 단면</p>
            </div>

            {/* 4. 허벅지 단면 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">허벅지 단면 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localThigh}
                  onChange={(e) => setLocalThigh(e.target.value)}
                  style={{ background: localThigh > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 허벅지 최광부 가로 단면</p>
            </div>

            {/* 5. 밑위 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">밑위 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localRise}
                  onChange={(e) => setLocalRise(e.target.value)}
                  style={{ background: localRise > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 벨트라인 끝 ~ 밑위 십자선</p>
            </div>

            {/* 6. 밑단 단면 */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">밑단 단면 *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="styled-input"
                  placeholder="숫자 입력"
                  value={localHem}
                  onChange={(e) => setLocalHem(e.target.value)}
                  style={{ background: localHem > 0 ? "rgba(255, 255, 255, 0.03)" : "rgba(255,255,255,0.01)" }}
                  required
                />
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>cm</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "2px" }}>※ 밑단 끝 가로 단면</p>
            </div>
          </div>
        )}

        {/* 이전 / 다음 단계 버튼 (모바일 시안 준수) */}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px", marginBottom: "20px" }}>
          <button
            className="btn-secondary"
            onClick={() => {
              const currentIndex = tabSequence.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabSequence[currentIndex - 1]);
              } else {
                resetMeasures(); // 측정 임시 내역 깔끔하게 소거!
                setStep(2); // 분기 화면으로 복귀
              }
            }}
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
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: isFormValid ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (isFormValid) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              if (isFormValid) e.currentTarget.style.transform = "scale(1)";
            }}
          >
            다음
          </button>
        </div>

        {/* 하단 잘 모르겠어요 | 건너뛰기 텍스트 링크 버튼 */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <a
            href="#skip"
            onClick={handleSkip}
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "underline",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.color = "var(--text-secondary)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
          >
            잘 모르겠어요 | 건너뛰기
          </a>
        </div>
      </div>
    </div>
  );
}
