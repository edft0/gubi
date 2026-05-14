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
    <div className="animate-fade-in" style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>

      {/* 중앙 미니멀 로고 (GUBI 텍스트 삭제) */}
      <div style={{ marginBottom: "60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src="/gubi_logo.png"
          alt="GUBI Logo"
          style={{
            width: "130px", /* 로고 크기 확대 */
            height: "130px", /* 로고 크기 확대 */
            objectFit: "contain",
            mixBlendMode: "screen",
            filter: "contrast(1.2) grayscale(100%)",
            marginBottom: "24px"
          }}
        />
      </div>

      {/* 픽셀 폰트 이메일 로그인 폼 */}
      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "220px", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="email or id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 0",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #ffffff",
            color: "#ffffff",
            fontSize: "10px",
            fontFamily: "var(--font-pixel)",
            outline: "none",
            letterSpacing: "1px"
          }}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 0",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #ffffff",
            color: "#ffffff",
            fontSize: "10px",
            fontFamily: "var(--font-pixel)",
            outline: "none",
            letterSpacing: "1px"
          }}
        />

        <button
          type="submit"
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
            fontSize: "11px",
            fontFamily: "var(--font-pixel)",
            cursor: "pointer",
            marginTop: "24px",
            letterSpacing: "1px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#ffffff"}
        >
          login
        </button>
      </form>

      {/* 심플 가로 선 구분선 (텍스트 제거) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "260px",
        marginBottom: "32px"
      }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }}></div>
        <div style={{ width: "30px" }}></div> {/* 가운데 여백만 살짝 주기 */}
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }}></div>
      </div>

      {/* 소셜 로그인 버튼 그룹 (글로우 효과 제거, 오리지널 무광택 복귀) */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px"
      }}>

        {/* 카카오 글로우 제거 버튼 */}
        <button
          onClick={() => handleSocialLogin("kakao", "카카오가입자")}
          title="카카오 로그인"
          style={{
            width: "42px", /* 소셜 로그인 축소 */
            height: "42px", /* 소셜 로그인 축소 */
            background: "#FEE500",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.9-.12.457.16.452.337.333.14-.094 2.23-1.511 3.122-2.115.34.048.69.073 1.048.073 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
          </svg>
        </button>

        {/* 구글 글로우 제거 버튼 */}
        <button
          onClick={() => handleSocialLogin("google", "구글가입자")}
          title="구글 로그인"
          style={{
            width: "42px", /* 소셜 로그인 축소 */
            height: "42px", /* 소셜 로그인 축소 */
            background: "#ffffff",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
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
