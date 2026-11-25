// app.js : 11주차 영화 카드 생성, 검색, 정렬 처리 / 강동현(2651001)

// posterUrl : 포스터 경로(문자열 또는 null), 이미지 크기(문자열) ⇒ TMDB 이미지 주소 문자열
function posterUrl(path, size) {
  if (!path) {
    return "";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// search : 영화 배열, 검색어(문자열) ⇒ 제목에 검색어가 포함된 새 배열
function search(list, keyword) {
  const term = keyword.trim().toLowerCase();
  return list.filter((m) => m.title.toLowerCase().includes(term));
}

// sortBy : 영화 배열, 정렬 키(문자열), 내림차순 여부(불리언) ⇒ 정렬된 새 배열(원본 불변)
function sortBy(list, key, desc) {
  const sign = desc ? -1 : 1;
  return [...list].sort((a, b) => {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]) * sign;
    }
    return (a[key] - b[key]) * sign;
  });
}

// getView : 없음 ⇒ 검색어를 거른 뒤 정렬 기준을 적용한 새 배열
function getView() {
  const keyword = document.getElementById("q").value;
  const key = document.getElementById("sort").value;
  const filtered = search(movies, keyword);
  return sortBy(filtered, key, key !== "title");
}

// renderCards : 영화 배열 ⇒ 화면에 카드 목록을 렌더링하고 개수·빈 상태 갱신
function renderCards(list) {
  const board = document.getElementById("board");
  const countEl = document.getElementById("count");

  board.innerHTML = "";

  for (const m of list) {
    const card = document.createElement("article");
    card.className = "card";

    const hotClass = m.rating >= 8 ? "badge hot" : "badge";
    const posterMarkup = m.poster
      ? `<img src="${posterUrl(m.poster, "w342")}" alt="${m.title}">`
      : `<div class="poster-fallback">${m.title[0]}</div>`;

    if (!m.poster) {
      card.classList.add("no-poster");
    }

    card.innerHTML = `
      <span class="${hotClass}">${m.rating}</span>
      ${posterMarkup}
      <p class="title">${m.title}</p>
      <p class="year">${m.year}</p>
    `;

    board.appendChild(card);
  }

  countEl.textContent = `${list.length}편`;

  if (list.length === 0) {
    board.classList.add("is-empty");
  } else {
    board.classList.remove("is-empty");
  }
}

// 초기 화면 그리기
renderCards(getView());

// 검색창 입력 및 정렬 변경 이벤트
document.getElementById("q").addEventListener("input", () => {
  renderCards(getView());
});

document.getElementById("sort").addEventListener("change", () => {
  renderCards(getView());
});
