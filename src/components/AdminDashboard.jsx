// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function AdminDashboard() {
  const { profile, setStep, deleteUserFromVirtualDB } = useFitProfile();
  const { usersList } = profile;

  // 검색 상태 및 상세 조회 선택 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // 선호핏 한글 매핑 헬퍼
  const getPreferredFitKo = (fit) => {
    if (fit === "slim") return "슬림핏";
    if (fit === "over") return "오버핏";
    return "레귤러핏";
  };

  // 검색 필터링
  const filteredUsers = (usersList || []).filter(u => 
    u.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.usualSize?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 통계 연산
  const totalUsers = filteredUsers.length;
  const avgHeight = totalUsers > 0 
    ? Math.round(filteredUsers.reduce((acc, cur) => acc + Number(cur.height || 0), 0) / totalUsers)
    : 0;
  const avgWeight = totalUsers > 0 
    ? Math.round(filteredUsers.reduce((acc, cur) => acc + Number(cur.weight || 0), 0) / totalUsers)
    : 0;

  // 테이블 요약용 기준의류 개수 및 목록 리턴 헬퍼
  const getBaseClothesSummaryText = (user) => {
    const list = user.baseClothesList;
    if (!list) return "등록된 기준 옷 없음";

    const activeCategories = [];
    if (list.tshirt && !list.tshirt.includes("미등록")) activeCategories.push("티셔츠 👕");
    if (list.hoodie && !list.hoodie.includes("미등록")) activeCategories.push("후드 🧥");
    if (list.outer && !list.outer.includes("미등록")) activeCategories.push("아우터 🧥");
    if (list.pants && !list.pants.includes("미등록")) activeCategories.push("팬츠 👖");

    if (activeCategories.length === 0) return "미등록 (모두 건너뜀)";
    return `총 ${activeCategories.length}개 등록 (${activeCategories.map(c => c.split(" ")[0]).join(", ")})`;
  };

  // 회원 삭제 핸들러
  const handleDelete = (e, nickname) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 차단!
    if (window.confirm(`정말 '${nickname}' 회원의 데이터를 삭제하시겠습니까? (복구 불가능)`)) {
      deleteUserFromVirtualDB(nickname);
      if (selectedUser?.nickname === nickname) {
        setSelectedUser(null);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: "100%", maxWidth: "1150px", margin: "0 auto", padding: "10px 0" }}>
      {/* 상단 관리자 헤더 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "36px",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "16px"
      }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              display: "inline-block",
              boxShadow: "0 0 10px #ef4444"
            }}></span>
            <h1 style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "1px", margin: 0 }}>GUBI ADMIN PANEL</h1>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            gubi / 1234 최고관리자 권한 가동 중
          </p>
        </div>

        <button
          onClick={() => setStep(0)}
          className="btn-secondary"
          style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "600", borderRadius: "10px" }}
        >
          로그아웃 ↩️
        </button>
      </div>

      {/* KPI 통계 카드 위젯 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "36px"
      }}>
        {/* 카드 1 */}
        <div className="glass-card" style={{
          padding: "24px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "left",
          borderRadius: "16px"
        }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", display: "block", marginBottom: "8px", letterSpacing: "0.5px" }}>
            등록된 회원 수 👥
          </span>
          <h2 style={{ fontSize: "36px", fontWeight: "800", margin: 0, color: "#ffffff" }}>
            {totalUsers} <span style={{ fontSize: "18px", fontWeight: "500", color: "var(--text-secondary)" }}>명</span>
          </h2>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px" }}>
            실시간 온보딩을 마친 동적 유저 데이터 수
          </p>
        </div>

        {/* 카드 2 */}
        <div className="glass-card" style={{
          padding: "24px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "left",
          borderRadius: "16px"
        }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", display: "block", marginBottom: "8px", letterSpacing: "0.5px" }}>
            가입자 평균 키 📏
          </span>
          <h2 style={{ fontSize: "36px", fontWeight: "800", margin: 0, color: "#3b82f6" }}>
            {avgHeight} <span style={{ fontSize: "18px", fontWeight: "500", color: "var(--text-secondary)" }}>cm</span>
          </h2>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px" }}>
            가입 회원들의 산술적인 평균 신장 스펙
          </p>
        </div>

        {/* 카드 3 */}
        <div className="glass-card" style={{
          padding: "24px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "left",
          borderRadius: "16px"
        }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", display: "block", marginBottom: "8px", letterSpacing: "0.5px" }}>
            가입자 평균 몸무게 ⚖️
          </span>
          <h2 style={{ fontSize: "36px", fontWeight: "800", margin: 0, color: "#a855f7" }}>
            {avgWeight} <span style={{ fontSize: "18px", fontWeight: "500", color: "var(--text-secondary)" }}>kg</span>
          </h2>
          <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px" }}>
            가입 회원들의 산술적인 평균 몸무게 스펙
          </p>
        </div>
      </div>

      {/* 검색창 테이블 컨트롤 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <input
          type="text"
          className="styled-input"
          placeholder="🔍 닉네임이나 평소 사이즈로 가입 고객을 검색하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "420px", padding: "12px 18px", fontSize: "14px" }}
        />
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>
          필터링된 결과: {totalUsers}건 / 행 클릭 시 4대 기준의류 가판대 및 체형 대시보드 팝업 💡
        </span>
      </div>

      {/* 테이블 형식의 고객 정보 조회 그리드 */}
      <div className="glass-card" style={{
        overflowX: "auto",
        borderRadius: "16px",
        background: "rgba(10, 10, 12, 0.8)",
        border: "1px solid var(--glass-border)",
        marginBottom: "40px"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "14px"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255, 255, 255, 0.02)"
            }}>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>닉네임</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>성별</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>키 (Height)</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>몸무게 (Weight)</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>평소 사이즈</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>4대 비교 기준의류 등록 현황</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700" }}>선호 스타일핏</th>
              <th style={{ padding: "18px 24px", color: "var(--text-secondary)", fontWeight: "700", textAlign: "center" }}>데이터 통제</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "48px 24px", color: "var(--text-muted)", fontWeight: "600", textAlign: "center" }}>
                  가입 조건에 부합하는 고객 데이터가 존재하지 않습니다. 📭
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user.nickname + idx}
                  onClick={() => setSelectedUser(user)} // 클릭 시 상세 팝업 오픈!
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {/* 닉네임 */}
                  <td style={{ padding: "18px 24px", fontWeight: "800", color: "#ffffff" }}>
                    {user.nickname}
                  </td>
                  {/* 성별 */}
                  <td style={{ padding: "18px 24px" }}>
                    <span style={{
                      background: user.gender === "남" ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)",
                      color: user.gender === "남" ? "#60a5fa" : "#c084fc",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}>
                      {user.gender}
                    </span>
                  </td>
                  {/* 키 */}
                  <td style={{ padding: "18px 24px", fontWeight: "600" }}>{user.height} cm</td>
                  {/* 몸무게 */}
                  <td style={{ padding: "18px 24px", fontWeight: "600" }}>{user.weight} kg</td>
                  {/* 평소 사이즈 */}
                  <td style={{ padding: "18px 24px" }}>
                    <span style={{
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      fontSize: "12px",
                      background: "rgba(255,255,255,0.03)",
                      fontWeight: "600",
                      color: "#ffffff"
                    }}>{user.usualSize}</span>
                  </td>
                  {/* 4대 비교 기준의류 현황 */}
                  <td style={{ padding: "18px 24px", fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", fontWeight: "600" }}>
                    {getBaseClothesSummaryText(user)}
                  </td>
                  {/* 선호 핏 */}
                  <td style={{ padding: "18px 24px", fontWeight: "600" }}>
                    {getPreferredFitKo(user.preferredFit)}
                  </td>
                  {/* 삭제 데이터 통제 */}
                  <td style={{ padding: "18px 24px", textAlign: "center" }}>
                    <button
                      onClick={(e) => handleDelete(e, user.nickname)}
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        borderRadius: "8px",
                        color: "#f87171",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ef4444";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                        e.currentTarget.style.color = "#f87171";
                      }}
                    >
                      삭제 🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4대 카테고리(티셔츠, 후드, 아우터, 팬츠) 전체를 일괄 모니터링하는 고객 상세 핏 대시보드 팝업 */}
      {selectedUser && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 400,
          padding: "20px"
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: "750px",
            width: "100%",
            padding: "36px",
            background: "rgba(13, 13, 16, 0.97)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9)",
            borderRadius: "28px",
            textAlign: "left"
          }}>
            {/* 모달 상단 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
                  borderRadius: "50%",
                  width: "12px",
                  height: "12px",
                  display: "inline-block"
                }}></span>
                <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "800", letterSpacing: "1px" }}>CUSTOMER FIT DASHBOARD</span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: "28px",
                  cursor: "pointer",
                  lineHeight: 1,
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#ffffff"}
                onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
              >
                ×
              </button>
            </div>

            {/* 유저 타이틀 */}
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", margin: "0 0 4px 0" }}>
                {selectedUser.nickname} <span style={{ fontSize: "16px", fontWeight: "500", color: "var(--text-muted)" }}>님의 체형 리포트</span>
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                온보딩 4단계 과정에서 등록한 4개 의류군 전체 비교 기준 수치를 스캔 분석했습니다.
              </p>
            </div>

            {/* 신체 기본 스펙 요약 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginBottom: "24px"
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: "12px",
                padding: "16px"
              }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "4px" }}>기본 신체 정보</span>
                <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: "800" }}>
                  {selectedUser.gender}성 / {selectedUser.height}cm / {selectedUser.weight}kg
                </strong>
              </div>

              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: "12px",
                padding: "16px"
              }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "4px" }}>선호 스타일 & 사이즈</span>
                <strong style={{ fontSize: "18px", color: "#3b82f6", fontWeight: "800" }}>
                  {getPreferredFitKo(selectedUser.preferredFit)} (평소 {selectedUser.usualSize})
                </strong>
              </div>
            </div>

            {/* ⭐ 핵심: 4가지 비교 기준 의류 격자형 가판대 (4-Category wardrobe panel) */}
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", display: "block", marginBottom: "12px", letterSpacing: "0.5px" }}>
                👕 👖 4가지 범주별 연동 기준 의류 가판대 (4-Category Wardrobe Panel)
              </span>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "14px"
              }}>
                {/* 1. 티셔츠 */}
                <div style={{
                  background: selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "rgba(255, 255, 255, 0.01)" : "rgba(59, 130, 246, 0.06)",
                  border: selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(59, 130, 246, 0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>티셔츠 👕</span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "rgba(255,255,255,0.05)" : "rgba(59, 130, 246, 0.2)",
                      color: selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "var(--text-muted)" : "#60a5fa"
                    }}>
                      {selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "비었음" : "활성"}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "13.5px",
                    color: selectedUser.baseClothesList?.tshirt?.includes("미등록") ? "var(--text-muted)" : "#ffffff",
                    fontWeight: "600",
                    margin: 0,
                    lineHeight: "1.4"
                  }}>
                    {selectedUser.baseClothesList?.tshirt || "미등록 (스킵함)"}
                  </p>
                </div>

                {/* 2. 후드·맨투맨 */}
                <div style={{
                  background: selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "rgba(255, 255, 255, 0.01)" : "rgba(168, 85, 247, 0.06)",
                  border: selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(168, 85, 247, 0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>후드·맨투맨 🧥</span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "rgba(255,255,255,0.05)" : "rgba(168, 85, 247, 0.2)",
                      color: selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "var(--text-muted)" : "#c084fc"
                    }}>
                      {selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "비었음" : "활성"}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "13.5px",
                    color: selectedUser.baseClothesList?.hoodie?.includes("미등록") ? "var(--text-muted)" : "#ffffff",
                    fontWeight: "600",
                    margin: 0,
                    lineHeight: "1.4"
                  }}>
                    {selectedUser.baseClothesList?.hoodie || "미등록 (스킵함)"}
                  </p>
                </div>

                {/* 3. 아우터 */}
                <div style={{
                  background: selectedUser.baseClothesList?.outer?.includes("미등록") ? "rgba(255, 255, 255, 0.01)" : "rgba(59, 130, 246, 0.06)",
                  border: selectedUser.baseClothesList?.outer?.includes("미등록") ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(59, 130, 246, 0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>아우터 🧥</span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedUser.baseClothesList?.outer?.includes("미등록") ? "rgba(255,255,255,0.05)" : "rgba(59, 130, 246, 0.2)",
                      color: selectedUser.baseClothesList?.outer?.includes("미등록") ? "var(--text-muted)" : "#60a5fa"
                    }}>
                      {selectedUser.baseClothesList?.outer?.includes("미등록") ? "비었음" : "활성"}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "13.5px",
                    color: selectedUser.baseClothesList?.outer?.includes("미등록") ? "var(--text-muted)" : "#ffffff",
                    fontWeight: "600",
                    margin: 0,
                    lineHeight: "1.4"
                  }}>
                    {selectedUser.baseClothesList?.outer || "미등록 (스킵함)"}
                  </p>
                </div>

                {/* 4. 팬츠 */}
                <div style={{
                  background: selectedUser.baseClothesList?.pants?.includes("미등록") ? "rgba(255, 255, 255, 0.01)" : "rgba(16, 185, 129, 0.06)",
                  border: selectedUser.baseClothesList?.pants?.includes("미등록") ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>팬츠 👖</span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedUser.baseClothesList?.pants?.includes("미등록") ? "rgba(255,255,255,0.05)" : "rgba(16, 185, 129, 0.2)",
                      color: selectedUser.baseClothesList?.pants?.includes("미등록") ? "var(--text-muted)" : "#34d399"
                    }}>
                      {selectedUser.baseClothesList?.pants?.includes("미등록") ? "비었음" : "활성"}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "13.5px",
                    color: selectedUser.baseClothesList?.pants?.includes("미등록") ? "var(--text-muted)" : "#ffffff",
                    fontWeight: "600",
                    margin: 0,
                    lineHeight: "1.4"
                  }}>
                    {selectedUser.baseClothesList?.pants || "미등록 (스킵함)"}
                  </p>
                </div>
              </div>
            </div>

            {/* 체형 특수사항 */}
            <div style={{ marginBottom: "32px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", display: "block", marginBottom: "10px", letterSpacing: "0.5px" }}>
                🔥 세부 체형 특수사항 및 특징 분석
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedUser.bodyCharacteristics && selectedUser.bodyCharacteristics.map((char, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      background: "rgba(168, 85, 247, 0.12)",
                      border: "1px solid rgba(168, 85, 247, 0.25)",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#c084fc"
                    }}
                  >
                    💡 {char}
                  </span>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn-primary"
                onClick={() => setSelectedUser(null)}
                style={{ flex: 1, padding: "14px", fontSize: "15px" }}
              >
                상세 정보 닫기
              </button>
              
              <button
                onClick={(e) => {
                  handleDelete(e, selectedUser.nickname);
                }}
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  color: "#ef4444",
                  padding: "0 24px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                  e.currentTarget.style.color = "#ef4444";
                }}
              >
                회원 추방 ❌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
