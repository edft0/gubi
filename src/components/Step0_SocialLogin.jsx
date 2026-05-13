// src/components/Step0_SocialLogin.jsx
import React, { useState } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Step0_SocialLogin() {
  const { setUser, setStep } = useFitProfile();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // 이메일 로그인 시뮬레이터 실행 (gubi / 1234 관리자 로그인 특수 시나리오 가동!)
  const handleEmailLogin = (e) => {
    e.preventDefault();

    const trimmedId = email.trim().toLowerCase();
    const trimmedPw = password.trim();

    if (trimmedId === "gubi" && trimmedPw === "1234") {
      setUser({
        email: "admin@gubi.co.kr",
        name: "최고 관리자",
        provider: "admin"
      });
      setStep("admin"); // 관리자 뷰 페이지로 직행!
    } else {
      setUser({
        email: email || "gubi_user@gubi.co.kr",
        name: "체형구비즈",
        provider: "email"
      });
      setStep(1); // 일반 유저는 STEP 1 기본 신체정보 입력 단계로 이동!
    }
  };

  // 구글/카카오 원형 간편 로그인 처리기
  const handleSocialLogin = (provider, name) => {
    setUser({
      email: `${provider}_user@gubi.co.kr`,
      name: name || "스타일리시유저",
      provider: provider
    });
    setStep(1);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "420px", margin: "0 auto", padding: "40px 24px" }}>

      {/* GUBI 원형 크랙 디자인 로고 및 타이틀 */}
      <div style={{ marginBottom: "36px", marginTop: "12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* 유저님이 가이드해주신 원본 그대로 렌더링하되, 그림자/보더/둥글게 깎는 데코를 싹 제거함 */}
        {/* 원본 검은 사각형 배경과 사이트 다크 배경 사이의 미세한 색차 이질감을 완전 차단하는 CSS mixBlendMode: "screen" 주입! */}
        <img 
          src="/gubi_logo.png" 
          alt="GUBI Logo" 
          style={{ 
            width: "100px", 
            height: "100px", 
            objectFit: "contain",
            marginBottom: "18px",
            mixBlendMode: "screen"
          }} 
        />

        <h1 style={{
          fontSize: "42px",
          fontWeight: "900",
          letterSpacing: "8px",
          color: "#ffffff",
          margin: 0,
          lineHeight: 1
        }}>
          GUBI
        </h1>
        <p style={{
          color: "#ffffff",
          opacity: 0.7,
          fontSize: "13px",
          marginTop: "12px",
          letterSpacing: "1.2px",
          fontWeight: "600"
        }}>
          세컨핸드 초개인화 체형 비교 솔루션
        </p>
      </div>

      {/* 이메일 로그인 입력창 양식 (사진 1 참고) */}
      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
        <div>
          <input
            type="text"
            placeholder="이메일 또는 아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
              transition: "all 0.25s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#ffffff"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
              transition: "all 0.25s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#ffffff"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
          />
        </div>

        {/* 로그인상태유지 체크박스 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
          <input
            type="checkbox"
            id="keep-logged-in"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
              accentColor: "#3b82f6"
            }}
          />
          <label htmlFor="keep-logged-in" style={{ fontSize: "13px", color: "var(--text-secondary)", cursor: "pointer", userSelect: "none" }}>
            로그인 상태 유지
          </label>
        </div>

        {/* 메인 이메일 로그인 버튼 */}
        <button
          type="submit"
          style={{
            background: "#ffffff",
            color: "#09090b",
            border: "1.5px solid #ffffff",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255,255,255,0.1)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          로그인
        </button>
      </form>

      {/* 보조 링크 메뉴 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: "var(--text-muted)",
        marginTop: "16px",
        padding: "0 4px"
      }}>
        <a href="#signup" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>회원가입</a>
        <a href="#find-pw" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>아이디 · 비밀번호 찾기</a>
      </div>

      {/* "또는" 래퍼런스 구분선 장식 (사진 2 스타일) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        margin: "36px 0 24px 0"
      }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontWeight: "600" }}>또는 간편 로그인</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
      </div>

      {/* 둥근 형태의 카카오, 구글 간편 로고 가로 나열 (사진 2 지그재그 하단 참고) */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>

        {/* 카카오 동그라미 로고 단추 */}
        <button
          onClick={() => handleSocialLogin("kakao", "카카오가입자")}
          title="카카오 로그인"
          style={{
            width: "52px",
            height: "52px",
            background: "#FEE500",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(254, 229, 0, 0.15)",
            transition: "all 0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(254, 229, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(254, 229, 0, 0.15)";
          }}
        >
          {/* 카카오 시그니처 말풍선 로고 SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.9-.12.457.16.452.337.333.14-.094 2.23-1.511 3.122-2.115.34.048.69.073 1.048.073 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
          </svg>
        </button>

        {/* 구글 동그라미 로고 단추 */}
        <button
          onClick={() => handleSocialLogin("google", "구글가입자")}
          title="구글 로그인"
          style={{
            width: "52px",
            height: "52px",
            background: "#ffffff",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255, 255, 255, 0.08)",
            transition: "all 0.25s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 255, 255, 0.08)";
          }}
        >
          {/* 고선명 구글 G 시그니처 로고 SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.17-.23-.31-.48-.41-.75z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </button>

      </div>

    </div>
  );
}
