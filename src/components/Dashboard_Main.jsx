// src/components/Dashboard_Main.jsx
import React, { useState, useEffect } from "react";
import { useFitProfile } from "../context/FitProfileContext";

export default function Dashboard_Main() {
  const { profile, logout, setStep, updateBasicInfo } = useFitProfile();
  const { basicInfo, measureMethod, directMeasure, dbMeasure, detailedFit } = profile;

  // 서브 라우팅 상태 정의: 'main' | 'category' | 'detail' | 'payment' | 'chat' | 'my'
  const [view, setView] = useState("main");
  const [selectedCategory, setSelectedCategory] = useState("tshirt");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [paymentSource, setPaymentSource] = useState("detail"); // "detail" | "cart"

  // 결제 관련 상태
  const [paymentMethod, setPaymentMethod] = useState("kakao");
  const [shippingInfo, setShippingInfo] = useState({ name: "", phone: "", address: "" });
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [checkoutSize, setCheckoutSize] = useState("L");
  const [shippingMethod, setShippingMethod] = useState("normal"); // 'normal' | 'fast'

  // 내 핏만 보기 필터 상태
  const [showOnlyMyFit, setShowOnlyMyFit] = useState(false);

  // 뱃지 호버 상태 (warning 태그 마우스 호버 시 격차 팝업 복원용)
  const [hoveredBadgeProductId, setHoveredBadgeProductId] = useState(null);

  // 마이페이지 인터랙션용 플로팅 토스트 공지 상태
  const [myPageToast, setMyPageToast] = useState("");

  // [추가] 이미지 로드 실패 상품 트래킹 상태 (실패 시 세련된 디폴트 SVG로 자동 치환)
  const [failedImages, setFailedImages] = useState({});

  // [추가] 글로벌 자동 소멸형 토스트 공용 헬퍼 함수
  const triggerToast = (msg) => {
    setMyPageToast(msg);
    setTimeout(() => {
      setMyPageToast("");
    }, 2500);
  };

  // [추가] 프로토타입 미구성용 커스텀 모달 알림 상태
  const [activeAlert, setActiveAlert] = useState("");

  // [추가] 줄서기 제품 24시간 카운트다운 타이머 상태 (23:39:42 = 85182초)
  const [countdownSeconds, setCountdownSeconds] = useState(85182);

  // [추가] 실시간 째깍거리는 카운트다운 타이머 (매초 구동)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 85182));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // [추가] 재판매 및 줄서기 제품 제어용 상태
  const [resellWear, setResellWear] = useState("worn"); // 'worn' | 'new'
  const [resellDefect, setResellDefect] = useState("none"); // 'none' | 'some' | 'yes'
  const [resellPrice, setResellPrice] = useState("248,000");
  const [queueTab, setQueueTab] = useState("alert"); // 'detail' | 'alert'

  // [추가] 프로필 편집 전용 제어 상태값
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editUsualSize, setEditUsualSize] = useState("");

  // 좋아요 상품 ID 목록 관리 상태 (시각적 완성을 위해 첫 상품은 미리 켜둠)
  const [likedProductIds, setLikedProductIds] = useState(["prod1"]);

  // 좋아요 토글 핸들러 (e.stopPropagation()을 병행하여 상세 페이지 이동 충돌 방지)
  const toggleLikeProduct = (productId) => {
    setLikedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // 시안과 100% 똑같은 가상 상품 확장 DB 리스트 (2행 가로 스크롤 표현용)
  const productList = [
    // ------------------------------------------
    // 1. [티셔츠] - tshirt
    // ------------------------------------------
    {
      id: "prod1",
      brand: "Bape",
      name: "베이프 컬리지 티셔츠 블랙 (College Tee Black)",
      category: "tshirt",
      price: "125,000",
      size: "l",
      image: "/bape_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 29,
      type: "tee",
      measurements: { shoulder: 49, chest: 54, length: 73, sleeve: 22 }
    },
    {
      id: "prod2",
      brand: "Bape",
      name: "베이프 컬리지 티셔츠 화이트 (College Tee White)",
      category: "tshirt",
      price: "125,000",
      size: "m",
      image: "/bape_2.png",
      availableSizes: ["M", "L", "XL"],
      likes: 31,
      type: "tee",
      measurements: { shoulder: 46, chest: 51, length: 70, sleeve: 21 }
    },
    {
      id: "prod3",
      brand: "Adidas",
      name: "아디다스 와플 숏슬리브 폴로 셔츠 네이비 (Waffle Polo Navy)",
      category: "tshirt",
      price: "109,000",
      size: "l",
      image: "/adidas_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 42,
      type: "tee",
      measurements: { shoulder: 48, chest: 55, length: 72, sleeve: 23 }
    },
    {
      id: "prod4",
      brand: "Polo Ralph Lauren",
      name: "폴로 랄프 로렌 칠드런 미니 케이블 코튼 가디건 헌터 네이비 (Mini Cable Cardigan)",
      category: "tshirt",
      price: "159,000",
      size: "l",
      image: "/polo_1.png",
      availableSizes: ["S", "M", "L"],
      likes: 35,
      type: "sweater",
      measurements: { shoulder: 45, chest: 52, length: 68, sleeve: 60 }
    },
    {
      id: "prod5",
      brand: "Polo Ralph Lauren",
      name: "폴로 랄프 로렌 클래식 핏 가먼트 다이드 옥스포드 셔츠 화이트 (Oxford Shirt White)",
      category: "tshirt",
      price: "179,000",
      size: "l",
      image: "/polo_2.png",
      availableSizes: ["M", "L", "XL"],
      likes: 48,
      type: "tee",
      measurements: { shoulder: 47, chest: 56, length: 75, sleeve: 62 }
    },
    {
      id: "prod6",
      brand: "Levi's",
      name: "리바이스 X 오아시스 데카 로고 티셔츠 블랙 (Levi's X Oasis Deca Logo Tee Black)",
      category: "tshirt",
      price: "69,000",
      size: "l",
      image: "/levis_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 45,
      type: "tee",
      measurements: { shoulder: 50, chest: 56, length: 72, sleeve: 23 }
    },
    {
      id: "prod7",
      brand: "Carhartt",
      name: "칼하트 루즈 핏 헤비웨이트 레귤러 숏슬리브 포켓 티셔츠 화이트 (Heavyweight Pocket Tee)",
      category: "tshirt",
      price: "48,000",
      size: "xl",
      image: "/car_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 27,
      type: "tee",
      measurements: { shoulder: 52, chest: 58, length: 76, sleeve: 24 }
    },

    // ------------------------------------------
    // 2. [후드/맨투맨] - hoodie
    // ------------------------------------------
    {
      id: "prod8",
      brand: "Stussy",
      name: "스투시 베이직 스투시 후드 블랙 (Basic Hoodie Black)",
      category: "hoodie",
      price: "185,000",
      size: "l",
      image: "/stussy_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 55,
      type: "hoodie",
      measurements: { shoulder: 52, chest: 61, length: 71, sleeve: 64 }
    },
    {
      id: "prod9",
      brand: "IAB Studio",
      name: "아이앱 스튜디오 25 후드 라이트 그레이 (IAB Hoodie Gray)",
      category: "hoodie",
      price: "148,000",
      size: "l",
      image: "/iab_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 72,
      type: "hoodie",
      measurements: { shoulder: 53, chest: 63, length: 70, sleeve: 63 }
    },
    {
      id: "prod10",
      brand: "AMI",
      name: "아미 스몰 하트 로고 스웨트셔츠 블랙 (Small Heart Sweatshirt)",
      category: "hoodie",
      price: "320,000",
      size: "l",
      image: "/ami_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 38,
      type: "sweater",
      measurements: { shoulder: 49, chest: 57, length: 69, sleeve: 62 }
    },
    {
      id: "prod11",
      brand: "Maison Kitsune",
      name: "메종 키츠네 더블 폭스 헤드 패치 클래식 스웨트셔츠 앤트러사이트 (Double Fox Sweatshirt)",
      category: "hoodie",
      price: "280,000",
      size: "m",
      image: "/kit_1.png",
      availableSizes: ["S", "M", "L"],
      likes: 41,
      type: "sweater",
      measurements: { shoulder: 47, chest: 55, length: 68, sleeve: 61 }
    },
    {
      id: "prod12",
      brand: "Nike",
      name: "나이키 파크 크루 스웨트셔츠 블랙 (Park Crew Sweatshirt)",
      category: "hoodie",
      price: "59,000",
      size: "l",
      image: "/nike_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 29,
      type: "sweater",
      measurements: { shoulder: 48, chest: 56, length: 71, sleeve: 63 }
    },
    {
      id: "prod13",
      brand: "Essentials",
      name: "에센셜 더 코어 컬렉션 후드 라이트 오트밀 (Core Hoodie Oatmeal)",
      category: "hoodie",
      price: "189,000",
      size: "l",
      image: "/ess_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 64,
      type: "hoodie",
      measurements: { shoulder: 56, chest: 65, length: 72, sleeve: 65 }
    },

    // ------------------------------------------
    // 3. [아우터] - outer
    // ------------------------------------------
    {
      id: "prod14",
      brand: "Bape",
      name: "베이프 퍼스트 카모 샤크 풀 집 후드 아미 그린 (Shark Full Zip Hoodie)",
      category: "outer",
      price: "580,000",
      size: "xl",
      image: "/bape_3.png",
      availableSizes: ["M", "L", "XL"],
      likes: 52,
      type: "outer",
      measurements: { shoulder: 52, chest: 61, length: 74, sleeve: 66 }
    },
    {
      id: "prod15",
      brand: "Arc'teryx",
      name: "아크테릭스 스쿼미시 후디 블랙 (Squamish Hoody Black)",
      category: "outer",
      price: "259,000",
      size: "l",
      image: "/arc_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 63,
      type: "outer",
      measurements: { shoulder: 50, chest: 58, length: 73, sleeve: 65 }
    },
    {
      id: "prod16",
      brand: "Montbell",
      name: "몽벨 윈드 클라스트 후드 자켓 블랙 (Wind Blast Hooded Jacket)",
      category: "outer",
      price: "119,000",
      size: "l",
      image: "/mongbell_1.png",
      availableSizes: ["M", "L", "XL"],
      likes: 34,
      type: "outer",
      measurements: { shoulder: 48, chest: 56, length: 71, sleeve: 64 }
    },
    {
      id: "prod17",
      brand: "Adidas",
      name: "아디다스 와플 베켄바우어 트랙탑 원더 화이트 (Waffle Beckenbauer Tracktop)",
      category: "outer",
      price: "169,000",
      size: "l",
      availableSizes: ["M", "L", "XL"],
      likes: 88,
      type: "outer",
      measurements: { shoulder: 49, chest: 57, length: 70, sleeve: 63 }
    },
    {
      id: "prod18",
      brand: "Musinsa Standard",
      name: "무신사 스탠다드 시티 레저 후드 라이트 다운 자켓 클라우디 블루 (Light Down Jacket)",
      category: "outer",
      price: "99,900",
      size: "l",
      availableSizes: ["M", "L", "XL"],
      likes: 19,
      type: "outer",
      measurements: { shoulder: 50, chest: 58, length: 71, sleeve: 64 }
    },
    {
      id: "prod19",
      brand: "Diesel",
      name: "디젤 S-지니-집-Od 집업 스웨트셔츠 블랙 (S-Giny-Zip-Od Sweatshirt)",
      category: "outer",
      price: "245,000",
      size: "l",
      availableSizes: ["M", "L", "XL"],
      likes: 31,
      type: "outer",
      measurements: { shoulder: 48, chest: 56, length: 68, sleeve: 62 }
    },

    // ------------------------------------------
    // 4. [바지] - pants (유저 보존용)
    // ------------------------------------------
    {
      id: "prod20",
      brand: "Levi's",
      name: "리바이스 501 오리지널 스트레이트 데님 (Original Denim Pants)",
      category: "pants",
      price: "129,000",
      size: "32",
      availableSizes: ["30", "32", "34"],
      likes: 35,
      type: "pants",
      measurements: { shoulder: 41, chest: 33, length: 101, sleeve: 29 }
    },
    {
      id: "prod21",
      brand: "Bape",
      name: "베이프 카모 와이드 카고 팬츠 (Camo Wide Cargo Pants)",
      category: "pants",
      price: "345,000",
      size: "m",
      image: "/bape1.png",
      availableSizes: ["S", "M"],
      likes: 22,
      type: "pants",
      measurements: { shoulder: 40, chest: 35, length: 98, sleeve: 28 }
    },

    // ------------------------------------------
    // 5. [신발 및 기타] - shoes, accessories, other (동선 연결 유지용 보존)
    // ------------------------------------------
    {
      id: "prod22",
      brand: "Salomon",
      name: "살로몬 XT-위스퍼 블랙 아스팔트 (Salomon XT-Whisper Black Asphalt)",
      category: "shoes",
      price: "248,000",
      size: "270",
      image: "/salomon.png",
      availableSizes: ["260", "270", "280"],
      likes: 45,
      type: "shoes",
      measurements: { shoulder: 0, chest: 0, length: 0, sleeve: 0 }
    },
    {
      id: "prod23",
      brand: "Dr.Martens",
      name: "닥터마틴 1461 스무스 블랙 (Dr.Martens 1461 Smooth Black)",
      category: "shoes",
      price: "190,000",
      size: "265",
      image: "/martin_1.webp",
      availableSizes: ["255", "265", "275"],
      likes: 32,
      type: "derby",
      measurements: { shoulder: 0, chest: 0, length: 0, sleeve: 0 }
    },
    {
      id: "prod24",
      brand: "Hysteric Glamour",
      name: "히스테릭 글래머 로고 스터드 트라이폴드 월렛 블랙 (Studded Trifold Wallet)",
      category: "other",
      price: "128,000",
      size: "free",
      image: "/hys_1.webp",
      availableSizes: ["FREE"],
      likes: 19,
      type: "wallet",
      measurements: { shoulder: 0, chest: 0, length: 0, sleeve: 0 }
    },
    {
      id: "prod25",
      brand: "Hysteric Glamour",
      name: "히스테릭 글래머 기타 걸 메쉬 캡 블랙 (Guitar Girl Mesh Cap Black)",
      category: "other",
      price: "158,000",
      size: "free",
      image: "/hys_2.webp",
      availableSizes: ["FREE"],
      likes: 54,
      type: "cap",
      measurements: { shoulder: 0, chest: 0, length: 0, sleeve: 0 }
    }
  ];

  // 추천 상품에 실제 일러스트레이션이 들어갈 수 있도록 커스텀 SVG 드로잉 컴포넌트 제공
  const renderProductImage = (product) => {
    // [추가] 유저 커스텀 실물 사진 이미지 지원 분기 (로딩 실패 상태가 아닐 때만 노출)
    if (product.image && !failedImages[product.id]) {
      // [피드백 반영] 이미지들의 크기가 각양각색으로 렌더링되던 한계를 해결하기 위해 카테고리별 동적 표준 패딩 및 스케일 설계!
      let imgPadding = "10px";
      let imgScale = "1.0";

      if (product.category === "shoes") {
        imgPadding = "20px"; // 신발 이미지가 거대하게 렌더링되어 튀는 현상을 막기 위해 깊은 패딩 제공
        imgScale = "0.95";
      } else if (product.category === "other") {
        imgPadding = "18px"; // 모자, 지갑 등 잡화류도 시각적인 비율 밸런스를 맞추기 위해 조율
        imgScale = "0.95";
      } else if (product.category === "pants") {
        imgPadding = "12px";
      }

      return (
        <div style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          padding: imgPadding, // 동적 맞춤형 패딩 적용!
          boxSizing: "border-box"
        }}>
          <img
            src={product.image}
            alt={product.name}
            onError={() => {
              // 이미지 로딩 실패 시 즉시 failedImages 상태에 등록하여 디폴트 SVG 와이어프레임이 등판하게끔 조치!
              setFailedImages(prev => ({ ...prev, [product.id]: true }));
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // 줌인 잘림 없이 전체 실물이 다 들어오게 비율 유지
              transform: `scale(${imgScale})`, // 동적 배율 조율!
              display: "block"
            }}
          />
        </div>
      );
    }

    switch (product.type) {
      case "sweater":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#e2e8f0", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#e2e8f0" />
            <path d="M 30,40 L 48,32 Q 54,38 60,38 Q 66,38 72,32 L 90,40 L 84,62 L 76,60 L 76,100 L 44,100 L 44,60 L 36,62 Z" fill="#64748b" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
            <line x1="44" y1="96" x2="76" y2="96" stroke="#334155" strokeWidth="2" />
            <line x1="36" y1="58" x2="42" y2="56" stroke="#334155" strokeWidth="2" />
            <line x1="84" y1="58" x2="78" y2="56" stroke="#334155" strokeWidth="2" />
          </svg>
        );
      case "tee":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#f1f5f9", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#f1f5f9" />
            <path d="M 32,38 L 48,30 Q 54,36 60,36 Q 66,36 72,30 L 88,38 L 83,58 L 76,56 L 76,98 L 44,98 L 44,56 L 37,58 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 50,50 Q 60,48 70,52 M 48,58 Q 60,56 72,60" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );
      case "hoodie":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#cbd5e1", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#cbd5e1" />
            <path d="M 30,42 L 48,32 Q 54,38 60,38 Q 66,38 72,32 L 90,42 L 84,65 L 76,62 L 76,100 L 44,100 L 44,62 L 36,65 Z" fill="#475569" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 44,32 C 44,18 76,18 76,32" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 48,76 L 72,76 L 76,92 L 44,92 Z" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        );
      case "pants":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#f1f5f9", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#f1f5f9" />
            <path d="M 40,25 L 80,25 L 84,60 L 84,102 L 63,102 L 63,58 L 57,58 L 57,102 L 36,102 L 36,60 Z" fill="#334155" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
            <line x1="40" y1="32" x2="80" y2="32" stroke="#0f172a" strokeWidth="2" />
          </svg>
        );
      case "shoes":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#fef3c7", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#fef3c7" />
            <path d="M 25,82 L 95,82 Q 98,82 98,78 Q 98,74 95,74 L 25,74 Q 22,74 22,78 Q 22,82 25,82 Z" fill="#ffffff" stroke="#78350f" strokeWidth="2.5" />
            <path d="M 25,74 Q 20,55 35,45 L 65,45 Q 75,50 82,60 L 95,74 Z" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
            <path d="M 40,65 Q 60,48 85,55 Q 65,65 48,70" fill="#ffffff" stroke="#78350f" strokeWidth="2" />
            <line x1="50" y1="45" x2="56" y2="55" stroke="#ffffff" strokeWidth="2" />
            <line x1="56" y1="45" x2="62" y2="55" stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case "derby":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#e2e8f0", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#e2e8f0" />
            <path d="M 22,84 L 98,84 Q 100,84 100,80 L 96,76 L 24,76 Q 20,76 20,80 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
            <path d="M 24,76 Q 22,58 38,52 L 72,56 Q 82,62 96,76 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 32,58 Q 42,56 52,60" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="62" cy="60" r="1.5" fill="#f59e0b" />
            <circle cx="68" cy="62" r="1.5" fill="#f59e0b" />
          </svg>
        );
      case "cap":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#fef3c7", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#fef3c7" />
            <path d="M 50,75 C 20,75 20,85 50,85 C 80,85 100,75 100,75 Z" fill="#92400e" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 45,75 Q 40,40 70,40 Q 95,40 98,75 Z" fill="#b45309" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="70" cy="38" r="4" fill="#78350f" />
          </svg>
        );
      case "keyring":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#e2e8f0", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#e2e8f0" />
            <circle cx="60" cy="40" r="14" fill="none" stroke="#475569" strokeWidth="3" />
            <line x1="60" y1="54" x2="60" y2="70" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="42" y="70" width="36" height="36" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="60" cy="88" r="8" fill="#ef4444" />
          </svg>
        );
      case "outer":
        return (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ background: "#cbd5e1", display: "block" }}>
            <rect width="120" height="120" rx="0" fill="#cbd5e1" />
            {/* 자켓 몸체 프레임 */}
            <path d="M 30,42 L 48,34 Q 54,40 60,40 Q 66,40 72,34 L 90,42 L 85,96 L 35,96 Z" fill="#0f172a" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
            {/* 정중앙 지퍼 스트로크 라인 */}
            <line x1="60" y1="40" x2="60" y2="96" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            {/* 좌우 지퍼 주머니 디테일 */}
            <path d="M 38,72 L 48,72 M 72,72 L 82,72" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* 넥 카라 후디 아웃라인 */}
            <path d="M 44,34 C 44,22 76,22 76,34" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      default:
        return <div style={{ fontSize: "32px" }}>🧥</div>;
    }
  };

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
      return {
        text: `${worstFieldLabel} 주의`
      };
    }
    return null;
  };

  const getFitGrade = (product) => {
    const { maxDiff } = getProductMaxDiff(product);
    if (maxDiff <= 2.2) return { grade: "s+" };
    if (maxDiff <= 3.5) return { grade: "s" };
    if (maxDiff <= 4.5) return { grade: "a+" };
    if (maxDiff <= 6.0) return { grade: "a" };
    return { grade: "b" };
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
    if (id === "slim") return "slim-fit";
    if (id === "over") return "over-fit";
    return "regular-fit";
  };

  const getMatchPercent = (product) => {
    const { maxDiff } = getProductMaxDiff(product);
    return Math.max(65, Math.round(100 - (maxDiff * 5.5)));
  };

  // ==========================================
  // 시안 기준의 글로벌 상단 헤더 (1번 화이트바 삭제)
  // ==========================================
  const renderGlobalHeader = () => {
    if (view === "payment" || view === "resell_register" || view === "queue_product") return null;

    const categories = [
      { id: "tshirt", label: "shirts" },
      { id: "hoodie", label: "hoodie" },
      { id: "outer", label: "outer" },
      { id: "pants", label: "pants" },
      { id: "shoes", label: "shoes" },
      { id: "other", label: "other" }
    ];

    const showCategories = view === "main" || view === "category";

    return (
      <div style={{ background: "#000000", width: "100%", userSelect: "none" }}>
        {/* 상단 1열: GUBI 로그인 화면 원조 로고 & 세련된 라인아트 쇼핑카트/프로필 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: (view === "my" || view === "saved") ? "none" : "1px solid rgba(255,255,255,0.1)"
        }}>
          {/* 로그인 화면 로고와 100% 동일한 GUBI 원조 이미지 로고 탑재! */}
          <div
            onClick={() => { setView("main"); setSelectedProduct(null); }}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img
              src="/gubi_logo.png"
              alt="GUBI Logo"
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                mixBlendMode: "screen",
                filter: "contrast(1.2) grayscale(100%)",
                display: "block"
              }}
            />
          </div>

          {/* 우측 얇은 고품격 라인아트 장바구니 & 프로필 아이콘 */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* 🛒 쇼핑카트 라인아트 (카운팅 뱃지 장착!) */}
            <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={() => { setSelectedProduct(null); setSelectedCartIds(cartItems.map(item => item.cartId)); setView("cart"); }}>
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={view === "cart" ? "2.3" : "1.8"} strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" fill="#ffffff" />
                <circle cx="20" cy="21" r="1" fill="#ffffff" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartItems.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "8px",
                  fontFamily: "var(--font-pixel), monospace",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "14px",
                  height: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
                }}>
                  {cartItems.length}
                </div>
              )}
            </div>

            {/* 👤 프로필 라인아트 */}
            <svg
              onClick={() => setView("my")}
              style={{ cursor: "pointer" }}
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={view === "my" ? "2.3" : "1.8"} strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* [추가] 마이페이지 중앙 타이틀 명세 */}
        {view === "my" && (
          <div style={{
            textAlign: "center",
            padding: "0 0 20px 0",
            fontFamily: "var(--font-pixel)",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "1.5px"
          }}>
            MY PAGE
          </div>
        )}

        {/* [추가] 저장목록 중앙 타이틀 명세 */}
        {view === "saved" && (
          <div style={{
            textAlign: "center",
            padding: "0 0 20px 0",
            fontFamily: "var(--font-pixel)",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "1.5px"
          }}>
            SAVED
          </div>
        )}

        {/* 상단 2열: 픽셀 카테고리 메뉴 목록 (메인 및 카테고리 화면일 때만 렌더링!) */}
        {showCategories && (
          <div style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            padding: "10px 16px",
            scrollbarWidth: "none",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}>
            {categories.map((cat) => {
              const isActive = view === "category" && selectedCategory === cat.id;
              return (
                <span
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setView("category");
                  }}
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "9px",
                    color: isActive ? "#ffffff" : "#a1a1aa",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderBottom: isActive ? "1px solid #ffffff" : "none",
                    paddingBottom: "2px"
                  }}
                >
                  {cat.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // 시안 1번 레퍼런스와 100% 동일하게 복제한 블랙 카드 렌더링 헬퍼
  // ==========================================
  const renderProductCard = (product) => {
    const badge = getFitBadge(product);
    const matchRate = getMatchPercent(product);
    const comp = getComparison(product);

    // 시안 2번의 픽셀 영문 태그 (warning을 4글자인 warn으로 단축하여 카라 침범 전면 봉쇄!)
    const tagText = badge ? "warn" : "good";
    const tagBgColor = badge ? "#dc2626" : "#16a34a"; // 한층 더 트렌디한 적색/녹색

    // 좋아요 활성화 여부
    const isLiked = likedProductIds.includes(product.id);

    // [피드백 반영] 신발 및 잡화 탭은 가상 핏 피팅 서비스를 지원하지 않으므로 배지(good/warn) 노출을 전면 방어!
    const isFitSupported = product.category !== "shoes" && product.category !== "other";

    return (
      <div
        key={product.id}
        onClick={() => {
          // [피드백 반영] 신발 및 기타 잡화 상품은 실측 피팅 서비스를 미지원하므로 진입 차단 처리!
          if (product.category === "shoes" || product.category === "other") {
            triggerToast("신발 및 잡화 상품은 실측 피팅 기능을 제공하지 않습니다.");
            return;
          }
          setSelectedProduct(product);
          setView("detail");
        }}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          width: "155px",
          border: "2px solid #000000",
          background: "#000000", // 올 블랙 칠하기를 통해 어설픈 흰색 밑 띠 완벽 박멸!
          userSelect: "none",
          position: "relative"
        }}
      >
        {/* 상단 이미지 영역 */}
        <div style={{
          width: "100%",
          height: "155px",
          position: "relative",
          background: "#f3f4f6",
          borderBottom: "2px solid #000000",
          overflow: "hidden"
        }}>
          {/* good/warn 픽셀 태그 칼 정렬 (마우스 호버 이벤트 연결 및 가상 피팅 지원 상품만 활성화!) */}
          {isFitSupported && (
            <div
              onMouseEnter={() => setHoveredBadgeProductId(product.id)}
              onMouseLeave={() => setHoveredBadgeProductId(null)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                background: tagBgColor,
                color: "#ffffff",
                padding: "2.5px 6px", // [피드백 적극 반영] 카라 침범 없이 귀엽고 단단하게 축소된 패딩
                fontSize: "7.5px", // 마이크로 픽셀 사이즈로 깃털처럼 가볍게 표현
                fontFamily: "var(--font-pixel), monospace", // 시그니처 힙한 픽셀 폰트 완벽 복원!
                zIndex: 10,
                textTransform: "lowercase", // 트렌디한 소문자 칼정렬
                letterSpacing: "0.2px",
                cursor: "help",
                borderRadius: "0 0 4px 0" // 우하단 모서리에 슬림한 라운딩 포인트
              }}
            >
              {tagText}
            </div>
          )}

          {/* 팝업 오버레이 툴팁 (warning 태그 호버 시 복원!) */}
          {hoveredBadgeProductId === product.id && badge && (
            <div style={{
              position: "absolute",
              top: "28px",
              left: "8px",
              background: "rgba(0, 0, 0, 0.95)",
              color: "#ffffff",
              border: "1px solid #ffffff",
              padding: "8px 10px",
              zIndex: 100,
              width: "135px",
              pointerEvents: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
            }}>
              <div style={{ fontSize: "7px", fontFamily: "var(--font-pixel)", color: "#ef4444", marginBottom: "4px", fontWeight: "bold" }}>
                FIT WARNING
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "8.5px" }}>
                <div>어깨차이: {comp.shoulderDiff > 0 ? `+${comp.shoulderDiff}` : comp.shoulderDiff}cm</div>
                <div>가슴차이: {comp.chestDiff > 0 ? `+${comp.chestDiff}` : comp.chestDiff}cm</div>
                <div>총장차이: {comp.lengthDiff > 0 ? `+${comp.lengthDiff}` : comp.lengthDiff}cm</div>
              </div>
            </div>
          )}



          {/* 맞춤형 고품격 SVG 일러스트 */}
          {renderProductImage(product)}
        </div>

        {/* 하단 올 블랙 정보 영역 (1번 사진과 100% 동일하게 브랜드, 하트+Saved 카운트 병렬 배치 완벽 실현!) */}
        <div style={{
          background: "#000000",
          padding: "12px 10px 10px 10px",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "84px", // 모든 카드 텍스트 레이아웃의 높이를 칼같이 통일화!
          boxSizing: "border-box"
        }}>
          {/* Row 1: 브랜드명(백색, 볼드 해제, 연하게 반투명) & 하트(Saved) on/off 토글 + 픽셀 카운트 병렬 정렬 */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "14px"
          }}>
            {/* 브랜드명 볼드체 해제 및 명품 반투명 디밍 적용 */}
            <span style={{
              fontSize: "10.5px",
              color: "rgba(255, 255, 255, 0.55)", // 훨씬 더 연하고 세련된 그레이시 스킨
              fontWeight: "normal",
              letterSpacing: "-0.2px"
            }}>
              {product.brand}
            </span>

            {/* 하트(Saved) 토글 아이콘 + 픽셀 카운트 가로 병합 */}
            <div
              onClick={(e) => {
                e.stopPropagation(); // 카드 상세페이지 내비게이션 전파 차단!
                toggleLikeProduct(product.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: "2px 0"
              }}
            >
              {isLiked ? (
                // Saved ON: 빨갛게 가득 찬 하트
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                // Saved OFF: 백색 얇은 라인아트 하트 (1번 사진과 동일)
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
              {/* 픽셀 감성 넘치는 3000+식 카운트 텍스트 */}
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                color: "#ffffff",
                fontWeight: "bold",
                letterSpacing: "-0.5px"
              }}>
                {product.likes + (likedProductIds.includes(product.id) ? 1 : 0)}
              </span>
            </div>
          </div>

          {/* Row 2: 상품명 (품목 볼드체 해제 완료, 1줄/2줄 관계없이 24px 높이로 대칭 고정) */}
          <p style={{
            fontSize: "9px",
            color: "#ffffff",
            fontWeight: "normal", // 요청사항에 맞춰 볼드체 깔끔하게 제거!
            margin: 0,
            height: "24px", // 높이를 고정하여 어떤 상황에서도 브랜드와 가격 위치 대칭 통일!
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.3",
            wordBreak: "keep-all"
          }}>
            {product.name}
          </p>

          {/* Row 3: 가격 정보 (대칭 배치를 위해 height 12px 명시) */}
          <span style={{
            fontSize: "10.5px",
            fontFamily: "var(--font-pixel)",
            color: "#ffffff",
            display: "block",
            letterSpacing: "-0.5px",
            height: "12px"
          }}>
            {product.price}
          </span>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 1: MAIN PAGE (시안 기준 전면 리뉴얼)
  // ==========================================
  const renderMainView = () => {
    // 유저 수정 요청: 카테고리 4개 (티셔츠, 후드/맨투맨, 아우터, 바지) + 스포츠 + NEW + HOT + 판매
    const circularCategories = [
      { id: "tshirt", label: "티셔츠", type: "tee" },
      { id: "hoodie", label: "후드/맨투맨", type: "hoodie" },
      { id: "outer", label: "아우터", type: "outer" },
      { id: "pants", label: "바지", type: "pants" },
      { id: "sports", label: "스포츠", type: "sports" },
      { id: "new", label: "NEW", type: "new" },
      { id: "hot", label: "HOT", type: "hot" },
      { id: "sell", label: "판매", type: "sell" }
    ];

    // 카테고리 내부 SVG 렌더링 맵 (블랙 원형에 맞춰 눈부신 화이트 아웃라인 스트로크로 대수술 완료!)
    const renderCategoryCircleIcon = (type) => {
      switch (type) {
        case "tee":
          return (
            <svg width="34" height="34" viewBox="0 0 100 100" style={{ display: "block" }}>
              <path d="M 20,28 L 36,20 Q 42,26 50,26 Q 58,26 64,20 L 80,28 L 74,46 L 66,44 L 66,85 L 34,85 L 34,44 L 26,46 Z" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        case "hoodie":
          return (
            <svg width="34" height="34" viewBox="0 0 100 100" style={{ display: "block" }}>
              <path d="M 20,32 L 34,22 L 50,30 L 66,22 L 80,32 L 74,52 L 68,50 L 68,85 L 32,85 L 32,50 L 26,52 Z" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 32,24 C 32,10 68,10 68,24" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 45,30 L 45,45 M 55,30 L 55,45" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 40,65 L 60,65 L 64,78 L 36,78 Z" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        case "outer":
          return (
            <svg width="34" height="34" viewBox="0 0 100 100" style={{ display: "block" }}>
              <path d="M 18,26 L 36,18 Q 42,25 50,25 Q 58,25 64,18 L 82,26 L 76,46 L 68,44 L 68,85 L 32,85 L 32,44 L 24,46 Z" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="50" y1="25" x2="50" y2="85" stroke="#ffffff" strokeWidth="5" />
              <rect x="36" y="50" width="10" height="12" fill="none" stroke="#ffffff" strokeWidth="4" />
              <rect x="54" y="50" width="10" height="12" fill="none" stroke="#ffffff" strokeWidth="4" />
            </svg>
          );
        case "pants":
          return (
            <svg width="34" height="34" viewBox="0 0 100 100" style={{ display: "block" }}>
              <path d="M 30,15 L 70,15 L 74,48 L 74,85 L 53,85 L 53,46 L 47,46 L 47,85 L 26,85 L 26,48 Z" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="30" y1="22" x2="70" y2="22" stroke="#ffffff" strokeWidth="4.5" />
            </svg>
          );
        case "sports":
          return (
            <svg width="34" height="34" viewBox="0 0 100 100" style={{ display: "block" }}>
              <path d="M 25,60 C 25,25 75,25 75,60 Z" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 72,55 Q 88,57 92,67 Q 85,73 70,64" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="30" r="5" fill="#ffffff" />
            </svg>
          );
        case "new":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        case "hot":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          );
        case "sell":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <circle cx="7" cy="7" r="1.5" fill="#ffffff" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff" }}>

        {/* 1. BEST ITEM 배너 (좌우 화살표 절대배치 및 텍스트 상하 수직 중앙 정렬로 100% 매칭!) */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "150px",
          backgroundImage: "url('/best_item_banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // 가로 중앙 정렬!
          color: "#ffffff"
        }}>
          {/* 어두운 스캔라인 및 반투명 오버레이 */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none"
          }} />

          {/* 배너 화살표 좌 (시안처럼 양 끝 절대 배치) */}
          <span style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            cursor: "pointer",
            zIndex: 2,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            fontWeight: "bold",
            fontFamily: "var(--font-pixel)"
          }}>&lt;</span>

          {/* 중앙 수직 텍스트 정렬 (~10% 할인을 rgba 디밍 효과로 시크하게 조정 완료!) */}
          <div style={{ textAlign: "center", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "18px",
              fontWeight: "normal",
              margin: "0 0 6px 0",
              letterSpacing: "1.5px",
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0,0,0,0.9)"
            }}>
              BEST ITEM
            </h2>
            <p style={{
              fontSize: "10.5px",
              color: "rgba(255, 255, 255, 0.72)", // ~10% 할인 문구 세련되게 디밍 처리!
              margin: 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
              letterSpacing: "-0.2px"
            }}>
              ~10% 할인
            </p>
          </div>

          {/* 배너 화살표 우 (시안처럼 양 끝 절대 배치) */}
          <span style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            cursor: "pointer",
            zIndex: 2,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            fontWeight: "bold",
            fontFamily: "var(--font-pixel)"
          }}>&gt;</span>
        </div>

        {/* 2. 원형 카테고리 8종 메뉴 (상단에 '카테고리' 소제목 통일성 부여!) */}
        <div style={{
          background: "#ffffff",
          padding: "28px 16px 20px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          textAlign: "left"
        }}>
          {/* 추천 상품 및 브랜드와 완벽 통일성을 주는 카테고리 제목 */}
          <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111111", margin: "0 0 16px 0" }}>
            카테고리
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            rowGap: "24px",
            columnGap: "12px",
          }}>
            {circularCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => {
                  // [피드백 반영] 스포츠, NEW, HOT, 판매 4개 카테고리는 클릭 시 준비중 토스트로 차단!
                  if (cat.id === "sports" || cat.id === "new" || cat.id === "hot" || cat.id === "sell") {
                    triggerToast(`"${cat.label}" 서비스는 준비 중입니다.`);
                    return;
                  }

                  // [오류 해결] 개편된 간결한 카테고리 체계(tshirt, hoodie, outer, pants)로 1:1 다이렉트 매칭!
                  setSelectedCategory(cat.id);
                  setView("category");
                }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
              >
                {/* 원형 아이콘 플레이트 (딥 블랙 원형 스킨 + 모던 부유 섀도우) */}
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#000000",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  {renderCategoryCircleIcon(cat.type)}
                </div>
                {/* 카테고리 라벨 검정 글씨 유지 */}
                <span style={{ fontSize: "8.5px", color: "#111111", marginTop: "8px", textAlign: "center", whiteSpace: "nowrap", letterSpacing: "-0.2px", fontWeight: "600" }}>
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 추천 상품 리스트 (2행 가로 스크롤 레이아웃) */}
        <div style={{ padding: "28px 0 28px 16px", textAlign: "left", background: "#ffffff" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111111", margin: "0 0 20px 0" }}>
            추천 상품
          </h3>

          {/* 2행 가로 스크롤 컨테이너 */}
          <div style={{
            display: "grid",
            gridTemplateRows: "repeat(2, auto)",
            gridAutoFlow: "column",
            gap: "20px 16px",
            overflowX: "auto",
            paddingRight: "16px",
            scrollbarWidth: "none"
          }}>
            {productList.map((product) => renderProductCard(product))}
          </div>
        </div>

        {/* 4. Brand 관 (횡형 스크롤 슬라이더 대개편 & 실제 로고 100% 코딩 내장 완벽 구현) */}
        <div style={{ padding: "0 0 28px 16px", textAlign: "left", background: "#ffffff" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111111", margin: "0 0 16px 0" }}>
            Brand
          </h3>

          <div style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingRight: "16px",
            scrollbarWidth: "none"
          }}>
            {/* [1] 베이프 BAPE (실물 로고 사진 연동!) */}
            <div
              onClick={() => triggerToast('브랜드관은 준비 중입니다.')}
              style={{
                width: "120px",
                height: "64px",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                flexShrink: 0,
                cursor: "pointer"
              }}
            >
              <img
                src="/bape_logo.png"
                alt="Bape Logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            {/* [2] 폴로 POLO RALPH LAUREN (실물 로고 사진 연동!) */}
            <div
              onClick={() => triggerToast('브랜드관은 준비 중입니다.')}
              style={{
                width: "120px",
                height: "64px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer"
              }}
            >
              <img
                src="/polo_logo.png"
                alt="Polo Logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            {/* [3] 리바이스 LEVI'S (실제 시안 속 레드 뱃윙 실루엣 및 볼드 입체 백색 로고 그대로 구현) */}
            <div
              onClick={() => triggerToast('브랜드관은 준비 중입니다.')}
              style={{
                width: "120px",
                height: "64px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer"
              }}
            >
              <img
                src="/ader_logo.png"
                alt="adererror Logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            {/* [4] 아크테릭스 ARC'TERYX (여백 및 배경 톤 통일 교체) */}
            <div
              onClick={() => triggerToast('브랜드관은 준비 중입니다.')}
              style={{
                width: "120px",
                height: "64px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer"
              }}
            >
              <img
                src="/arc_logo.png"
                alt="arc logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            {/* [5] 나이키 NIKE (클래식 화이트 바탕 + 칠흑색 벡터 스우시) */}
            <div
              onClick={() => triggerToast('브랜드관은 준비 중입니다.')}
              style={{
                width: "120px",
                height: "64px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer"
              }}
            >
              <img
                src="/nike_logo.png"
                alt="nike Logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* 5. Global Footer */}
        <div style={{
          background: "#000000",
          color: "#a1a1aa",
          padding: "20px 16px 36px 16px",
          textAlign: "center",
          fontSize: "8px",
          lineHeight: "1.6"
        }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "12px" }}>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>사업자 정보</span>
            <span>입점/제휴 문의</span>
            <span>인스타그램</span>
          </div>
          <p style={{ margin: 0, fontSize: "7px", color: "var(--text-muted)", fontFamily: "var(--font-pixel)" }}>
            © GUBI AI SMART CLOSET CO.
          </p>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 2: CATEGORY VIEW (카테고리 뷰)
  // ==========================================
  const renderCategoryView = () => {
    const filteredProducts = productList.filter(product => {
      const matchesCategory = product.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!showOnlyMyFit) return true;
      return getFitBadge(product) === null;
    });

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "16px", textAlign: "left" }}>

        {/* 필터 헤더 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <span style={{ fontSize: "11px", color: "#6b7280" }}>
            조회 상품 ({filteredProducts.length})
          </span>

          {/* 내 핏만 보기 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              fontSize: "10.5px",
              color: showOnlyMyFit ? "#16a34a" : "#9ca3af",
              fontWeight: "bold",
              fontFamily: "var(--font-pixel), monospace"
            }}>
              good
            </span>
            <button
              onClick={() => setShowOnlyMyFit(!showOnlyMyFit)}
              style={{
                width: "36px",
                height: "18px",
                borderRadius: "0px",
                background: "transparent",
                border: "1px solid #111111",
                cursor: "pointer",
                position: "relative",
                padding: 0
              }}
            >
              <span style={{
                position: "absolute",
                top: "2px",
                left: showOnlyMyFit ? "20px" : "2px",
                width: "12px",
                height: "12px",
                background: "#111111",
                transition: "all 0.2s"
              }} />
            </button>
          </div>
        </div>

        {/* 2열 그리드 상품 나열 (시안 2번과 동일한 올 블랙 프레임 카드 탑재!) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
          marginBottom: "40px"
        }}>
          {filteredProducts.map((product) => renderProductCard(product))}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: SAVED ITEMS VIEW (관심 상품 뷰)
  // ==========================================
  const renderSavedView = () => {
    // 내가 실제로 좋아요(하트)를 누른 상품들만 필터링!
    const likedProducts = productList.filter(product => likedProductIds.includes(product.id));

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "20px 16px", textAlign: "left", minHeight: "60vh" }}>
        {/* 헤더 */}
        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111111", margin: "0 0 8px 0" }}>
          Saved Items
        </h3>
        <p style={{ fontSize: "10.5px", color: "#6b7280", margin: "0 0 24px 0", letterSpacing: "-0.2px" }}>
          내가 실제로 좋아요 누른 관심 상품 목록입니다 ({likedProducts.length})
        </p>

        {likedProducts.length === 0 ? (
          // 좋아요 누른 상품이 없을 때 세련된 미니멀 프레임 플레이스홀더 제공
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            border: "1px dashed rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.01)",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "28px", marginBottom: "16px" }}>🖤</span>
            <span style={{
              fontSize: "10px",
              fontFamily: "var(--font-pixel)",
              color: "#888888",
              letterSpacing: "-0.2px",
              lineHeight: "1.5"
            }}>
              아직 좋아요를 누른 상품이 없습니다.<br />
              상품 카드의 하트 버튼을 눌러 관심 상품을 등록해 보세요!
            </span>
          </div>
        ) : (
          /* 2열 그리드 상품 나열 (실제 좋아요 누른 카드들만 칼 대칭 렌더링!) */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "14px",
            marginBottom: "40px"
          }}>
            {likedProducts.map((product) => renderProductCard(product))}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW: SHOPPING CART (장바구니 전용 관리 및 결제 연동 페이지)
  // ==========================================
  const renderCartView = () => {
    // 장바구니 선택된 상품 기준 총 금액 계산
    const selectedItems = cartItems.filter(item => selectedCartIds.includes(item.cartId));
    const totalPrice = selectedItems.reduce((sum, item) => {
      const priceNum = parseInt(item.price.replace(/,/g, ""), 10);
      return sum + priceNum;
    }, 0);

    const formattedTotalPrice = totalPrice.toLocaleString();

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "20px 16px", textAlign: "left", minHeight: "70vh", display: "flex", flexDirection: "column" }}>
        {/* 헤더 */}
        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#111111", margin: "0 0 8px 0" }}>
          Shopping Cart
        </h3>
        <p style={{ fontSize: "10.5px", color: "#6b7280", margin: "0 0 24px 0", letterSpacing: "-0.2px" }}>
          장바구니에 담긴 상품 목록입니다 ({cartItems.length})
        </p>

        {cartItems.length === 0 ? (
          // 장바구니가 비었을 때 세련된 일러스트와 안내 및 쇼핑하러 가기 유도 버튼
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            border: "1px dashed rgba(0,0,0,0.15)",
            background: "rgba(0,0,0,0.01)",
            textAlign: "center",
            flex: 1
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span style={{
              fontSize: "10.5px",
              fontFamily: "var(--font-pixel)",
              color: "#888888",
              letterSpacing: "-0.2px",
              lineHeight: "1.6",
              marginBottom: "20px"
            }}>
              장바구니가 비어 있습니다.<br />
              다양한 스트릿 의류를 구경해 보세요!
            </span>
            <button
              onClick={() => setView("main")}
              style={{
                background: "#000000",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                fontSize: "10px",
                fontFamily: "var(--font-pixel)",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          // 장바구니에 아이템이 존재할 때
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            
            {/* 전체 선택 및 선택 삭제 헤더 컨트롤 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 4px 8px 4px",
              borderBottom: "1px solid #f4f4f5",
              marginBottom: "4px"
            }}>
              {/* 전체 선택 체크박스 + 텍스트 */}
              <div
                onClick={() => {
                  if (selectedCartIds.length === cartItems.length) {
                    setSelectedCartIds([]);
                  } else {
                    setSelectedCartIds(cartItems.map(item => item.cartId));
                  }
                }}
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  border: selectedCartIds.length === cartItems.length ? "1.5px solid #000000" : "1.5px solid #a1a1aa",
                  background: selectedCartIds.length === cartItems.length ? "#000000" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "all 0.15s ease"
                }}>
                  {selectedCartIds.length === cartItems.length && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#18181b" }}>
                  전체 선택 ({selectedCartIds.length}/{cartItems.length})
                </span>
              </div>

              {/* 선택 삭제 버튼 */}
              {selectedCartIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCartItems(prev => prev.filter(item => !selectedCartIds.includes(item.cartId)));
                    setSelectedCartIds([]);
                    triggerToast("🗑️ 선택한 상품이 삭제되었습니다.");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease"
                  }}
                >
                  선택 삭제
                </button>
              )}
            </div>

            {/* 상품 리스트 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {cartItems.map((item) => {
                const isSelected = selectedCartIds.includes(item.cartId);
                return (
                  <div
                    key={item.cartId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: "1px solid #e4e4e7",
                      padding: "10px",
                      position: "relative",
                      background: "#ffffff",
                      transition: "all 0.15s ease",
                      borderColor: isSelected ? "#000000" : "#e4e4e7",
                      boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.03)" : "none"
                    }}
                  >
                    {/* 개별 선택 체크박스 */}
                    <div
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCartIds(prev => prev.filter(id => id !== item.cartId));
                        } else {
                          setSelectedCartIds(prev => [...prev, item.cartId]);
                        }
                      }}
                      style={{
                        width: "18px",
                        height: "18px",
                        border: isSelected ? "1.5px solid #000000" : "1.5px solid #a1a1aa",
                        background: isSelected ? "#000000" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "all 0.15s ease"
                      }}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* 상품 썸네일 */}
                    <div style={{ width: "64px", height: "64px", flexShrink: 0, border: "1px solid #f4f4f5", background: "#f3f4f6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "100%", height: "100%", transform: "scale(0.85)" }}>
                        {renderProductImage(item)}
                      </div>
                    </div>

                    {/* 상품 텍스트 정보 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0, textAlign: "left" }}>
                      <span style={{ fontSize: "9px", color: "#a1a1aa", fontWeight: "bold", textTransform: "uppercase" }}>{item.brand}</span>
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: "#18181b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px" }}>
                        <span style={{ fontSize: "9px", background: "#f4f4f5", padding: "1px 6px", border: "1px solid #e4e4e7", fontFamily: "var(--font-pixel)" }}>SIZE: {item.selectedSize}</span>
                        <span style={{ fontSize: "11px", fontWeight: "900", color: "#18181b", fontFamily: "var(--font-pixel)" }}>₩{item.price}</span>
                      </div>
                    </div>

                    {/* 삭제 액션 (X) */}
                    <div
                      onClick={() => {
                        setCartItems(prev => prev.filter(c => c.cartId !== item.cartId));
                        setSelectedCartIds(prev => prev.filter(id => id !== item.cartId));
                        triggerToast("🗑️ 장바구니에서 상품이 제거되었습니다.");
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 정산 요약 및 결제 게이트 */}
            <div style={{
              marginTop: "24px",
              borderTop: "2px solid #000000",
              paddingTop: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", fontFamily: "var(--font-pixel)" }}>TOTAL</span>
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#18181b", fontFamily: "var(--font-pixel)" }}>₩{formattedTotalPrice}</span>
              </div>

              <button
                onClick={() => {
                  if (selectedItems.length === 0) {
                    triggerToast("⚠️ 선택된 상품이 없습니다.");
                    return;
                  }
                  setSelectedProduct(selectedItems[0]);
                  setCheckoutItems(selectedItems);
                  setPaymentSource("cart");
                  setView("payment");
                  triggerToast("💳 주문 결제 화면으로 이동합니다.");
                }}
                style={{
                  width: "100%",
                  height: "48px",
                  background: selectedItems.length > 0 ? "#000000" : "#d1d5db",
                  color: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: selectedItems.length > 0 ? "pointer" : "not-allowed",
                  letterSpacing: "0.5px",
                  transition: "all 0.15s ease",
                  outline: "none"
                }}
                disabled={selectedItems.length === 0}
              >
                {selectedItems.length === cartItems.length ? "전체 상품 주문하기" : `${selectedItems.length}개 상품 주문하기`}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW 3: PRODUCT DETAIL (상세 피팅 분석 페이지)
  // ==========================================
  const renderDetailView = () => {
    if (!selectedProduct) return null;

    const comp = getComparison(selectedProduct);
    const gradeInfo = getFitGrade(selectedProduct);
    const matchRate = getMatchPercent(selectedProduct);
    const isP = selectedProduct.category === "pants";

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "16px", textAlign: "left" }}>

        {/* 1. 상품 대형 캐러셀 일러스트레이션 박스 (시안과 100% 동일한 블랙 단선 테두리 프레임!) */}
        <div style={{
          height: "320px",
          border: "1.5px solid #111111",
          boxSizing: "border-box",
          position: "relative",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}>
          {renderProductImage(selectedProduct)}
        </div>

        {/* 캐러셀 3점식 인디케이터 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px", marginBottom: "16px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#111111" }}></span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", border: "1px solid #111111", background: "transparent" }}></span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", border: "1px solid #111111", background: "transparent" }}></span>
        </div>

        {/* 2. 상품 메타 텍스트 정보 */}
        <div style={{ textAlign: "left", marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
            {selectedProduct.brand}
          </span>
          <h2 style={{ fontSize: "15px", color: "#111111", margin: "0 0 6px 0", fontWeight: "bold", letterSpacing: "-0.3px", lineHeight: "1.3" }}>
            {selectedProduct.name}
          </h2>

          {/* 가격 & 하트(Saved) 토글 병렬 배치 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#111111", fontFamily: "var(--font-pixel)" }}>
              {selectedProduct.price}
            </span>

            {/* 우측 하트 Saved 개수 토글 버튼 */}
            <div
              onClick={() => toggleLikeProduct(selectedProduct.id)}
              style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
            >
              {likedProductIds.includes(selectedProduct.id) ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#111111", fontFamily: "var(--font-pixel)" }}>
                {selectedProduct.likes + (likedProductIds.includes(selectedProduct.id) ? 1 : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 사이즈 및 USED 표기 */}
        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500", borderBottom: "1px solid #f3f4f6", paddingBottom: "16px", marginBottom: "16px" }}>
          사이즈 {selectedProduct.size?.toUpperCase()} <span style={{ margin: "0 6px", color: "#e5e7eb" }}>|</span> USED
        </div>

        {/* 3. 컨디션 & 횡형 상세 치수 바 (연그레이 바탕 밴드) */}
        <div style={{
          background: "#f4f4f5",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "9.5px",
          color: "#3f3f46",
          marginBottom: "28px",
          cursor: "pointer"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold", color: "#18181b" }}>컨디션</span>
            <span style={{ fontWeight: "bold", color: "#10b981" }}>A-</span>
            <span style={{ color: "#d1d5db" }}>|</span>
            {isP ? (
              <>
                <span>총장 {selectedProduct.measurements.length}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>허리 {selectedProduct.measurements.shoulder}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>허벅지 {selectedProduct.measurements.chest}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>밑단 {selectedProduct.measurements.sleeve}cm</span>
              </>
            ) : (
              <>
                <span>어깨 {selectedProduct.measurements.shoulder}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>가슴 {selectedProduct.measurements.chest}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>총장 {selectedProduct.measurements.length}cm</span>
                <span style={{ color: "#d1d5db" }}>|</span>
                <span>소매 {selectedProduct.measurements.sleeve}cm</span>
              </>
            )}
          </div>
          {/* 우측 꺾쇠 아이콘 */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* 4. 실루엣 비교 구역 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111111", margin: 0 }}>실루엣 비교</h3>
            <span style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #a1a1aa",
              color: "#71717a",
              fontSize: "8.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold"
            }}>?</span>
          </div>

          {/* 컬러 범례 지표 */}
          <div style={{ display: "flex", gap: "8px", fontSize: "9px", fontWeight: "bold" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#ef4444" }}>
              <span style={{ width: "5.5px", height: "5.5px", borderRadius: "50%", background: "#ef4444" }}></span>더 작음
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#10b981" }}>
              <span style={{ width: "5.5px", height: "5.5px", borderRadius: "50%", background: "#10b981" }}></span>잘 맞음
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#3b82f6" }}>
              <span style={{ width: "5.5px", height: "5.5px", borderRadius: "50%", background: "#3b82f6" }}></span>더 큼
            </span>
          </div>
        </div>

        {/* 5. 실루엣 삼각 비교 패널 (내 기준 옷 / 오버레이 비교 그래픽판 / AI 지표 일치율) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "96px 1fr 132px",
          gap: "12px",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          {/* 좌열: 기준옷과 상품 2개 박스형 비교군 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* 박스 A: 내 기준 옷 */}
            <div style={{
              border: "1px solid #e4e4e7",
              background: "#f4f4f5",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "0px"
            }}>
              <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", border: "1px solid #e4e4e7" }}>
                {isP ? "👖" : "👕"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span style={{ fontSize: "7px", color: "#71717a" }}>내 기준 옷</span>
                <span style={{ fontSize: "8.5px", fontWeight: "bold", color: "#18181b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "52px" }}>
                  {isP ? "데님 팬츠" : "오버핏 티셔츠"}
                </span>
              </div>
            </div>

            {/* 박스 B: 상품 (활성 초록 테두리!) */}
            <div style={{
              border: "1.5px solid #10b981",
              background: "#ffffff",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "0px"
            }}>
              <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", border: "1px solid #e4e4e7" }}>
                {isP ? "👖" : "👕"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span style={{ fontSize: "7px", color: "#10b981", fontWeight: "bold" }}>상품</span>
                <span style={{ fontSize: "8.5px", fontWeight: "bold", color: "#18181b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "52px" }}>
                  {selectedProduct.brand} {isP ? "바지" : "티셔츠"}
                </span>
              </div>
            </div>
          </div>

          {/* 중열: 모눈 격자 제도판 배경 위에 오버레이 드로잉 SVG */}
          <div style={{
            height: "124px",
            background: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "8px 8px",
            border: "1px solid #f4f4f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            {isP ? (
              <svg width="74" height="100" viewBox="0 0 100 100">
                {/* 회색 실루엣 (내 기준 옷) */}
                <path d="M 40,15 L 60,15 L 64,45 L 64,88 L 52,88 L 52,50 L 48,50 L 48,88 L 36,88 L 36,45 Z" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinejoin="round" />
                {/* 녹색/적색/청색 혼합 실루엣 (상품 옷 피팅 스펙) */}
                <path d="M 38,13 L 62,13 L 66,45 L 66,90 L 53,90 L 53,52 L 47,52 L 47,90 L 34,90 L 34,45 Z" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
                {/* 허리 부분 다소 타이트함 (적색 하이라이트) */}
                <line x1="34" y1="13" x2="66" y2="13" stroke="#ef4444" strokeWidth="3" />
                {/* 총장 여유로움 (청색 하이라이트) */}
                <line x1="34" y1="90" x2="47" y2="90" stroke="#3b82f6" strokeWidth="3" />
                <line x1="53" y1="90" x2="66" y2="90" stroke="#3b82f6" strokeWidth="3" />
              </svg>
            ) : (
              <svg width="84" height="100" viewBox="0 0 100 100">
                {/* 회색 실루엣 (내 기준 옷) */}
                <path d="M 32,30 L 48,22 Q 54,28 60,28 Q 66,28 72,22 L 88,30 L 83,50 L 76,48 L 76,90 L 44,90 L 44,48 L 37,50 Z" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinejoin="round" />
                {/* 어깨가 약간 타이트함 (적색 하이라이트) */}
                <path d="M 34,30 L 48,22 Q 54,28 60,28 Q 66,28 72,22 L 86,30" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                {/* 가슴/품은 적당함 (녹색 실루엣) */}
                <path d="M 37,50 L 44,48 L 44,90 L 76,90 L 76,48 L 83,50" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
                {/* 총장은 넉넉함 (청색 하이라이트) */}
                <line x1="44" y1="90" x2="76" y2="90" stroke="#3b82f6" strokeWidth="3.5" />
              </svg>
            )}
          </div>

          {/* 우열: AI 추천 핏 설명 + 일치도 10개 서클 점수판 */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left", paddingLeft: "4px" }}>
            <div style={{ fontSize: "9.5px", fontWeight: "bold", color: "#ef4444", marginBottom: "4.5px" }}>
              {isP ? "허리가 약간 타이트합니다." : "어깨가 약간 작습니다."}
            </div>
            <div style={{ fontSize: "9.5px", fontWeight: "bold", color: "#10b981", marginBottom: "14px" }}>
              {isP ? "허벅지는 잘 맞습니다." : "총장은 여유 있습니다."}
            </div>

            {/* 핏 적합도 & 물음표 */}
            <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "4px" }}>
              <span style={{ fontSize: "9.5px", fontWeight: "bold", color: "#71717a" }}>핏 적합도</span>
              <span style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                border: "0.8px solid #a1a1aa",
                color: "#71717a",
                fontSize: "7.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>?</span>
            </div>

            {/* 거대한 픽셀풍 적합 비율 수치 (눈부신 초록색!) */}
            <div style={{ fontSize: "24px", fontWeight: "900", color: "#10b981", fontFamily: "var(--font-pixel)", lineHeight: "1", marginBottom: "8px" }}>
              {matchRate}%
            </div>

            {/* 10개 점수 닷 인디케이터 (일치율 비례 점등) */}
            <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const isActive = i < Math.round(matchRate / 10);
                return (
                  <span
                    key={i}
                    style={{
                      width: "4.5px",
                      height: "4.5px",
                      borderRadius: "50%",
                      background: isActive ? "#10b981" : "#d1d5db"
                    }}
                  />
                );
              })}
            </div>

            <div style={{ fontSize: "7.5px", color: "#a1a1aa", lineHeight: "1.4" }}>
              정보를 추가할수록<br />정확도가 올라갑니다.
            </div>
          </div>
        </div>

        {/* 6. 기준 옷 변경 및 체형 정보 추가 입력 버튼 세트 (대칭형 화이트 버튼) */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "48px" }}>
          {/* 기준 옷 변경 */}
          <button
            onClick={() => setView("my")}
            style={{
              flex: 1,
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#18181b",
              padding: "10px 0",
              fontSize: "10.5px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: "0px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3zm0 3v4M2 17l3-6h14l3 6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
            </svg>
            기준 옷 변경
          </button>

          {/* 체형 정보 추가 입력 */}
          <button
            onClick={() => setView("chat")}
            style={{
              flex: 1,
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#18181b",
              padding: "10px 0",
              fontSize: "10.5px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              borderRadius: "0px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            체형 정보 추가 입력
          </button>
        </div>

        {/* 7. 바닥부 완전 밀착 고정 분할형 둥근(Double Round) 투-버튼 구매바 */}
        <div style={{
          position: "sticky",
          bottom: "56px",
          width: "calc(100% + 32px)",
          marginLeft: "-16px",
          marginRight: "-16px",
          height: "76px",
          background: "#ffffff", // 시안처럼 백색 백그라운드 위에서 올 블랙 둥근 버튼이 명확히 돋보이게 구성
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 12px 16px",
          boxSizing: "border-box",
          zIndex: 150,
          gap: "12px",
          borderTop: "1px solid #f4f4f5"
        }}>
          {/* 좌측 와이드 구매하기 버튼 (둥근 모서리, 올 블랙) */}
          <button
            onClick={() => {
              const selectedSize = selectedProduct.size?.toUpperCase() || "L";
              setCheckoutSize(selectedSize);
              setCheckoutItems([{
                ...selectedProduct,
                cartId: Date.now(),
                selectedSize
              }]);
              setPaymentSource("detail");
              setView("payment");
            }}
            style={{
              flex: 1,
              height: "48px",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px", // 시안처럼 부드러운 둥근 각
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.15s ease",
              outline: "none"
            }}
          >
            {/* 가격 (백색 픽셀풍) */}
            <span style={{ fontSize: "16px", fontWeight: "900", color: "#ffffff", fontFamily: "var(--font-pixel)" }}>
              {selectedProduct.price}
            </span>

            {/* 구매하기 텍스트 */}
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.5px" }}>
              구매하기
            </span>
          </button>

          {/* 우측 정스퀘어 장바구니 버튼 (둥근 모서리, 올 블랙) */}
          <button
            onClick={() => {
              const selectedSize = selectedProduct.size?.toUpperCase() || "L";
              const newCartItem = {
                ...selectedProduct,
                cartId: Date.now(),
                selectedSize
              };
              setCartItems(prev => [...prev, newCartItem]);
              setSelectedCartIds(prev => [...prev, newCartItem.cartId]);
              triggerToast(`🛒 장바구니에 담겼습니다.`);
            }}
            style={{
              width: "48px",
              height: "48px",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px", // 시안처럼 부드러운 둥근 각
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
              padding: 0,
              outline: "none"
            }}
          >
            {/* 시안과 완전히 일치하는 클래식 카트 쇼핑백 핸들 SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.5" fill="#ffffff" />
              <circle cx="19" cy="21" r="1.5" fill="#ffffff" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 4: PAYMENT PAGE (결제창 & 다크 픽셀 영수증)
  // ==========================================
  const renderPaymentView = () => {
    // 1. 다중 결제 대응 액티브 주문 아이템 결정
    const activeCheckoutItems = checkoutItems.length > 0 ? checkoutItems : (selectedProduct ? [{
      ...selectedProduct,
      selectedSize: checkoutSize,
      cartId: Date.now()
    }] : []);

    if (activeCheckoutItems.length === 0) return null;

    const matchRate = activeCheckoutItems.length === 1 ? getMatchPercent(activeCheckoutItems[0]) : 0;
    const isP = activeCheckoutItems.length === 1 ? activeCheckoutItems[0].category === "pants" : false;

    // 2. 동적 가격 계산
    const basePrice = activeCheckoutItems.reduce((sum, item) => {
      const priceNum = parseInt(item.price.replace(/,/g, ""), 10);
      return sum + priceNum;
    }, 0);

    const shippingCost = shippingMethod === "fast" ? 3000 : 0;
    const totalPriceStr = (basePrice + shippingCost).toLocaleString();

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "16px", textAlign: "left" }}>

        <form onSubmit={(e) => {
          e.preventDefault();
          setOrderCompleted(true);
          // 주문 성공 시 장바구니 비우기 처리! (결제 완료된 상품들만 선택 제거)
          if (paymentSource === "cart") {
            setCartItems(prev => prev.filter(item => !activeCheckoutItems.some(checkoutItem => checkoutItem.cartId === item.cartId)));
            setSelectedCartIds(prev => prev.filter(id => !activeCheckoutItems.some(checkoutItem => checkoutItem.cartId === id)));
          }
        }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* [1] 헤더 타이틀 영역 (뒤로가기, 타이틀, 우측 안심/상담 아이콘) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  if (paymentSource === "cart") {
                    setView("cart");
                  } else {
                    setView("detail");
                  }
                }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#111111", margin: 0 }}>
                결제하기
              </h2>
            </div>

            {/* 우측 아이콘 2종 */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              {/* 안심 보안 아이콘 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {/* 고객 지원 헤드폰 아이콘 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
          </div>

          {/* [2] 주문 상품 정보 컨테이너 (다중 상품 스택 렌더링 지원!) */}
          <div style={{
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "14px"
          }}>
            <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#71717a", marginBottom: "4px" }}>
              주문 상품 정보 ({activeCheckoutItems.length})
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeCheckoutItems.map((item, idx) => (
                <div key={item.cartId || idx} style={{
                  display: "flex",
                  gap: "12px",
                  paddingBottom: idx === activeCheckoutItems.length - 1 ? 0 : "12px",
                  borderBottom: idx === activeCheckoutItems.length - 1 ? "none" : "1px solid #f4f4f5",
                  alignItems: "center"
                }}>
                  {/* 상품 썸네일 박스 (블랙 아웃라인 단선 테두리) */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    border: "1px solid #111111",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0
                  }}>
                    <div style={{ width: "100%", height: "100%", transform: "scale(0.85)" }}>
                      {renderProductImage(item)}
                    </div>
                  </div>

                  {/* 상품 상세 텍스트 */}
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <span style={{ fontSize: "8.5px", color: "#71717a", fontWeight: "bold", textTransform: "uppercase" }}>{item.brand}</span>
                    <h4 style={{ fontSize: "10.5px", color: "#18181b", margin: "1px 0 3px 0", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </h4>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "9px", background: "#f4f4f5", padding: "1px 6px", border: "1px solid #e4e4e7", fontFamily: "var(--font-pixel)" }}>SIZE: {item.selectedSize}</span>
                      <span style={{ fontSize: "11.5px", fontWeight: "900", color: "#111111", fontFamily: "var(--font-pixel)" }}>₩{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* [3] 핏 적합도 진단 카드 (단일 상품 주문 시에만 활성화하여 프리미엄 체감 유지) */}
          {activeCheckoutItems.length === 1 && (
            <div style={{
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              padding: "14px",
              background: "#ffffff"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#18181b" }}>핏 적합도</span>
                  <span style={{
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    border: "0.8px solid #a1a1aa",
                    color: "#71717a",
                    fontSize: "7.5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}>?</span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#111111", fontFamily: "var(--font-pixel)" }}>
                  {matchRate}%
                </span>
              </div>

              {/* 정교한 미니멀 블랙 프로그레스 바 */}
              <div style={{ width: "100%", height: "4px", background: "#e4e4e7", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ width: `${matchRate}%`, height: "100%", background: "#000000" }}></div>
              </div>

              {/* 진단 텍스트 및 개별 단면 분석 정보 */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9.5px", fontWeight: "bold", color: "#18181b", marginBottom: "10px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#111111" }}></span>
                잘 맞을 확률이 높아요
              </div>

              {/* 단면 핏 분기 */}
              <div style={{
                background: "#f4f4f5",
                padding: "10px 12px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "9.5px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }}></span>
                  <span style={{ color: "#71717a", width: "40px" }}>{isP ? "허리" : "어깨"}</span>
                  <span style={{ fontWeight: "bold", color: "#18181b" }}>약간 타이트</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                  <span style={{ color: "#71717a", width: "40px" }}>총장</span>
                  <span style={{ fontWeight: "bold", color: "#18181b" }}>여유 있음</span>
                </div>
              </div>
            </div>
          )}

          {/* [4] 사이즈 선택 카드 (단일 상품 주문 시에만 활성화) */}
          {activeCheckoutItems.length === 1 && (
            <div style={{
              border: "1px solid #e4e4e7",
              borderRadius: "12px",
              padding: "14px",
              background: "#ffffff"
            }}>
              <h3 style={{ fontSize: "11.5px", fontWeight: "bold", color: "#18181b", margin: "0 0 16px 0", textAlign: "left" }}>
                사이즈 선택
              </h3>

              {/* 사이즈 횡형 셀렉터 */}
              <div style={{ display: "flex", gap: "8px" }}>
                {(() => {
                  let sizesList = ["S", "M", "L", "XL", "XXL"];
                  const singleItem = activeCheckoutItems[0];
                  if (singleItem.category === "shoes") {
                    sizesList = ["250", "255", "260", "265", "270", "275", "280"];
                  } else if (singleItem.category === "accessories" || singleItem.category === "other") {
                    sizesList = ["FREE"];
                  } else if (singleItem.category === "pants") {
                    sizesList = ["28", "30", "32", "34", "36"];
                  }

                  const availableSizes = (singleItem.availableSizes || [singleItem.size]).map(s => String(s).toUpperCase());
                  const primarySize = String(singleItem.size).toUpperCase();

                  return sizesList.map((sz) => {
                    const isAvailable = availableSizes.includes(sz.toUpperCase());
                    const isRecommended = sz.toUpperCase() === primarySize;
                    const isCurrent = checkoutSize.toUpperCase() === sz.toUpperCase();

                    return (
                      <div key={sz} style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {isRecommended && (
                          <span style={{
                            position: "absolute",
                            top: "-14px",
                            background: "#000000",
                            color: "#ffffff",
                            fontSize: "6.5px",
                            fontWeight: "bold",
                            padding: "2px 4px",
                            borderRadius: "2px",
                            whiteSpace: "nowrap",
                            zIndex: 10
                          }}>
                            추천
                          </span>
                        )}

                        <button
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => {
                            if (isAvailable) setCheckoutSize(sz);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 0",
                            background: !isAvailable
                              ? "#ffffff"
                              : (isCurrent ? "#000000" : "#ffffff"),
                            color: !isAvailable
                              ? "#d1d5db"
                              : (isCurrent ? "#ffffff" : "#18181b"),
                            border: !isAvailable
                              ? "1px dashed #e4e4e7"
                              : (isCurrent ? "1px solid #000000" : "1px solid #d1d5db"),
                            fontSize: "10px",
                            fontWeight: "bold",
                            cursor: !isAvailable ? "not-allowed" : "pointer",
                            borderRadius: "4px",
                            transition: "all 0.15s ease",
                            marginTop: "4px",
                            opacity: !isAvailable ? 0.45 : 1
                          }}
                        >
                          {sz}
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* [추가] 배송지 주소 입력 카드 */}
          <div style={{
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "14px",
            background: "#ffffff"
          }}>
            <h3 style={{ fontSize: "11.5px", fontWeight: "bold", color: "#18181b", margin: "0 0 12px 0", textAlign: "left" }}>
              배송지 정보
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                placeholder="수령인 이름"
                required
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111111",
                  fontSize: "10px",
                  outline: "none",
                  borderRadius: "4px"
                }}
              />
              <input
                type="text"
                placeholder="연락처"
                required
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111111",
                  fontSize: "10px",
                  outline: "none",
                  borderRadius: "4px"
                }}
              />
              <input
                type="text"
                placeholder="배송지 주소"
                required
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111111",
                  fontSize: "10px",
                  outline: "none",
                  borderRadius: "4px"
                }}
              />
            </div>
          </div>

          {/* [5] 배송 방법 카드 (인터랙티브 라디오 탭) */}
          <div style={{
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "14px",
            background: "#ffffff"
          }}>
            <h3 style={{ fontSize: "11.5px", fontWeight: "bold", color: "#18181b", margin: "0 0 12px 0", textAlign: "left" }}>
              배송 방법
            </h3>

            {/* 일반배송 vs 빠른배송 셀렉터 셋 */}
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #e4e4e7", borderRadius: "8px", overflow: "hidden" }}>
              {/* 일반 배송 */}
              <div
                onClick={() => setShippingMethod("normal")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderBottom: "1px solid #e4e4e7",
                  background: shippingMethod === "normal" ? "#fcfcfc" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1.5px solid #111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {shippingMethod === "normal" && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#111111" }}></span>}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#18181b" }}>일반 배송</span>
                    <span style={{ fontSize: "8.5px", color: "#a1a1aa" }}>3-5일 소요</span>
                  </div>
                </div>
                <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#18181b" }}>무료</span>
              </div>

              {/* 빠른 배송 */}
              <div
                onClick={() => setShippingMethod("fast")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: shippingMethod === "fast" ? "#fcfcfc" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1.5px solid #111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {shippingMethod === "fast" && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#111111" }}></span>}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#18181b" }}>빠른 배송</span>
                    <span style={{ fontSize: "8.5px", color: "#a1a1aa" }}>1-2일 소요</span>
                  </div>
                </div>
                <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#18181b" }}>3,000원</span>
              </div>
            </div>
          </div>

          {/* [6] 결제 금액 영수증 카드 */}
          <div style={{
            border: "1px solid #e4e4e7",
            borderRadius: "12px",
            padding: "14px",
            background: "#ffffff"
          }}>
            <h3 style={{ fontSize: "11.5px", fontWeight: "bold", color: "#18181b", margin: "0 0 12px 0", textAlign: "left" }}>
              결제 금액
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10.5px", color: "#71717a" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>상품 금액</span>
                <span style={{ fontWeight: "bold", color: "#18181b" }}>{basePrice.toLocaleString()}원</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>배송비</span>
                <span style={{ fontWeight: "bold", color: "#18181b" }}>{shippingMethod === "fast" ? "3,000원" : "무료"}</span>
              </div>

              <div style={{ borderTop: "1px solid #e4e4e7", marginTop: "4px", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#18181b", fontWeight: "bold" }}>
                <span>총 결제 금액</span>
                <span style={{ fontSize: "14px", fontWeight: "900" }}>{totalPriceStr}원</span>
              </div>
            </div>
          </div>

          {/* [7] 안심 보장 정보 행 2줄 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
            {/* 정보 행 1 */}
            <div style={{
              background: "#fafafa",
              border: "1px solid #f4f4f5",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "9px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span style={{ color: "#3f3f46", fontWeight: "bold" }}>맞지 않을 경우 재판매를 통해 쉽게 판매할 수 있어요.</span>
              </div>
              <span style={{ color: "#71717a", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}>
                자세히 보기
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </div>

            {/* 정보 행 2 */}
            <div style={{
              background: "#fafafa",
              border: "1px solid #f4f4f5",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "9px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ color: "#3f3f46", fontWeight: "bold" }}>구매 데이터가 안전하게 저장되어 다음에도 정확도가 올라가요.</span>
              </div>
              <span style={{ color: "#71717a", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}>
                자세히 보기
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </div>
          </div>

          {/* [8] 바닥부 완전 밀착 고정 결제바 (position: sticky 적용으로 빈 흰 공간 삭제!) */}
          <div style={{
            position: "sticky",
            bottom: "0px",
            width: "calc(100% + 32px)",
            marginLeft: "-16px",
            marginRight: "-16px",
            height: "64px",
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            boxSizing: "border-box",
            zIndex: 150,
            borderTop: "1px solid rgba(255,255,255,0.15)"
          }}>
            {/* 가격 (백색 픽셀풍, 원화 표시 없음!) */}
            <div style={{ fontSize: "16px", fontWeight: "900", color: "#ffffff", fontFamily: "var(--font-pixel)" }}>
              {totalPriceStr}
            </div>

            <button
              type="submit"
              style={{
                background: "#000000",
                color: "#ffffff",
                border: "1px solid #ffffff",
                padding: "8px 24px",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                borderRadius: "0px",
                letterSpacing: "0.5px"
              }}
            >
              결제하기
            </button>
          </div>

        </form>

        {/* 🧾 주문 완료 시크 영수증 */}
        {orderCompleted && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
            padding: "20px"
          }}>
            <div className="animate-fade-in" style={{
              background: "#000000",
              color: "#ffffff",
              maxWidth: "360px",
              width: "100%",
              padding: "32px 24px",
              textAlign: "center",
              border: "1px solid #ffffff"
            }}>
              <div style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                color: "#ffffff",
                border: "1px dashed #ffffff",
                display: "inline-block",
                padding: "6px 12px",
                marginBottom: "20px"
              }}>
                APPROVED
              </div>

              <h2 style={{ fontSize: "10px", fontFamily: "var(--font-pixel)", margin: "0 0 4px 0", fontWeight: "normal" }}>
                gubi market receipt
              </h2>
              <p style={{ fontSize: "8px", fontFamily: "var(--font-pixel)", color: "#a1a1aa", margin: "0 0 24px 0" }}>
                no: gubi-{Math.floor(Math.random() * 900000) + 100000}
              </p>

              <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.2)", marginBottom: "16px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", fontSize: "9px", fontFamily: "var(--font-pixel)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>item:</span>
                  <span style={{ maxWidth: "160px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {activeCheckoutItems.length === 1 
                      ? activeCheckoutItems[0].name 
                      : `${activeCheckoutItems[0].name} 외 ${activeCheckoutItems.length - 1}개`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>size:</span>
                  <span>{activeCheckoutItems.length === 1 ? activeCheckoutItems[0].selectedSize : "MULTI"}</span>
                </div>
                {activeCheckoutItems.length === 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>fit:</span>
                    <span>{matchRate}% success</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>receiver:</span>
                  <span>{shippingInfo.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>address:</span>
                  <span style={{ maxWidth: "180px", textAlign: "right" }}>{shippingInfo.address}</span>
                </div>
                <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.2)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>total:</span>
                  <span>{totalPriceStr} won</span>
                </div>
              </div>

              <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.2)", margin: "24px 0" }} />

              <button
                type="button"
                onClick={() => {
                  setOrderCompleted(false);
                  setView("main");
                  setSelectedProduct(null);
                  setShippingInfo({ name: "", phone: "", address: "" });
                  setCheckoutItems([]);
                }}
                style={{
                  background: "#ffffff",
                  color: "#000000",
                  border: "none",
                  padding: "12px",
                  fontSize: "9px",
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "var(--font-pixel)"
                }}
              >
                continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // VIEW 5: CHAT VIEW (AI Fit Advisor 실시간 챗봇)
  // ==========================================
  const renderChatView = () => {
    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "20px 16px", textAlign: "left", minHeight: "400px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#111111", marginBottom: "20px" }}>
          AI Fit Advisor
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#111111", display: "flex", alignItems: "center", justify: "center", color: "#ffffff", fontSize: "14px" }}>🤖</div>
            <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "0 12px 12px 12px", fontSize: "11px", color: "#111111", maxWidth: "260px", lineHeight: "1.5" }}>
              안녕하세요 {basicInfo?.nickname || "고객"}님!<br />
              현재 분석된 신체 프로필({basicInfo?.height}cm / {basicInfo?.weight}kg) 기준 사이즈나 연출하고 싶으신 핏감에 대해 질문해 주세요.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 6: MY VIEW (내 사이즈 정보 센터)
  // ==========================================
  const renderMyView = () => {
    // 마이페이지 전용 토스트 발생기
    const triggerMyToast = (msg) => {
      setMyPageToast(msg);
      setTimeout(() => {
        setMyPageToast("");
      }, 2500);
    };

    // 마이페이지 리스트의 각 셀에 대한 명세 구성 (유저 시안 기준 100% 동일)
    const sections = [
      {
        group: 1,
        items: [
          { label: "주문 내역", info: "📦 주문 내역 페이지는 현재 준비 중입니다!" },
          { label: "취소/반품/교환 내역", info: "🔄 취소/반품/교환 건이 현재 존재하지 않습니다." },
          { label: "재판매 관리", info: "♻️ 최근 구매하신 옷을 원클릭으로 손쉽게 위탁 재판매해 보세요!" },
          { label: "줄서기 제품", info: "⏱️ 실시간 줄서기 대기 내역 페이지로 이동합니다." },
          { label: "최근 본 제품", info: "👀 최근 24시간 동안 보신 빈티지 제품이 2개 존재합니다." }
        ]
      },
      {
        group: 2,
        items: [
          { label: "적립금 관리", info: "🪙 현재 사용 가능한 GUBI 적립금은 3,500원입니다." },
          { label: "이벤트/회원혜택", info: "🎁 5월 신규 회원만을 위한 10% 웰컴 쿠폰이 발급되었습니다!" },
          { label: "계좌 관리", info: "💳 환불 및 재판매 대금 정산용 등록 계좌가 정상 연동되어 있습니다." },
          { label: "리뷰", info: "✍️ 아직 작성하지 않은 구매 리뷰가 1건 있습니다." },
          { label: "검수 기준", info: "🔍 정밀 검수 기준: GUBI에서는 정가품 여부 및 체형 오차를 꼼꼼히 검수합니다." }
        ]
      },
      {
        group: 3,
        items: [
          { label: "1:1 문의하기", info: "💬 1:1 고객상담 센터로 메시지를 작성해 주세요." },
          { label: "채팅 상담하기", info: "🤖 AI Fit Advisor를 통해 연중무휴 실시간 피팅 상담이 가능합니다!" },
          { label: "자주 묻는 질문", info: "❓ 자주 묻는 질문(FAQ) 코너로 안내합니다." }
        ]
      }
    ];

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "24px 16px", textAlign: "left" }}>
        {/* [1] 유저 프로필 & 2x2 피팅 정보 조종 그리드 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          {/* 좌측 둥근 회색 아바타 */}
          <div style={{
            width: "56px",
            height: "56px",
            background: "#e4e4e7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* 우측 2x2 필 캡슐 버튼 그리드 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            flex: 1
          }}>
            <button
              onClick={() => {
                setEditNickname(basicInfo?.nickname || "");
                setEditGender(basicInfo?.gender || "남");
                setEditHeight(basicInfo?.height || "");
                setEditWeight(basicInfo?.weight || "");
                setEditUsualSize(basicInfo?.usualSize || "L");
                setIsEditingProfile(true);
              }}
              style={{
                borderRadius: "20px",
                border: "1px solid #71717a",
                background: "#ffffff",
                color: "#18181b",
                fontSize: "10.5px",
                fontWeight: "bold",
                padding: "6px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none"
              }}
            >
              프로필 관리
            </button>
            <button
              onClick={() => {
                // 실제 Survey 온보딩 스텝 1로 순간이동!
                setStep(1);
              }}
              style={{
                borderRadius: "20px",
                border: "1px solid #71717a",
                background: "#ffffff",
                color: "#18181b",
                fontSize: "10.5px",
                fontWeight: "bold",
                padding: "6px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none"
              }}
            >
              체형 정보 수정
            </button>
            <button
              onClick={() => setView("resell_register")}
              style={{
                borderRadius: "20px",
                border: "1px solid #71717a",
                background: "#ffffff",
                color: "#18181b",
                fontSize: "10.5px",
                fontWeight: "bold",
                padding: "6px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none"
              }}
            >
              원클릭 재판매
            </button>
            <button
              onClick={() => setView("queue_product")}
              style={{
                borderRadius: "20px",
                border: "1px solid #71717a",
                background: "#ffffff",
                color: "#18181b",
                fontSize: "10.5px",
                fontWeight: "bold",
                padding: "6px 8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none"
              }}
            >
              줄서기 제품
            </button>
          </div>
        </div>

        {/* [2] 얇은 아웃라인 테두리의 명품 단선 메뉴 박스 리스트 */}
        <div style={{
          border: "1px solid #18181b",
          borderRadius: "0px",
          overflow: "hidden",
          background: "#ffffff",
          boxSizing: "border-box"
        }}>
          {sections.map((grp, gIdx) => (
            <div key={grp.group}>
              {/* 그룹 구분선 렌더링 (2번째 그룹부터) */}
              {gIdx > 0 && <div style={{ borderBottom: "1px solid #e4e4e7" }} />}

              {grp.items.map((item, iIdx) => {
                // 줄서기 제품이나 채팅 상담 등 특정 메뉴 클릭 시 특화 액션
                const handleRowClick = () => {
                  if (item.label === "채팅 상담하기") {
                    setView("chat");
                  } else if (item.label === "줄서기 제품") {
                    setView("queue_product");
                  } else if (item.label === "재판매 관리") {
                    setView("resell_register");
                  } else {
                    setActiveAlert(item.label);
                  }
                };

                return (
                  <div
                    key={item.label}
                    onClick={handleRowClick}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "13px 16px",
                      cursor: "pointer",
                      transition: "background 0.1s ease",
                      borderBottom: iIdx === grp.items.length - 1 ? "none" : "1px solid #f4f4f5"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f4f4f5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    {/* 타이틀 명세 */}
                    <span style={{ fontSize: "11.5px", fontWeight: "bold", color: "#18181b" }}>
                      {item.label}
                    </span>

                    {/* 우향 꺾쇠 화살표 */}
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* [3] 시크한 밑줄 로그아웃 버튼 (회원 이탈/리셋 지원) */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <span
            onClick={() => {
              logout();
              triggerMyToast("👋 정상적으로 로그아웃되었습니다.");
            }}
            style={{
              fontSize: "10.5px",
              color: "#a1a1aa",
              cursor: "pointer",
              textDecoration: "underline",
              transition: "color 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#18181b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#a1a1aa";
            }}
          >
            로그아웃
          </span>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 7: RESELL REGISTER VIEW (재판매 등록 화면)
  // ==========================================
  const renderResellRegisterView = () => {
    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "0 16px 24px 16px", textAlign: "left" }}>
        {/* 뒤로가기 & 타이틀 */}
        <div
          onClick={() => setView("my")}
          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", cursor: "pointer", borderBottom: "1px solid #f4f4f5", marginBottom: "20px" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span style={{ fontSize: "15px", fontWeight: "bold", color: "#18181b" }}>재판매 등록</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 상품 정보 카드 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "80px", height: "80px", border: "1px solid #18181b", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300"
                alt="Product"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#71717a" }}>Stussy</div>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b", margin: "2px 0 6px 0", lineHeight: "1.4" }}>
                스투시 피그먼트 다이드 클래식 기어 티셔츠
              </div>
              <div style={{ fontSize: "15px", fontWeight: "900", color: "#18181b" }}>248,000</div>
            </div>
          </div>

          {/* 자동 입력된 정보 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b" }}>자동 입력된 정보</span>
              <button
                onClick={() => triggerToast("✏️ 고객님의 체형 데이터에 기반하여 정밀 실측이 대입되었습니다.")}
                style={{ background: "#e4e4e7", color: "#71717a", border: "none", borderRadius: "12px", padding: "2px 10px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
              >
                수정하기
              </button>
            </div>

            {/* 실측 치수 5열 가로 배치 */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "12px" }}>
              {[
                { label: "총장", val: "72cm" },
                { label: "어깨", val: "51cm" },
                { label: "가슴", val: "56cm" },
                { label: "소매", val: "22cm" },
                { label: "밑단", val: "55cm" }
              ].map((sz, idx) => (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#71717a", fontWeight: "bold" }}>{sz.label}</span>
                  <div style={{ width: "100%", background: "#e4e4e7", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "8px 0", borderRadius: "8px", textAlign: "center" }}>
                    {sz.val}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: "12px", color: "#71717a", marginTop: "12px" }}>
              상품 설명
            </div>
          </div>

          {/* 가격 설정 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b" }}>가격 설정</span>
              <div
                onClick={() => triggerToast("💡 시장 평균 거래가와 최근 거래 이력을 분석한 최적 가격입니다.")}
                style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1px solid #71717a", color: "#71717a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "bold", cursor: "pointer" }}
              >
                ?
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "10.5px", color: "#71717a", marginBottom: "4px" }}>추천 판매가</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "900", color: "#18181b" }}>248,000원</span>
                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "9px", fontWeight: "bold", padding: "1px 6px", borderRadius: "8px" }}>
                    최근 거래가 기준
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "10.5px", color: "#71717a", marginBottom: "4px" }}>판매가</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="text"
                    value={resellPrice}
                    onChange={(e) => setResellPrice(e.target.value)}
                    style={{ width: "80px", background: "#f4f4f5", border: "none", borderRadius: "8px", padding: "6px 8px", fontSize: "12px", fontWeight: "bold", color: "#18181b", textAlign: "right" }}
                  />
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>원</span>
                </div>
                <div style={{ fontSize: "9px", color: "#a1a1aa", textAlign: "right", marginTop: "2px" }}>직접 수정 가능</div>
              </div>
            </div>
          </div>

          {/* 상태 체크 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b" }}>상태 체크</span>
              <div
                onClick={() => triggerToast("🔍 빈티지 상품의 하자 및 실착 상태를 정직하게 입력해 주세요.")}
                style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1px solid #71717a", color: "#71717a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "bold", cursor: "pointer" }}
              >
                ?
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              {/* 착용 여부 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "8px", fontWeight: "bold" }}>착용 여부</div>
                <div style={{ display: "flex", background: "#f4f4f5", borderRadius: "8px", padding: "2px" }}>
                  <button
                    onClick={() => setResellWear("worn")}
                    style={{ flex: 1, border: "none", background: resellWear === "worn" ? "#ffffff" : "transparent", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "6px 0", borderRadius: "6px", cursor: "pointer", boxShadow: resellWear === "worn" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    ✓ 착용 있음
                  </button>
                  <button
                    onClick={() => setResellWear("new")}
                    style={{ flex: 1, border: "none", background: resellWear === "new" ? "#ffffff" : "transparent", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "6px 0", borderRadius: "6px", cursor: "pointer", boxShadow: resellWear === "new" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    새상품급
                  </button>
                </div>
              </div>

              {/* 오염/하자 여부 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#71717a", marginBottom: "8px", fontWeight: "bold" }}>오염/하자 여부</div>
                <div style={{ display: "flex", background: "#f4f4f5", borderRadius: "8px", padding: "2px" }}>
                  <button
                    onClick={() => setResellDefect("none")}
                    style={{ flex: 1, border: "none", background: resellDefect === "none" ? "#ffffff" : "transparent", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "6px 0", borderRadius: "6px", cursor: "pointer", boxShadow: resellDefect === "none" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    ✓ 없음
                  </button>
                  <button
                    onClick={() => setResellDefect("some")}
                    style={{ flex: 1, border: "none", background: resellDefect === "some" ? "#ffffff" : "transparent", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "6px 0", borderRadius: "6px", cursor: "pointer", boxShadow: resellDefect === "some" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    약간 있음
                  </button>
                  <button
                    onClick={() => setResellDefect("yes")}
                    style={{ flex: 1, border: "none", background: resellDefect === "yes" ? "#ffffff" : "transparent", color: "#18181b", fontSize: "10.5px", fontWeight: "bold", padding: "6px 0", borderRadius: "6px", cursor: "pointer", boxShadow: resellDefect === "yes" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    있음
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 대기자 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* 대기자 아이콘 */}
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                  현재 대기자 <span style={{ color: "#15803d", fontWeight: "900" }}>3명</span>
                </div>
                <div style={{ fontSize: "10px", color: "#71717a", marginTop: "2px" }}>등록 시 바로 판매될 수 있어요!</div>
              </div>
            </div>
            <span
              onClick={() => triggerToast("👥 대기자 목록: 1순위 kooseunghyun님 외 2명이 대기 중입니다.")}
              style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: "bold", cursor: "pointer" }}
            >
              대기자 목록보기 &gt;
            </span>
          </div>

          {/* 혜택 안내 */}
          <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "bold", color: "#18181b" }}>
                <span style={{ color: "#3b82f6" }}>✓</span> 별도 촬영 없이 바로 판매 가능합니다.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "bold", color: "#18181b" }}>
                <span style={{ color: "#3b82f6" }}>✓</span> 구매 정보가 자동으로 적용되어 간편하게 등록돼요.
              </div>
            </div>
            {/* 카메라 아이콘 */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          {/* 최종 등록 버튼 */}
          <button
            onClick={() => {
              triggerToast("🎉 재판매 등록 완료! 대기자에게 알림이 즉각 발송됩니다.");
              setTimeout(() => setView("my"), 2000);
            }}
            style={{
              width: "100%",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "24px",
              padding: "14px 0",
              fontSize: "14px",
              fontWeight: "900",
              cursor: "pointer",
              marginTop: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              letterSpacing: "1px"
            }}
          >
            재판매 등록하기
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 8: QUEUE PRODUCT VIEW (줄서기 제품 화면)
  // ==========================================
  const renderQueueProductView = () => {
    // 85182초를 HH:MM:SS 형태로 포맷팅
    const formatCountdown = (secs) => {
      const h = Math.floor(secs / 3600).toString().padStart(2, "0");
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    return (
      <div className="animate-fade-in" style={{ background: "#ffffff", padding: "0 16px 24px 16px", textAlign: "left" }}>
        {/* 뒤로가기 & 타이틀 */}
        <div
          onClick={() => setView("my")}
          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", cursor: "pointer", borderBottom: "1px solid #f4f4f5", marginBottom: "20px" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span style={{ fontSize: "15px", fontWeight: "bold", color: "#18181b" }}>줄서기 제품</span>
        </div>

        {/* 탭 버튼 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => {
              if (selectedProduct) {
                setView("detail");
              } else {
                triggerToast("ℹ️ 상품 상세 정보 화면으로 즉각 연동됩니다.");
              }
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #e4e4e7",
              background: "#ffffff",
              color: "#71717a",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            상품 상세
          </button>
          <button
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #71717a",
              background: "#e4e4e7",
              color: "#18181b",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "default"
            }}
          >
            줄서기 알림
          </button>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b", marginBottom: "12px" }}>
            구매 확정 요청
          </div>

          {/* 다크 테마 카드 */}
          <div style={{ background: "#09090b", borderRadius: "16px", padding: "20px", color: "#ffffff" }}>
            {/* 상단 불릿 헤더 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></div>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>줄서기 1번 - 구매 확정 요청</span>
            </div>

            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", margin: "12px 0" }}></div>

            {/* 상품 정보 카드 */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: "70px", height: "70px", background: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300"
                  alt="Product"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#a1a1aa" }}>Stussy</div>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff", margin: "2px 0" }}>
                  스투시 피그먼트 다이드 클래식 기어 티셔츠
                </div>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#ffffff" }}>248,000</div>
              </div>
            </div>

            <div style={{ fontSize: "10px", color: "#a1a1aa", marginTop: "12px", lineHeight: "1.4" }}>
              줄 서기 하셨던 상품이 재판매 등록 됐어요.<br />
              24시간 내 구매 확정하시면 바로 거래가 체결돼요.
            </div>

            {/* 타이머 블록 */}
            <div style={{ background: "#ffffff", borderRadius: "12px", padding: "14px 0", textAlign: "center", margin: "18px 0" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#dc2626", letterSpacing: "1px", fontFamily: "monospace" }}>
                {formatCountdown(countdownSeconds)}
              </div>
              <div style={{ fontSize: "9px", color: "#71717a", marginTop: "4px" }}>남은 시간</div>
            </div>

            {/* 가격 정보 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", color: "#a1a1aa" }}>재판매 가격</span>
              <span style={{ fontSize: "14px", fontWeight: "900", color: "#ffffff" }}>248,000원</span>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  triggerToast("❌ 줄서기가 거절되었습니다. 다음 대기열로 기회가 양도됩니다.");
                  setTimeout(() => setView("my"), 2000);
                }}
                style={{ flex: 1, border: "1px solid #ffffff", background: "transparent", color: "#ffffff", padding: "10px 0", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", outline: "none" }}
              >
                거절하기
              </button>
              <button
                onClick={() => {
                  triggerToast("🎉 구매 확정 완료! 판매자 대금 정산 및 배송이 즉시 개시됩니다.");
                  setTimeout(() => setView("my"), 2000);
                }}
                style={{ flex: 1, border: "none", background: "#15803d", color: "#ffffff", padding: "10px 0", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", outline: "none" }}
              >
                구매 확정
              </button>
            </div>
          </div>

          {/* 안내 피치 */}
          <div style={{ textAlign: "center", marginTop: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "10px", color: "#a1a1aa" }}>시간 내 응답이 없을 시 다음 순번으로 자동 이동돼요.</div>
            <div style={{ fontSize: "10px", color: "#a1a1aa" }}>줄서기는 언제든지 취소할 수 있어요.</div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 9: PROTOTYPE ALERT MODAL (프로토타입 전용 준비중 모달)
  // ==========================================
  const renderPrototypeModal = () => {
    if (!activeAlert) return null;
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(3px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.15s ease"
      }}>
        <div style={{
          width: "90%",
          maxWidth: "310px",
          background: "#ffffff",
          border: "2px solid #18181b",
          borderRadius: "0px",
          padding: "24px 20px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          textAlign: "center",
          boxSizing: "border-box"
        }}>
          <h4 style={{ fontSize: "14px", fontWeight: "900", color: "#18181b", marginBottom: "20px" }}>
            &apos;{activeAlert}&apos; 서비스 준비 중
          </h4>

          <button
            onClick={() => setActiveAlert("")}
            style={{
              width: "100%",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "20px",
              padding: "10px 0",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}
          >
            확인
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 10: PROFILE EDIT MODAL (프로필 동적 편집 모달)
  // ==========================================
  const renderProfileEditModal = () => {
    if (!isEditingProfile) return null;

    const sizes = ["S", "M", "L", "XL", "XXL"];

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(3px)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.15s ease"
      }}>
        <div style={{
          width: "90%",
          maxWidth: "340px",
          background: "#ffffff",
          border: "2px solid #18181b",
          borderRadius: "0px",
          padding: "24px 20px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          textAlign: "left",
          boxSizing: "border-box"
        }}>
          {/* 헤더 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "14px", fontWeight: "900", color: "#18181b" }}>👤 프로필 정보 수정</span>
            <svg
              onClick={() => setIsEditingProfile(false)}
              style={{ cursor: "pointer" }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          {/* 닉네임 입력 */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", display: "block", marginBottom: "6px" }}>
              닉네임
            </label>
            <input
              type="text"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              placeholder="닉네임을 입력해 주세요"
              style={{
                width: "100%",
                background: "#f4f4f5",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#18181b",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* 성별 선택 */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", display: "block", marginBottom: "6px" }}>
              성별
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["남", "여"].map((gen) => {
                const isSelected = editGender === gen;
                return (
                  <button
                    key={gen}
                    onClick={() => setEditGender(gen)}
                    style={{
                      flex: 1,
                      background: isSelected ? "#18181b" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#71717a",
                      border: isSelected ? "1px solid #18181b" : "1px solid #e4e4e7",
                      borderRadius: "8px",
                      padding: "8px 0",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      outline: "none"
                    }}
                  >
                    {gen === "남" ? "남성" : "여성"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 키 & 몸무게 (가로 병렬 배치) */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", display: "block", marginBottom: "6px" }}>
                키 (cm)
              </label>
              <input
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                placeholder="예: 178"
                style={{
                  width: "100%",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#18181b",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", display: "block", marginBottom: "6px" }}>
                몸무게 (kg)
              </label>
              <input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                placeholder="예: 72"
                style={{
                  width: "100%",
                  background: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#18181b",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* 평소 사이즈 */}
          <div style={{ marginBottom: "22px" }}>
            <label style={{ fontSize: "11px", fontWeight: "bold", color: "#71717a", display: "block", marginBottom: "6px" }}>
              평소 사이즈
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "4px" }}>
              {sizes.map((sz) => {
                const isSelected = editUsualSize === sz;
                return (
                  <div
                    key={sz}
                    onClick={() => setEditUsualSize(sz)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: isSelected ? "#18181b" : "#f4f4f5",
                      color: isSelected ? "#ffffff" : "#71717a",
                      border: isSelected ? "1px solid #18181b" : "1px solid #e4e4e7",
                      borderRadius: "8px",
                      padding: "6px 0",
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {sz}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setIsEditingProfile(false)}
              style={{
                flex: 1,
                background: "#ffffff",
                color: "#18181b",
                border: "1px solid #71717a",
                borderRadius: "20px",
                padding: "10px 0",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none"
              }}
            >
              취소
            </button>
            <button
              onClick={() => {
                if (!editNickname.trim()) {
                  triggerToast("⚠️ 닉네임을 올바르게 입력해 주세요.");
                  return;
                }
                updateBasicInfo({
                  nickname: editNickname,
                  gender: editGender,
                  height: editHeight,
                  weight: editWeight,
                  usualSize: editUsualSize
                });
                triggerToast("👤 프로필 정보가 성공적으로 변경되었습니다.");
                setIsEditingProfile(false);
              }}
              style={{
                flex: 1,
                background: "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                padding: "10px 0",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 글로벌 하단 고정 내비게이션 바 (position: sticky 기법을 통해 부모 컨테이너 너비 밀착 정렬 완성!)
  // ==========================================
  const renderGlobalBottomNav = () => {
    if (view === "resell_register" || view === "payment") return null;

    const tabs = [
      { id: "main", label: "Home", type: "home" },
      { id: "chat", label: "Chat", type: "chat" },
      { id: "saved", label: "Saved", type: "heart" },
      { id: "my", label: "My", type: "user" }
    ];

    // 하단 탭용 얇고 고급스러운 1.8px 라인아트 SVG 렌더러
    const renderTabIcon = (type, isSelected) => {
      const color = isSelected ? "#111111" : "#9ca3af";
      switch (type) {
        case "home":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          );
        case "chat":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          );
        case "heart":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          );
        case "user":
          return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div style={{
        position: "sticky",
        bottom: 0,
        width: "100%",
        height: "56px",
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 200,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.03)",
        userSelect: "none"
      }}>
        {tabs.map((tab) => {
          const isSelected = view === tab.id || (tab.id === "main" && view === "category") || (tab.id === "my" && view === "queue_product");
          return (
            <div
              key={tab.id}
              onClick={() => {
                setView(tab.id);
                setSelectedProduct(null);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 0",
                width: "60px",
                transition: "all 0.2s"
              }}
            >
              {renderTabIcon(tab.type, isSelected)}
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: isSelected ? "#111111" : "#9ca3af",
                marginTop: "4px",
                fontWeight: isSelected ? "bold" : "normal"
              }}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case "main":
        return renderMainView();
      case "category":
        return renderCategoryView();
      case "detail":
        return renderDetailView();
      case "payment":
        return renderPaymentView();
      case "chat":
        return renderChatView();
      case "my":
        return renderMyView();
      case "saved":
        return renderSavedView();
      case "resell_register":
        return renderResellRegisterView();
      case "queue_product":
        return renderQueueProductView();
      case "cart":
        return renderCartView();
      default:
        return renderMainView();
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "480px",
      margin: "0 auto",
      background: "#ffffff",
      color: "#111111",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* 글로벌 상단바 */}
      {renderGlobalHeader()}

      {/* 바디 영역 */}
      <div style={{ flex: 1, paddingBottom: (view === "detail" || view === "payment") ? "0px" : "24px" }}>
        {renderView()}
      </div>

      {/* 글로벌 하단바 (스티키 정밀 밀착형) */}
      {renderGlobalBottomNav()}

      {/* [추가] 글로벌 프리미엄 플로팅 토스트 공지 오버레이 */}
      {myPageToast && (
        <div style={{
          position: "fixed",
          bottom: "76px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(24, 24, 27, 0.95)",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "bold",
          padding: "10px 16px",
          borderRadius: "30px",
          zIndex: 9999,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.25s ease"
        }}>
          {myPageToast}
        </div>
      )}

      {/* [추가] 미완성 기능 프로토타입 안내 커스텀 모달 */}
      {renderPrototypeModal()}

      {/* [추가] 프로필 정보 동적 편집 모달 */}
      {renderProfileEditModal()}
    </div>
  );
}
