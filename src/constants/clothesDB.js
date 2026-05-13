// src/constants/clothesDB.js

export const CATEGORIES = {
  TSHIRT: { id: "tshirt", name: "티셔츠" },
  HOODIE: { id: "hoodie", name: "후드·맨투맨" },
  OUTER: { id: "outer", name: "아우터" },
  PANTS: { id: "pants", name: "팬츠" }
};

export const CLOTHES_DB = [
  // 1. 티셔츠 (7종)
  {
    id: "t1",
    brand: "유니클로",
    name: "U 크루넥 티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 44.5, chest: 49, length: 68, sleeve: 21 },
      M: { shoulder: 46, chest: 52, length: 71, sleeve: 22 },
      L: { shoulder: 47.5, chest: 55, length: 74, sleeve: 23 },
      XL: { shoulder: 49.5, chest: 59, length: 77, sleeve: 24.5 },
      XXL: { shoulder: 51.5, chest: 63, length: 79, sleeve: 25.5 }
    }
  },
  {
    id: "t2",
    brand: "유니클로",
    name: "에어리즘 코튼 오버사이즈 크루넥 티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 51.5, chest: 54, length: 68.5, sleeve: 23 },
      M: { shoulder: 53, chest: 57, length: 71.5, sleeve: 24 },
      L: { shoulder: 54.5, chest: 60, length: 74.5, sleeve: 25 },
      XL: { shoulder: 56.5, chest: 64, length: 77.5, sleeve: 26 },
      XXL: { shoulder: 58.5, chest: 68, length: 79.5, sleeve: 27 }
    }
  },
  {
    id: "t3",
    brand: "스투시",
    name: "베이직 스투시 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45.5, chest: 48, length: 70, sleeve: 21 },
      M: { shoulder: 47.5, chest: 51, length: 72, sleeve: 22 },
      L: { shoulder: 49.5, chest: 54, length: 75, sleeve: 23 },
      XL: { shoulder: 52, chest: 58, length: 78, sleeve: 24 },
      XXL: { shoulder: 54.5, chest: 62, length: 80, sleeve: 25 }
    }
  },
  {
    id: "t4",
    brand: "SPAO",
    name: "루즈핏 반팔티",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 48, chest: 51, length: 69, sleeve: 22 },
      M: { shoulder: 50, chest: 54, length: 72, sleeve: 23 },
      L: { shoulder: 52, chest: 57, length: 75, sleeve: 24 },
      XL: { shoulder: 54, chest: 60, length: 77, sleeve: 25 }
    }
  },
  {
    id: "t5",
    brand: "무인양품",
    name: "크루넥 반팔 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 42, chest: 47, length: 65, sleeve: 20 },
      M: { shoulder: 43.5, chest: 50, length: 68, sleeve: 21 },
      L: { shoulder: 45, chest: 53, length: 71, sleeve: 22 },
      XL: { shoulder: 47, chest: 57, length: 74, sleeve: 23.5 }
    }
  },
  {
    id: "t6",
    brand: "무신사 스탠다드",
    name: "릴렉스 핏 크루 넥 티셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 49.5, chest: 52.5, length: 69, sleeve: 21.5 },
      M: { shoulder: 51, chest: 55, length: 71, sleeve: 22.5 },
      L: { shoulder: 52.5, chest: 57.5, length: 73, sleeve: 23.5 },
      XL: { shoulder: 54, chest: 60, length: 75, sleeve: 24.5 },
      XXL: { shoulder: 55.5, chest: 62.5, length: 77, sleeve: 25.5 }
    }
  },
  {
    id: "t7",
    brand: "폴로 랄프로렌",
    name: "클래식핏 옥스포드 셔츠",
    category: "tshirt",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 44, chest: 52, length: 75, sleeve: 62 },
      M: { shoulder: 46, chest: 55, length: 77, sleeve: 64 },
      L: { shoulder: 48, chest: 59, length: 79, sleeve: 66 },
      XL: { shoulder: 50, chest: 63, length: 81, sleeve: 68 },
      XXL: { shoulder: 52, chest: 67, length: 83, sleeve: 69 }
    }
  },

  // 2. 후드·맨투맨 (6종)
  {
    id: "h1",
    brand: "챔피언",
    name: "리버스위브 크루넥",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 44, chest: 53, length: 64, sleeve: 63 },
      M: { shoulder: 48, chest: 58, length: 66, sleeve: 65 },
      L: { shoulder: 51, chest: 62, length: 68, sleeve: 67 },
      XL: { shoulder: 54, chest: 66, length: 71, sleeve: 68 },
      XXL: { shoulder: 57, chest: 71, length: 73, sleeve: 69 }
    }
  },
  {
    id: "h2",
    brand: "나이키",
    name: "클럽 크루 스웨트셔츠",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45, chest: 52, length: 66, sleeve: 62 },
      M: { shoulder: 47, chest: 56, length: 68, sleeve: 64 },
      L: { shoulder: 49, chest: 60, length: 70, sleeve: 66 },
      XL: { shoulder: 51, chest: 64, length: 72, sleeve: 67 },
      XXL: { shoulder: 53, chest: 68, length: 74, sleeve: 68 }
    }
  },
  {
    id: "h3",
    brand: "유니클로",
    name: "스웨트 풀오버 후디",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 46.5, chest: 52.5, length: 64, sleeve: 59 },
      M: { shoulder: 48, chest: 55.5, length: 67, sleeve: 61 },
      L: { shoulder: 49.5, chest: 58.5, length: 70, sleeve: 63 },
      XL: { shoulder: 51.5, chest: 62.5, length: 73, sleeve: 64.5 },
      XXL: { shoulder: 53.5, chest: 66.5, length: 75, sleeve: 65.5 }
    }
  },
  {
    id: "h4",
    brand: "스투시",
    name: "베이직 스투시 후드",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 48, chest: 55, length: 68, sleeve: 62 },
      M: { shoulder: 51, chest: 58, length: 71, sleeve: 64 },
      L: { shoulder: 53, chest: 61, length: 74, sleeve: 66 },
      XL: { shoulder: 56, chest: 64, length: 76, sleeve: 68 },
      XXL: { shoulder: 58, chest: 67, length: 78, sleeve: 70 }
    }
  },
  {
    id: "h5",
    brand: "챔피언",
    name: "리버스위브 후드",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45, chest: 54, length: 65, sleeve: 64 },
      M: { shoulder: 49, chest: 59, length: 67, sleeve: 66 },
      L: { shoulder: 52, chest: 63, length: 69, sleeve: 68 },
      XL: { shoulder: 55, chest: 67, length: 72, sleeve: 69 },
      XXL: { shoulder: 58, chest: 72, length: 74, sleeve: 70 }
    }
  },
  {
    id: "h6",
    brand: "나이키",
    name: "클럽 풀오버 후디",
    category: "hoodie",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 46, chest: 53, length: 67, sleeve: 63 },
      M: { shoulder: 48, chest: 57, length: 69, sleeve: 65 },
      L: { shoulder: 50, chest: 61, length: 71, sleeve: 67 },
      XL: { shoulder: 52, chest: 65, length: 73, sleeve: 68 },
      XXL: { shoulder: 54, chest: 69, length: 75, sleeve: 69 }
    }
  },

  // 3. 아우터 (8종)
  {
    id: "o1",
    brand: "노스페이스",
    name: "눕시 다운 재킷(맨즈)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 50, chest: 56, length: 64, sleeve: 61 },
      M: { shoulder: 52, chest: 59, length: 66, sleeve: 63 },
      L: { shoulder: 54, chest: 62, length: 68, sleeve: 65 },
      XL: { shoulder: 56, chest: 65, length: 70, sleeve: 67 },
      XXL: { shoulder: 58, chest: 68, length: 72, sleeve: 68 }
    }
  },
  {
    id: "o2",
    brand: "노스페이스",
    name: "눕시 다운 재킷(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L"],
    measurements: {
      XS: { shoulder: 43, chest: 49, length: 55, sleeve: 56 },
      S: { shoulder: 45, chest: 52, length: 57, sleeve: 58 },
      M: { shoulder: 47, chest: 55, length: 59, sleeve: 60 },
      L: { shoulder: 49, chest: 58, length: 61, sleeve: 62 }
    }
  },
  {
    id: "o3",
    brand: "아디다스",
    name: "파이어버드 트랙탑(맨즈)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 46, chest: 52, length: 66, sleeve: 62 },
      M: { shoulder: 48, chest: 55, length: 68, sleeve: 63 },
      L: { shoulder: 50, chest: 58, length: 70, sleeve: 64 },
      XL: { shoulder: 52, chest: 61, length: 72, sleeve: 65 },
      XXL: { shoulder: 54, chest: 64, length: 74, sleeve: 66 }
    }
  },
  {
    id: "o4",
    brand: "아디다스",
    name: "파이어버드 트랙탑(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L"],
    measurements: {
      XS: { shoulder: 38, chest: 45, length: 56, sleeve: 58 },
      S: { shoulder: 40, chest: 48, length: 58, sleeve: 59 },
      M: { shoulder: 42, chest: 51, length: 60, sleeve: 60 },
      L: { shoulder: 44, chest: 54, length: 62, sleeve: 61 }
    }
  },
  {
    id: "o5",
    brand: "유니클로",
    name: "울트라라이트 다운 재킷(맨즈)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 45.5, chest: 53.5, length: 64, sleeve: 61.5 },
      M: { shoulder: 47, chest: 56.5, length: 66, sleeve: 63.5 },
      L: { shoulder: 48.5, chest: 59.5, length: 68, sleeve: 65.5 },
      XL: { shoulder: 50.5, chest: 63.5, length: 71, sleeve: 67 },
      XXL: { shoulder: 52.5, chest: 67.5, length: 73, sleeve: 68 }
    }
  },
  {
    id: "o6",
    brand: "유니클로",
    name: "울트라라이트 다운 재킷(우먼즈)",
    category: "outer",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    measurements: {
      XS: { shoulder: 38, chest: 46.5, length: 56, sleeve: 57.5 },
      S: { shoulder: 39, chest: 48.5, length: 58, sleeve: 58.5 },
      M: { shoulder: 40, chest: 51.5, length: 60, sleeve: 59.5 },
      L: { shoulder: 41.5, chest: 54.5, length: 62, sleeve: 60.5 },
      XL: { shoulder: 43, chest: 57.5, length: 64, sleeve: 61.5 }
    }
  },
  {
    id: "o7",
    brand: "칼하트",
    name: "K122 미드웨이트 후드집업(공용)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 51, chest: 58, length: 71, sleeve: 65 },
      M: { shoulder: 54, chest: 63, length: 73, sleeve: 66 },
      L: { shoulder: 57, chest: 68, length: 75, sleeve: 67 },
      XL: { shoulder: 60, chest: 73, length: 77, sleeve: 68 },
      XXL: { shoulder: 63, chest: 78, length: 79, sleeve: 69 }
    }
  },
  {
    id: "o8",
    brand: "무신사 스탠다드",
    name: "후디드 스웨트 집업(공용)",
    category: "outer",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    measurements: {
      S: { shoulder: 51.5, chest: 56, length: 65, sleeve: 60.5 },
      M: { shoulder: 53, chest: 58.5, length: 67, sleeve: 61.5 },
      L: { shoulder: 54.5, chest: 61, length: 69, sleeve: 62.5 },
      XL: { shoulder: 56, chest: 63.5, length: 71, sleeve: 63.5 },
      XXL: { shoulder: 57.5, chest: 66, length: 73, sleeve: 64.5 }
    }
  },

  // 4. 팬츠 (10종)
  // 하의의 실측은 어깨너비/가슴단면 대신 허리단면(waist), 밑위(rise), 허벅지(thigh), 총장(length) 등으로 매핑하여 
  // 화면 렌더링 시 알맞게 라벨을 교체해 줍니다.
  // DB 필드 매핑:
  // shoulder -> waist (허리단면)
  // chest -> thigh (허벅지단면)
  // length -> length (총장)
  // sleeve -> rise (밑위)
  {
    id: "p1",
    brand: "후러브스아트",
    name: "세미 와이드 밴딩 슬랙스(공용)",
    category: "pants",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 34, chest: 29, length: 98, sleeve: 28 }, // 허리 34, 허벅지 29, 총장 98, 밑위 28
      M: { shoulder: 36, chest: 31, length: 100, sleeve: 29 },
      L: { shoulder: 38, chest: 33, length: 102, sleeve: 30 },
      XL: { shoulder: 40, chest: 35, length: 104, sleeve: 31 }
    }
  },
  {
    id: "p2",
    brand: "제로",
    name: "Deep One Tuck Sweat Pants(공용)",
    category: "pants",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 35, chest: 32, length: 99, sleeve: 31 },
      M: { shoulder: 37, chest: 34, length: 101, sleeve: 32 },
      L: { shoulder: 39, chest: 36, length: 103, sleeve: 33 },
      XL: { shoulder: 41, chest: 38, length: 105, sleeve: 34 }
    }
  },
  {
    id: "p3",
    brand: "아디다스",
    name: "BB 트랙팬츠(공용)",
    category: "pants",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 33, chest: 30, length: 97, sleeve: 27 },
      M: { shoulder: 35, chest: 32, length: 99, sleeve: 28 },
      L: { shoulder: 37, chest: 34, length: 101, sleeve: 29 },
      XL: { shoulder: 39, chest: 36, length: 103, sleeve: 30 }
    }
  },
  {
    id: "p4",
    brand: "리바이스",
    name: "501 오리지널 데님(여성)",
    category: "pants",
    availableSizes: ["25", "26", "27", "28", "29"],
    measurements: {
      25: { shoulder: 33.5, chest: 26.5, length: 94, sleeve: 25 },
      26: { shoulder: 35, chest: 27.5, length: 95, sleeve: 25.5 },
      27: { shoulder: 36.5, chest: 28.5, length: 96, sleeve: 26 },
      28: { shoulder: 38, chest: 29.5, length: 97, sleeve: 26.5 },
      29: { shoulder: 39.5, chest: 30.5, length: 98, sleeve: 27 }
    }
  },
  {
    id: "p5",
    brand: "유니클로",
    name: "저지 배럴 레그팬츠(여성)",
    category: "pants",
    availableSizes: ["S", "M", "L", "XL"],
    measurements: {
      S: { shoulder: 32, chest: 31, length: 96, sleeve: 29.5 },
      M: { shoulder: 34, chest: 32.5, length: 98, sleeve: 30.5 },
      L: { shoulder: 36, chest: 34, length: 100, sleeve: 31.5 },
      XL: { shoulder: 39, chest: 36, length: 101, sleeve: 32.5 }
    }
  },
  {
    id: "p6",
    brand: "무신사 스탠다드",
    name: "우먼 파라슈트 팬츠(여성)",
    category: "pants",
    availableSizes: ["S", "M", "L"],
    measurements: {
      S: { shoulder: 31.5, chest: 33, length: 98, sleeve: 32 },
      M: { shoulder: 33.5, chest: 34.2, length: 100, sleeve: 33 },
      L: { shoulder: 35.5, chest: 35.4, length: 102, sleeve: 34 }
    }
  },
  {
    id: "p7",
    brand: "유니클로",
    name: "와이드 치노 팬츠(남성)",
    category: "pants",
    availableSizes: ["73", "76", "79", "82", "85"],
    measurements: {
      73: { shoulder: 37, chest: 32.5, length: 101, sleeve: 28.5 },
      76: { shoulder: 38.5, chest: 33.5, length: 102, sleeve: 29.5 },
      79: { shoulder: 40, chest: 34.5, length: 103, sleeve: 30.5 },
      82: { shoulder: 41.5, chest: 35.5, length: 104, sleeve: 31.5 },
      85: { shoulder: 43, chest: 36.5, length: 105, sleeve: 32.5 }
    }
  },
  {
    id: "p8",
    brand: "유니클로",
    name: "울트라스트레치 슬림 팬츠(남성)",
    category: "pants",
    availableSizes: ["73", "76", "79", "82", "85"],
    measurements: {
      73: { shoulder: 36.5, chest: 27.5, length: 100, sleeve: 25 },
      76: { shoulder: 38, chest: 28.5, length: 101, sleeve: 25.5 },
      79: { shoulder: 39.5, chest: 29.5, length: 102, sleeve: 26 },
      82: { shoulder: 41, chest: 30.5, length: 103, sleeve: 26.5 },
      85: { shoulder: 42.5, chest: 31.5, length: 104, sleeve: 27 }
    }
  },
  {
    id: "p9",
    brand: "리바이스",
    name: "501 오리지널 데님(남성)",
    category: "pants",
    availableSizes: ["28", "30", "32", "34", "36"],
    measurements: {
      28: { shoulder: 36.5, chest: 28, length: 101, sleeve: 26 },
      30: { shoulder: 39, chest: 29.5, length: 102, sleeve: 27 },
      32: { shoulder: 41.5, chest: 31, length: 103, sleeve: 28 },
      34: { shoulder: 44, chest: 32.5, length: 104, sleeve: 29 },
      36: { shoulder: 46.5, chest: 34, length: 105, sleeve: 30 }
    }
  },
  {
    id: "p10",
    brand: "무신사 스탠다드",
    name: "세미 와이드 히든 밴딩 슬랙스(남성)",
    category: "pants",
    availableSizes: ["28", "29", "30", "31", "32", "33", "34"],
    measurements: {
      28: { shoulder: 37, chest: 30.5, length: 99, sleeve: 27.5 },
      29: { shoulder: 38.2, chest: 31.1, length: 100, sleeve: 28 },
      30: { shoulder: 39.5, chest: 31.7, length: 101, sleeve: 28.5 },
      31: { shoulder: 40.7, chest: 32.3, length: 102, sleeve: 29 },
      32: { shoulder: 42, chest: 32.9, length: 103, sleeve: 29.5 },
      33: { shoulder: 43.2, chest: 33.5, length: 104, sleeve: 30 },
      34: { shoulder: 44.5, chest: 34.1, length: 105, sleeve: 30.5 }
    }
  }
];
