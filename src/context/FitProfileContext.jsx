// src/context/FitProfileContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const FitProfileContext = createContext(null);

const defaultUsersList = [
  {
    nickname: "gubi_pioneer",
    gender: "남",
    height: 178,
    weight: 72,
    usualSize: "L",
    preferredFit: "regular",
    bodyCharacteristics: ["어깨가 넓은 편", "팔이 긴 편"],
    baseClothesList: {
      tshirt: "Stussy World Tour Tee — L 사이즈",
      hoodie: "미등록 (스킵함)",
      outer: "Carhartt WIP 오가닉 자켓 — L 사이즈",
      pants: "미등록 (스킵함)"
    }
  },
  {
    nickname: "stylish_hanna",
    gender: "여",
    height: 165,
    weight: 49,
    usualSize: "S",
    preferredFit: "slim",
    bodyCharacteristics: ["다리가 긴 편"],
    baseClothesList: {
      tshirt: "미등록 (스킵함)",
      hoodie: "Nike 스포츠웨어 크루넥 후드 — S 사이즈",
      outer: "미등록 (스킵함)",
      pants: "Levi's 빈티지 501 데님 — S 사이즈"
    }
  },
  {
    nickname: "overfit_monster",
    gender: "남",
    height: 185,
    weight: 84,
    usualSize: "XXL",
    preferredFit: "over",
    bodyCharacteristics: ["배가 나온 편", "허리가 얇은 편"],
    baseClothesList: {
      tshirt: "Stussy 8 Ball Tee — XL 사이즈",
      hoodie: "Nike 헤리티지 후디 — XL 사이즈",
      outer: "Palace 트라이퍼그 아우터 — XL 사이즈",
      pants: "Y-3 와이드 카고 팬츠 — L 사이즈"
    }
  },
  {
    nickname: "minimal_min",
    gender: "여",
    height: 170,
    weight: 54,
    usualSize: "M",
    preferredFit: "regular",
    bodyCharacteristics: ["골반이 넓은 편"],
    baseClothesList: {
      tshirt: "직접 입력 [티셔츠] (어깨 42 / 가슴 48 / 총장 64cm)",
      hoodie: "미등록 (스킵함)",
      outer: "미등록 (스킵함)",
      pants: "직접 입력 [팬츠] (허리 34 / 허벅지 28 / 총장 98cm)"
    }
  }
];

const initialProfileState = {
  user: {
    email: "",
    name: "",
    provider: ""
  },
  step: 0,
  basicInfo: {
    nickname: "",
    gender: "",
    height: "",
    weight: "",
    usualSize: "",
    sizeType: "alphabet"
  },
  measureMethod: null,

  directMeasure: {
    category: "tshirt",
    shoulder: "",
    chest: "",
    length: "",
    sleeve: "",
    waist: "",
    hip: "",
    thigh: "",
    rise: "",
    hem: ""
  },

  directMeasures: {
    tshirt: { length: "", shoulder: "", chest: "", sleeve: "" },
    hoodie: { length: "", shoulder: "", chest: "", sleeve: "" },
    outer: { length: "", shoulder: "", chest: "", sleeve: "" },
    pants: { length: "", waist: "", hip: "", thigh: "", rise: "", hem: "" }
  },

  dbMeasure: {
    category: "tshirt",
    selectedItem: null
  },

  dbMeasures: {
    tshirt: null,
    hoodie: null,
    outer: null,
    pants: null
  },

  detailedFit: {
    bodyCharacteristics: [],
    preferredFit: ""
  },

  usersList: defaultUsersList
};

export const FitProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("gubi_fit_profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.directMeasures) {
        parsed.directMeasures = initialProfileState.directMeasures;
      }
      if (!parsed.dbMeasures) {
        parsed.dbMeasures = initialProfileState.dbMeasures;
      }
      if (parsed.basicInfo && parsed.basicInfo.nickname === undefined) {
        parsed.basicInfo.nickname = "";
      }
      if (!parsed.usersList || parsed.usersList.length === 0) {
        parsed.usersList = defaultUsersList;
      }
      return parsed;
    }
    return initialProfileState;
  });

  useEffect(() => {
    localStorage.setItem("gubi_fit_profile", JSON.stringify(profile));
  }, [profile]);

  // Supabase로부터 가입 회원 정보를 전부 가져와 usersList를 동기화하는 함수
  const fetchUsersFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("❌ Supabase 데이터 조회 에러:", error.message);
        return;
      }

      if (data) {
        const formattedUsers = data.map(item => ({
          nickname: item.nickname,
          gender: item.gender,
          height: item.height,
          weight: item.weight,
          usualSize: item.usual_size,
          preferredFit: item.preferred_fit,
          bodyCharacteristics: item.body_characteristics || [],
          baseClothesList: {
            tshirt: item.tshirt_summary || "미등록 (스킵함)",
            hoodie: item.hoodie_summary || "미등록 (스킵함)",
            outer: item.outer_summary || "미등록 (스킵함)",
            pants: item.pants_summary || "미등록 (스킵함)"
          }
        }));

        setProfile(prev => ({
          ...prev,
          usersList: formattedUsers
        }));
        console.log("💚 Supabase에서 회원 목록을 성공적으로 불러왔습니다!");
      }
    } catch (err) {
      console.error("⚠️ Supabase 불러오기 오류:", err);
    }
  };

  useEffect(() => {
    fetchUsersFromSupabase();
  }, []);

  const setStep = (newStep) => {
    setProfile(prev => ({ ...prev, step: newStep }));
  };

  const setUser = (userData) => {
    setProfile(prev => ({ ...prev, user: { ...prev.user, ...userData } }));
  };

  const updateBasicInfo = (info) => {
    setProfile(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, ...info } }));
  };

  const setMeasureMethod = (method) => {
    setProfile(prev => ({ ...prev, measureMethod: method }));
  };

  const updateDirectMeasure = (measure) => {
    setProfile(prev => ({ ...prev, directMeasure: { ...prev.directMeasure, ...measure } }));
  };

  const updateDirectMeasures = (cat, measurements) => {
    setProfile(prev => {
      const updatedMeasures = {
        ...prev.directMeasures,
        [cat]: { ...prev.directMeasures[cat], ...measurements }
      };

      return {
        ...prev,
        directMeasure: {
          ...prev.directMeasure,
          category: cat,
          ...measurements
        },
        directMeasures: updatedMeasures
      };
    });
  };

  const updateDbMeasure = (dbMeasureData) => {
    setProfile(prev => ({ ...prev, dbMeasure: { ...prev.dbMeasure, ...dbMeasureData } }));
  };

  const updateDbMeasures = (cat, item) => {
    setProfile(prev => {
      const updated = {
        ...prev.dbMeasures,
        [cat]: item
      };

      return {
        ...prev,
        dbMeasures: updated,
        dbMeasure: {
          category: cat,
          selectedItem: item
        }
      };
    });
  };

  const resetMeasures = () => {
    setProfile(prev => ({
      ...prev,
      directMeasures: {
        tshirt: { length: "", shoulder: "", chest: "", sleeve: "" },
        hoodie: { length: "", shoulder: "", chest: "", sleeve: "" },
        outer: { length: "", shoulder: "", chest: "", sleeve: "" },
        pants: { length: "", waist: "", hip: "", thigh: "", rise: "", hem: "" }
      },
      dbMeasures: {
        tshirt: null,
        hoodie: null,
        outer: null,
        pants: null
      },
      directMeasure: {
        category: "tshirt",
        shoulder: "",
        chest: "",
        length: "",
        sleeve: "",
        waist: "",
        hip: "",
        thigh: "",
        rise: "",
        hem: ""
      },
      dbMeasure: {
        category: "tshirt",
        selectedItem: null
      }
    }));
  };

  const updateDetailedFit = (fitData) => {
    setProfile(prev => ({ ...prev, detailedFit: { ...prev.detailedFit, ...fitData } }));
  };

  // 4개 카테고리별 저장 상태를 추출하여 관리자 대시보드와 동기화하는 도우미 함수
  const getCategoryClothesSummary = (cat) => {
    const { directMeasures, dbMeasures } = profile;

    // 1. 브랜드 DB 선택 검수
    const dbItem = dbMeasures && dbMeasures[cat];
    if (dbItem && !dbItem.isSkipped && dbItem.brand && dbItem.size) {
      return `${dbItem.brand} ${dbItem.name} — ${dbItem.size}`;
    }

    // 2. 직접 입력 실측 검수
    const d = directMeasures && directMeasures[cat];
    if (d) {
      const hasDirect = cat === "pants"
        ? (Number(d.length) > 0 && Number(d.waist) > 0)
        : (Number(d.length) > 0 && Number(d.shoulder) > 0 && Number(d.chest) > 0);

      if (hasDirect) {
        const catKo = cat === "tshirt" ? "티셔츠" : cat === "hoodie" ? "후드·맨투맨" : cat === "outer" ? "아우터" : "팬츠";
        const mainSize = cat === "pants" ? `허리 ${d.waist}` : `어깨 ${d.shoulder}`;
        return `직접 입력 [${catKo}] (${mainSize} / 총장 ${d.length}cm)`;
      }
    }

    return "미등록 (스킵함)";
  };

  // 4차원 기준의류 결합 구조로 회원 가입 DB를 업사이드 적재하는 어드밴스드 알고리즘 완공!
  const saveUserToVirtualDB = async () => {
    const { basicInfo, detailedFit } = profile;
    if (!basicInfo.nickname) return;

    // 4개 범주 각각의 데이터 동적 일괄 정밀 추출
    const baseClothesList = {
      tshirt: getCategoryClothesSummary("tshirt"),
      hoodie: getCategoryClothesSummary("hoodie"),
      outer: getCategoryClothesSummary("outer"),
      pants: getCategoryClothesSummary("pants")
    };

    const newUser = {
      nickname: basicInfo.nickname,
      gender: basicInfo.gender || "남",
      height: Number(basicInfo.height) || 175,
      weight: Number(basicInfo.weight) || 70,
      usualSize: basicInfo.usualSize || "M",
      preferredFit: detailedFit.preferredFit || "regular",
      bodyCharacteristics: detailedFit.bodyCharacteristics && detailedFit.bodyCharacteristics.length > 0
        ? detailedFit.bodyCharacteristics
        : ["특이사항 없음"],
      baseClothesList: baseClothesList
    };

    // ☁️ [클라우드 연동] 실제 Supabase DB에 회원 가입 및 온보딩 실측 요약 정보 전송!
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          nickname: newUser.nickname,
          gender: newUser.gender,
          height: newUser.height,
          weight: newUser.weight,
          usual_size: newUser.usualSize,
          preferred_fit: newUser.preferredFit,
          body_characteristics: newUser.bodyCharacteristics,
          tshirt_summary: baseClothesList.tshirt,
          hoodie_summary: baseClothesList.hoodie,
          outer_summary: baseClothesList.outer,
          pants_summary: baseClothesList.pants
        }, { onConflict: "nickname" });

      if (error) {
        console.error("❌ Supabase 저장 에러 발생:", error.message);
      } else {
        console.log("💚 Supabase에 가입 정보 저장 성공!", data);
      }
    } catch (err) {
      console.error("⚠️ Supabase 통신 에러:", err);
    }

    setProfile(prev => {
      const currentList = prev.usersList && prev.usersList.length > 0 ? prev.usersList : defaultUsersList;
      const filtered = currentList.filter(u => u.nickname.toLowerCase() !== newUser.nickname.toLowerCase());
      const updatedList = [...filtered, newUser];

      return {
        ...prev,
        usersList: updatedList
      };
    });
  };

  // 가상 DB 및 실제 Supabase DB에서 특정 고객 삭제
  const deleteUserFromVirtualDB = async (nickname) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("nickname", nickname);

      if (error) {
        console.error("❌ Supabase에서 회원 삭제 중 오류 발생:", error.message);
      } else {
        console.log(`💚 Supabase에서 '${nickname}' 회원 정보 삭제 완료!`);
      }
    } catch (err) {
      console.error("⚠️ Supabase 삭제 통신 오류:", err);
    }

    setProfile(prev => {
      const currentList = prev.usersList && prev.usersList.length > 0 ? prev.usersList : defaultUsersList;
      const updatedList = currentList.filter(u => u.nickname.toLowerCase() !== nickname.toLowerCase());
      return {
        ...prev,
        usersList: updatedList
      };
    });
  };

  // ⭐ 핵심 개편: 기존 가입 회원 데이터베이스(usersList)를 100% 보존 유지하면서 스텝만 0단계로 빠져나오는 영속성 로그아웃 개발!
  const logout = () => {
    setProfile(prev => ({
      ...initialProfileState,
      usersList: prev.usersList && prev.usersList.length > 0 ? prev.usersList : defaultUsersList,
      step: 0 // 첫 화면으로 안전 이동!
    }));
  };

  const resetProfile = () => {
    localStorage.removeItem("gubi_fit_profile");
    setProfile(initialProfileState);
  };

  const getFitAccuracy = () => {
    const { step, directMeasures, dbMeasures, detailedFit } = profile;

    if (step === 0) return 0;

    let score = 25;

    const t = directMeasures.tshirt;
    const tDirectFilled = t.length > 0 && t.shoulder > 0 && t.chest > 0 && t.sleeve > 0;
    const tDbFilled = dbMeasures && dbMeasures.tshirt !== null && !dbMeasures.tshirt.isSkipped && dbMeasures.tshirt.size !== "없음" && dbMeasures.tshirt.size !== "";
    const tCompleted = tDirectFilled || tDbFilled;
    if (tCompleted) score += 15;

    const h = directMeasures.hoodie;
    const hDirectFilled = h.length > 0 && h.shoulder > 0 && h.chest > 0 && h.sleeve > 0;
    const hDbFilled = dbMeasures && dbMeasures.hoodie !== null && !dbMeasures.hoodie.isSkipped && dbMeasures.hoodie.size !== "없음" && dbMeasures.hoodie.size !== "";
    const hCompleted = hDirectFilled || hDbFilled;
    if (hCompleted) score += 15;

    const o = directMeasures.outer;
    const oDirectFilled = o.length > 0 && o.shoulder > 0 && o.chest > 0 && o.sleeve > 0;
    const oDbFilled = dbMeasures && dbMeasures.outer !== null && !dbMeasures.outer.isSkipped && dbMeasures.outer.size !== "없음" && dbMeasures.outer.size !== "";
    const oCompleted = oDirectFilled || oDbFilled;
    if (oCompleted) score += 15;

    const p = directMeasures.pants;
    const pDirectFilled = p.length > 0 && p.waist > 0 && p.hip > 0 && p.thigh > 0 && p.rise > 0 && p.hem > 0;
    const pDbFilled = dbMeasures && dbMeasures.pants !== null && !dbMeasures.pants.isSkipped && dbMeasures.pants.size !== "없음" && dbMeasures.pants.size !== "";
    const pCompleted = pDirectFilled || pDbFilled;
    if (pCompleted) score += 15;

    const hasBodyChar = detailedFit && detailedFit.bodyCharacteristics && detailedFit.bodyCharacteristics.length > 0;
    if (hasBodyChar) score += 10;

    const hasPrefFit = detailedFit && detailedFit.preferredFit && detailedFit.preferredFit !== "";
    if (hasPrefFit) score += 5;

    if (step === 1) {
      const { gender, height, weight, usualSize } = profile.basicInfo;
      const progressCount = [gender, height, weight, usualSize].filter(Boolean).length;
      return 15 + Math.round((progressCount / 4) * 10);
    }

    return Math.min(100, score);
  };

  return (
    <FitProfileContext.Provider
      value={{
        profile,
        setStep,
        setUser,
        updateBasicInfo,
        setMeasureMethod,
        updateDirectMeasure,
        updateDirectMeasures,
        updateDbMeasure,
        updateDbMeasures,
        resetMeasures,
        updateDetailedFit,
        resetProfile,
        getFitAccuracy,
        saveUserToVirtualDB,
        deleteUserFromVirtualDB,
        fetchUsersFromSupabase, // 수동 동기화 함수 노출
        logout // 영속 로그아웃 함수 바인딩 노출!
      }}
    >
      {children}
    </FitProfileContext.Provider>
  );
};

export const useFitProfile = () => {
  const context = useContext(FitProfileContext);
  if (!context) {
    throw new Error("useFitProfile must be used within a FitProfileProvider");
  }
  return context;
};
