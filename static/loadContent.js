document.addEventListener("DOMContentLoaded", function () {
  const headerDiv = document.getElementById("header");
  const mainDiv = document.getElementById("main");
  const footerDiv = document.getElementById("footer");

  // Header와 Footer는 모든 페이지에서 공통으로 사용
  fetch("includes/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerDiv.innerHTML = data;
    });

  fetch("includes/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footerDiv.innerHTML = data;
    });

  // URL의 쿼리 문자열에 따라 Main 콘텐츠 변경
  const queryParams = new URLSearchParams(window.location.search);
  const page = queryParams.get("page"); // URL에서 'page' 쿼리 파라미터 가져오기

  // page 값에 따라 다른 HTML 파일을 불러옴
  let contentToLoad = "main.html"; // 기본값 설정
  let scriptToLoad = "static/main.js";
  if (page === "details") {
    contentToLoad = "details.html";
    scriptToLoad = "static/details.js";
  } else if (page === "list") {
    contentToLoad = "list.html";
    scriptToLoad = "static/list.js";
  } else if (!page) {
    // 쿼리 파라미터가 없는 경우, 기본값(메인)으로 리다이렉트
    window.location.search = "?page=main";
    return; // 리다이렉트 후 다음 코드는 실행하지 않음
  }

  fetch(contentToLoad)
    .then((response) => response.text())
    .then((data) => {
      mainDiv.innerHTML = data; // HTML 콘텐츠를 로드

      // main.html을 로드할 때 Bootstrap CSS를 제거
      if (page === "main") {
        const bootstrapStyles = document.querySelectorAll(
          'link[href*="bootstrap.min.css"]'
        );
        bootstrapStyles.forEach((style) => style.remove());
      }

      return loadScript(scriptToLoad); // JavaScript 파일 로드
    })
    .then(() => {
      if (typeof initializeMain === "function") {
        initializeMain(); // 초기화 함수 호출
      }
    })
    .catch((error) => console.error("Error loading content:", error));
});

// 스크립트 동적 로드 함수
function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.async = false; // 스크립트가 순차적으로 실행되도록 합니다.
  document.body.appendChild(script);
}
