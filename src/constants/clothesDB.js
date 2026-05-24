// src/constants/clothesDB.js

export const CATEGORIES = {
  TSHIRT: { id: "tshirt", name: "티셔츠" },
  HOODIE: { id: "hoodie", name: "후드·맨투맨" },
  OUTER: { id: "outer", name: "아우터" },
  PANTS: { id: "pants", name: "팬츠" }
};

export const CLOTHES_DB = [
  // 1. 티셔츠 (6종)
  {
    id: "t1",
    brand: "유니클로",
    name: "U 크루넥 티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45, chest: 50, length: 66, sleeve: 20.5 },
      M: { shoulder: 46.5, chest: 53, length: 69, sleeve: 21.75 },
      L: { shoulder: 48, chest: 56, length: 72, sleeve: 23 },
      XL: { shoulder: 50, chest: 60, length: 75, sleeve: 24 },
      XXL: { shoulder: 52, chest: 64, length: 77, sleeve: 24 }
    }
  },
  {
    id: "t2",
    brand: "유니클로",
    name: "에어리즘 코튼 오버사이즈 크루넥 티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 51, chest: 52.5, length: 66, sleeve: 25.5 },
      M: { shoulder: 52.5, chest: 55.5, length: 69, sleeve: 26.75 },
      L: { shoulder: 54, chest: 58.5, length: 72, sleeve: 28 },
      XL: { shoulder: 56, chest: 62.5, length: 75, sleeve: 29 },
      XXL: { shoulder: 58, chest: 66.5, length: 77.5, sleeve: 29 }
    }
  },
  {
    id: "t3",
    brand: "스투시",
    name: "베이직 스투시 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 48, chest: 49.53, length: 71.12, sleeve: 22.86 },
      M: { shoulder: 50, chest: 54.61, length: 73.66, sleeve: 24.13 },
      L: { shoulder: 52, chest: 59.69, length: 76.2, sleeve: 25.4 },
      XL: { shoulder: 54, chest: 64.77, length: 78.74, sleeve: 26.67 },
      XXL: { shoulder: 56, chest: 69.85, length: 81.28, sleeve: 26.67 }
    }
  },
  {
    id: "t4",
    brand: "SPAO",
    name: "루즈핏 반팔티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 52, chest: 53, length: 69, sleeve: 23 },
      M: { shoulder: 53.5, chest: 55.5, length: 71, sleeve: 24 },
      L: { shoulder: 55, chest: 58, length: 73, sleeve: 25 },
      XL: { shoulder: 56.5, chest: 60.5, length: 75, sleeve: 26 },
      XXL: { shoulder: 58, chest: 63, length: 76, sleeve: 27 }
    }
  },
  {
    id: "t5",
    brand: "무인양품",
    name: "크루넥 반팔 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45, chest: 52, length: 68, sleeve: 22 },
      M: { shoulder: 47, chest: 55, length: 70, sleeve: 22 },
      L: { shoulder: 48, chest: 57, length: 72, sleeve: 23 },
      XL: { shoulder: 50, chest: 61, length: 74, sleeve: 24 },
      XXL: { shoulder: 52, chest: 65, length: 76, sleeve: 24 }
    }
  },
  {
    id: "t6",
    brand: "무신사 스탠다드",
    name: "릴렉스 핏 크루 넥 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 50, chest: 53, length: 68, sleeve: 24 },
      M: { shoulder: 51.5, chest: 55.5, length: 69.5, sleeve: 25 },
      L: { shoulder: 53, chest: 58, length: 71, sleeve: 26 },
      XL: { shoulder: 54.5, chest: 60.5, length: 72.5, sleeve: 27 },
      XXL: { shoulder: 56, chest: 63, length: 73.5, sleeve: 28 }
    }
  },

  // 2. 후드·맨투맨 (5종)
  {
    id: "h1",
    brand: "챔피온/나이키",
    name: "리버스위브 크루넥 / 나이키 클럽 크루 스웨트셔츠",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 47, chest: 55, length: 70, sleeve: 68.5 },
      M: { shoulder: 52, chest: 60, length: 72, sleeve: 69 },
      L: { shoulder: 56, chest: 65, length: 75, sleeve: 69 },
      XL: { shoulder: 60, chest: 70, length: 77, sleeve: 70 },
      XXL: { shoulder: 64, chest: 76, length: 80, sleeve: 69 }
    }
  },
  {
    id: "h2",
    brand: "유니클로",
    name: "스웨트 풀오버 후디",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 43.5, chest: 51, length: 65, sleeve: 64 },
      M: { shoulder: 43.5, chest: 54.5, length: 67.5, sleeve: 64 },
      L: { shoulder: 45.5, chest: 57, length: 69, sleeve: 65 },
      XL: { shoulder: 46, chest: 60.5, length: 69, sleeve: 65 },
      XXL: { shoulder: 49.5, chest: 62.5, length: 71, sleeve: 65 }
    }
  },
  {
    id: "h3",
    brand: "스투시",
    name: "베이직 스투시 후드",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 56, chest: 57, length: 66, sleeve: 52.5 },
      M: { shoulder: 57.5, chest: 60, length: 69, sleeve: 54.25 },
      L: { shoulder: 59, chest: 63, length: 72, sleeve: 56 },
      XL: { shoulder: 61, chest: 67, length: 75, sleeve: 57.5 },
      XXL: { shoulder: 63, chest: 71, length: 77, sleeve: 57.5 }
    }
  },
  {
    id: "h4",
    brand: "챔피온",
    name: "리버스위브 후드",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 53.34, chest: 57.15, length: 68.58, sleeve: 61.72 },
      M: { shoulder: 55.88, chest: 59.69, length: 71.12, sleeve: 64.26 },
      L: { shoulder: 58.42, chest: 62.23, length: 73.66, sleeve: 66.8 },
      XL: { shoulder: 60.96, chest: 64.77, length: 76.2, sleeve: 69.34 },
      XXL: { shoulder: 63.5, chest: 67.31, length: 78.74, sleeve: 71.88 }
    }
  },
  {
    id: "h5",
    brand: "나이키",
    name: "클럽 풀오버 후디",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 47, chest: 54, length: 63, sleeve: 57.5 },
      M: { shoulder: 49, chest: 56, length: 66, sleeve: 59.5 },
      L: { shoulder: 51, chest: 58, length: 69, sleeve: 61.5 },
      XL: { shoulder: 53, chest: 60, length: 72, sleeve: 63.5 },
      XXL: { shoulder: 55, chest: 62, length: 75, sleeve: 65.5 }
    }
  },

  // 3. 아우터 (8종)
  {
    id: "o1",
    brand: "노스페이스",
    name: "눕시 다운 재킷(맨즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      XS: { shoulder: 50.8, chest: 54, length: 65.7, sleeve: 64.6 },
      S: { shoulder: 50.8, chest: 54, length: 66, sleeve: 64.6 },
      M: { shoulder: 52.7, chest: 57.8, length: 67.6, sleeve: 65 },
      L: { shoulder: 54.6, chest: 61.6, length: 69.2, sleeve: 65.4 },
      XL: { shoulder: 56.5, chest: 65.4, length: 71.4, sleeve: 66.3 },
      XXL: { shoulder: 59.1, chest: 70.5, length: 74, sleeve: 66.3 }
    }
  },
  {
    id: "o2",
    brand: "노스페이스",
    name: "눕시 다운 재킷(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    measurements: {
      XS: { shoulder: 47, chest: 54, length: 54, sleeve: 58 },
      S: { shoulder: 48.5, chest: 56.5, length: 56, sleeve: 59 },
      M: { shoulder: 50, chest: 59, length: 58, sleeve: 60 },
      L: { shoulder: 51.5, chest: 61.5, length: 60, sleeve: 61 },
      XL: { shoulder: 53, chest: 64, length: 62, sleeve: 62 }
    }
  },
  {
    id: "o3",
    brand: "아디다스",
    name: "파이어버드 트랙탑(맨즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    measurements: {
      XS: { shoulder: 50, chest: 55, length: 66, sleeve: 63 },
      S: { shoulder: 51.5, chest: 57, length: 68, sleeve: 63.5 },
      M: { shoulder: 53, chest: 60, length: 70, sleeve: 64 },
      L: { shoulder: 54.5, chest: 63, length: 72, sleeve: 64.5 },
      XL: { shoulder: 55, chest: 66, length: 73.5, sleeve: 65 },
      "2XL": { shoulder: 57, chest: 70, length: 75, sleeve: 65.5 }
    }
  },
  {
    id: "o4",
    brand: "아디다스",
    name: "파이어버드 트랙탑(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
    measurements: {
      XS: { shoulder: 33, chest: 43.5, length: 48, sleeve: 60 },
      S: { shoulder: 35, chest: 45, length: 50, sleeve: 60.5 },
      M: { shoulder: 36.5, chest: 47.5, length: 51, sleeve: 61 },
      L: { shoulder: 38, chest: 49.5, length: 52, sleeve: 61.5 },
      XL: { shoulder: 40, chest: 52, length: 53, sleeve: 62 },
      "2XL": { shoulder: 42, chest: 53.5, length: 54, sleeve: 62.5 }
    }
  },
  {
    id: "o5",
    brand: "유니클로",
    name: "울트라라이트 다운 재킷(맨즈)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    measurements: {
      S: { shoulder: 44, chest: 51.5, length: 62.5, sleeve: 64 },
      M: { shoulder: 45.5, chest: 54.5, length: 64.5, sleeve: 66.5 },
      L: { shoulder: 47, chest: 57.5, length: 66.5, sleeve: 69 },
      XL: { shoulder: 49, chest: 61.5, length: 69.5, sleeve: 71.5 },
      XXL: { shoulder: 51, chest: 65.5, length: 70.5, sleeve: 72.5 },
      "3XL": { shoulder: 53, chest: 69.5, length: 71.5, sleeve: 73.5 }
    }
  },
  {
    id: "o6",
    brand: "유니클로",
    name: "울트라라이트 다운 재킷(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    measurements: {
      XS: { shoulder: 37, chest: 45, length: 56.5, sleeve: 56 },
      S: { shoulder: 38, chest: 47, length: 58.5, sleeve: 58 },
      M: { shoulder: 39, chest: 49, length: 60.5, sleeve: 60 },
      L: { shoulder: 40, chest: 51, length: 62.5, sleeve: 61.5 },
      XL: { shoulder: 41.5, chest: 54, length: 64.5, sleeve: 62.5 },
      XXL: { shoulder: 42.5, chest: 57, length: 65.5, sleeve: 63 },
      "3XL": { shoulder: 44, chest: 61, length: 66.5, sleeve: 63.5 }
    }
  },
  {
    id: "o7",
    brand: "칼하트",
    name: "K122 미드웨이트 후드집업(공용)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "2XL"],
    measurements: {
      S: { shoulder: 50, chest: 55, length: 71, sleeve: 65 },
      M: { shoulder: 52, chest: 60, length: 74.5, sleeve: 66 },
      L: { shoulder: 55, chest: 65, length: 77, sleeve: 67 },
      XL: { shoulder: 57, chest: 70, length: 79, sleeve: 68 },
      "2XL": { shoulder: 60, chest: 73, length: 80.5, sleeve: 70 }
    }
  },
  {
    id: "o8",
    brand: "무신사 스탠다드",
    name: "후디드 스웨트 집업(공용)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    measurements: {
      S: { shoulder: 46.5, chest: 52, length: 64.5, sleeve: 61 },
      M: { shoulder: 48.5, chest: 54.5, length: 66.5, sleeve: 63 },
      L: { shoulder: 50, chest: 57, length: 67.5, sleeve: 64 },
      XL: { shoulder: 51.5, chest: 59.5, length: 69, sleeve: 65 },
      "2XL": { shoulder: 53, chest: 62, length: 70.5, sleeve: 66 },
      "3XL": { shoulder: 54.5, chest: 64.5, length: 70.5, sleeve: 66 }
    }
  },

  // 4. 팬츠 (11종)
  // DB 필드 매핑:
  // shoulder -> waist (허리단면)
  // chest -> thigh (허벅지단면)
  // length -> length (총장)
  // sleeve -> rise (밑위)
  {
    id: "p1",
    brand: "유니클로",
    name: "레귤러핏진",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(36)"],
    measurements: {
      "S(28)": { shoulder: 38.5, chest: 33, length: 104, sleeve: 28.5 },
      "M(30)": { shoulder: 41, chest: 34.5, length: 105, sleeve: 29 },
      "L(32)": { shoulder: 43.5, chest: 36, length: 105, sleeve: 29.5 },
      "XL(34)": { shoulder: 46, chest: 37, length: 106, sleeve: 30 },
      "XXL(36)": { shoulder: 48.5, chest: 38.5, length: 106, sleeve: 30.5 }
    }
  },
  {
    id: "p2",
    brand: "유니클로",
    name: "와이드테이퍼드진",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(35)"],
    measurements: {
      "S(28)": { shoulder: 38.5, chest: 34.5, length: 102, sleeve: 29 },
      "M(30)": { shoulder: 41, chest: 35.5, length: 103, sleeve: 29.5 },
      "L(32)": { shoulder: 43.5, chest: 37, length: 104, sleeve: 30 },
      "XL(34)": { shoulder: 46, chest: 38.5, length: 105, sleeve: 30.5 },
      "XXL(35)": { shoulder: 47.25, chest: 39, length: 105, sleeve: 31 }
    }
  },
  {
    id: "p3",
    brand: "유니클로",
    name: "JWA 스트레이트진",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(36)"],
    measurements: {
      "S(28)": { shoulder: 38.5, chest: 32, length: 102, sleeve: 26.5 },
      "M(30)": { shoulder: 41, chest: 33, length: 103, sleeve: 27 },
      "L(32)": { shoulder: 43.5, chest: 34, length: 104, sleeve: 27.5 },
      "XL(34)": { shoulder: 46, chest: 35.5, length: 105, sleeve: 28 },
      "XXL(36)": { shoulder: 48.5, chest: 36.5, length: 105, sleeve: 28.5 }
    }
  },
  {
    id: "p4",
    brand: "유니클로U",
    name: "와이드핏치노팬츠",
    category: "pants",
    availableSizes: ["S(76)", "M(82)", "L(88)", "XL(95)", "XXL(100)"],
    measurements: {
      "S(76)": { shoulder: 40.5, chest: 35.5, length: 104, sleeve: 29 },
      "M(82)": { shoulder: 43.5, chest: 38, length: 105, sleeve: 30 },
      "L(88)": { shoulder: 46.5, chest: 40, length: 106, sleeve: 31 },
      "XL(95)": { shoulder: 50, chest: 42, length: 107, sleeve: 31.5 },
      "XXL(100)": { shoulder: 52.5, chest: 44, length: 107, sleeve: 32.5 }
    }
  },
  {
    id: "p5",
    brand: "유니클로",
    name: "파라슈트 팬츠",
    category: "pants",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 35, chest: 36.5, length: 102, sleeve: 30 },
      M: { shoulder: 38, chest: 38.5, length: 103, sleeve: 31 },
      L: { shoulder: 41, chest: 40, length: 104, sleeve: 32 },
      XL: { shoulder: 45, chest: 42, length: 105, sleeve: 32.5 },
      XXL: { shoulder: 48, chest: 43.5, length: 105, sleeve: 33.5 }
    }
  },
  {
    id: "p6",
    brand: "유니U",
    name: "턱와이드팬츠",
    category: "pants",
    availableSizes: ["S(73)", "M(79)", "L(85)", "XL(91)", "XXL(95)"],
    measurements: {
      "S(73)": { shoulder: 39, chest: 36.5, length: 103, sleeve: 29 },
      "M(79)": { shoulder: 42, chest: 39, length: 104, sleeve: 29.5 },
      "L(85)": { shoulder: 45, chest: 41, length: 105, sleeve: 30.5 },
      "XL(91)": { shoulder: 48, chest: 43, length: 105, sleeve: 31 },
      "XXL(95)": { shoulder: 50, chest: 44, length: 106, sleeve: 32 }
    }
  },
  {
    id: "p7",
    brand: "무한스탠다드",
    name: "레플리카 퍼티그 팬츠",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(38)"],
    measurements: {
      "S(28)": { shoulder: 37.5, chest: 31, length: 106, sleeve: 28 },
      "M(30)": { shoulder: 40, chest: 32.3, length: 107, sleeve: 28.5 },
      "L(32)": { shoulder: 42.5, chest: 33.5, length: 107, sleeve: 29 },
      "XL(34)": { shoulder: 45, chest: 34.8, length: 108, sleeve: 30 },
      "XXL(38)": { shoulder: 50, chest: 37.3, length: 109, sleeve: 32 }
    }
  },
  {
    id: "p8",
    brand: "무한스탠다드",
    name: "오피서",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(38)"],
    measurements: {
      "S(28)": { shoulder: 37.5, chest: 31, length: 106, sleeve: 29 },
      "M(30)": { shoulder: 40, chest: 32.25, length: 107, sleeve: 29.5 },
      "L(32)": { shoulder: 42.5, chest: 33.5, length: 107, sleeve: 30 },
      "XL(34)": { shoulder: 45, chest: 34.75, length: 108, sleeve: 31 },
      "XXL(38)": { shoulder: 50, chest: 37.25, length: 109, sleeve: 33 }
    }
  },
  {
    id: "p9",
    brand: "무한스탠다드",
    name: "와이드데님",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(38)"],
    measurements: {
      "S(28)": { shoulder: 38, chest: 32.5, length: 106, sleeve: 30.5 },
      "M(30)": { shoulder: 40.5, chest: 33.8, length: 107, sleeve: 31 },
      "L(32)": { shoulder: 43, chest: 35, length: 107, sleeve: 31.5 },
      "XL(34)": { shoulder: 45.5, chest: 36.3, length: 108, sleeve: 32.5 },
      "XXL(38)": { shoulder: 50.5, chest: 38.8, length: 109, sleeve: 34.5 }
    }
  },
  {
    id: "p10",
    brand: "무한스탠다드",
    name: "세미 와이드 슬릿 히든 밴딩 슬랙스",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(38)"],
    measurements: {
      "S(28)": { shoulder: 37.5, chest: 30.5, length: 101.5, sleeve: 26.5 },
      "M(30)": { shoulder: 40, chest: 31.8, length: 102.5, sleeve: 27 },
      "L(32)": { shoulder: 42.5, chest: 33, length: 102.5, sleeve: 27.5 },
      "XL(34)": { shoulder: 45, chest: 34.3, length: 103.5, sleeve: 28.5 },
      "XXL(38)": { shoulder: 50, chest: 36.7, length: 104.5, sleeve: 30.5 }
    }
  },
  {
    id: "p11",
    brand: "무한스탠다드",
    name: "리얼 와이드 히든 밴딩 슬랙스",
    category: "pants",
    availableSizes: ["S(28)", "M(30)", "L(32)", "XL(34)", "XXL(38)"],
    measurements: {
      "S(28)": { shoulder: 37.5, chest: 34.3, length: 104, sleeve: 28.5 },
      "M(30)": { shoulder: 40, chest: 35.5, length: 105, sleeve: 29 },
      "L(32)": { shoulder: 42.5, chest: 36.8, length: 105, sleeve: 29.5 },
      "XL(34)": { shoulder: 45, chest: 38, length: 106, sleeve: 30.5 },
      "XXL(38)": { shoulder: 50, chest: 40.5, length: 107, sleeve: 32.5 }
    }
  }
];
