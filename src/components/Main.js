import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/template.css";
import "./css/Main.css";

const Main = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 스크롤 트리거 임계값 (0.5는 화면 중앙 지점에서)
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active"); // 화면을 벗어날 때 클래스 제거
        }
      });
    }, options);

    elements.forEach((element) => {
      observer.observe(element);
    });

    // 배경색 변경
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 스크롤 위치에 따라 배경색을 변경합니다.
      const ratio = scrollY / (documentHeight - windowHeight);
      const yellow = [255, 248, 210]; // #FFF8D2의 RGB 색상
      const blendedColor = yellow.map((c) =>
        Math.round(c * (1 - ratio))
      );
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="main_color">
      <img src="JOY3.svg" id="logo" alt="Logo" />
      {/* 이하 요소들은 CSS 클래스를 추가하여 애니메이션 적용 */}
      <div className="fade-in">
        <p id="main_p">
          1인 과외 관리를
          <br />
          편리하고 즐겁게,<span id="joy"> JOY.</span>
        </p><br /><br /><br />
        <img src="arrow.svg" id="arrow" alt="arrow" onClick={() => scrollToElement("focus")}/>
      </div><br /><br /><br /><br /><br /><br /><br />
      <div id="focus"></div>
      
      <br /><br /><br /><br />


      <div className="fade-in" id="main_div" >
      <img src="p2.svg" id="people2" alt="p1" />
      <p id="main_p2">
      매달 <span id="main_sp">월간 과외 일정</span>을 카톡, 문자로
      전달하는 것이 귀찮아요
        </p>
      </div>
      
      <div className="fade-in" id="main_div">
      <img src="p1.svg" id="people" alt="p1" />
      <p id="main_p2">
      학부모님이 매번 <span id="main_sp">현재 진도 상황과
      숙제 수행도</span>를 궁금해 하셔요
        </p>
      </div>
      
      <div className="fade-in" id="main_div">
      <img src="p3.svg" id="people" alt="p1" />
      <p id="main_p2">
      선생님이 직접 문자로 <span id="main_sp">과외비 입금
      요청</span>의 번거로움이 발생해요
      </p>
      </div>

      <div className="fade-in" id="main_div">
      <img src="p4.svg" id="people" alt="p1" />
      <p id="main_p2">
      과외를 하면서 제 <span id="main_sp">모의고사 성적</span>이
      얼마나 올랐는지 궁금해요
      </p>
      </div>
      <br /><br /><br /><br /><br /><br />

      <p className="fade-in"  id="main_p3">
      이런 불편한 점들을 해소시킬<br/>
      과외 선생님 맞춤형<br/>
      수업 관리 서비스는 없을까?</p>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br />

      <div className="fade-in" >
        <div id="main_div2">
      <p id="main_p4">
      <p id="main_sp2">STEP 1</p>
      여러 학생을 색깔별로<br />
      하나의 캘린더에서 관리하세요
        </p>
        <img src="step1.jpg" id="step1" alt="p1" />
        </div>

        <div id="main_div2">
      <p id="main_p4">
      <p id="main_sp2">STEP 2</p>
      매 수업 일지를 기록하고<br />
      진도율과 피드백을 확인하세요
        </p>
        <img src="step2.svg" id="step2" alt="p2" />
        <img src="step22.jpg" id="step22" alt="p22" />
      </div>
      </div>

      <div className="fade-in" >
        <div id="main_div2">
      <p id="main_p4">
      <p id="main_sp2">STEP 3</p>
      과외를 하며 상승한<br />
      모의고사 성적을 확인하세요
        </p>
        <img src="step3.jpg" id="step3" alt="p3" />
        </div>

        <div id="main_div2">
      <p id="main_p4">
      <p id="main_sp2">STEP 4</p>
      번거로운 연락 대신<br />
      푸시 알림으로 전송하세요
        </p>
        <img src="step4.jpg" id="step4" alt="p4" />
      </div>
      </div>


      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="fade-in">
      <img src="JOY3.svg" id="logo" alt="Logo" />
        <p id="main_p">
          1인 과외 관리를
          <br />
          편리하고 즐겁게,<span id="joy">JOY.</span>
        </p>
        <Link to="/login">
          <button id="main_btn">&JOY 하러 가기</button>
        </Link>
      </div>
      <br /><br /><br /><br /><br /><br />
      {/* 이하 요소들도 동일한 방법으로 처리 */}
    </div>
  );
};

export default Main;