let m_boxes = [
  {class: "m_tag_a"},
  {class: "m_tag_b"},
  {class: "m_tag_c"},
  {class: "m_tag_d"},
  {class: "m_tag_e"},
  {class: "m_tag_f"},
  {class: "m_tag_g"},
  {class: "m_tag_h"},
  {class: "m_tag_i"},
];
let s_boxes = [
  {class: "s_tag_a"},
  {class: "s_tag_b"},
  {class: "s_tag_c"},
  {class: "s_tag_d"},
  {class: "s_tag_e"},
  {class: "s_tag_f"},
  {class: "s_tag_g"},
  {class: "s_tag_h"},
  {class: "s_tag_i"},
];
let recommand_card = [
	{id : "myBtn1"},
	{id : "myBtn2"},
	{id : "myBtn3"},
	{id : "myBtn4"},
	{id : "myBtn5"}
]

let count_middle_tag = 0;
let count_small_tag = 0;

$(document).ready(() => {
  $("#count_tag").html(count_small_tag); // 소분류 태그 개수
});
//big Radio Select
$(document).ready(function () {
  $("#box__food").click(function () {
    // 대분류 먹거리 선택
    //console.log("대분류 먹거리");
    $(".middle_box .tag_box_3").css("visibility", "hidden");
    $(".middle_box #m_tag_a").html("한식");
    $(".middle_box #m_tag_b").html("중식");
    $(".middle_box #m_tag_c").html("일식");
    $(".middle_box #m_tag_d").html("양식");
    $(".middle_box #m_tag_e").html("카페");
    $(".middle_box #m_tag_f").html("술집");
    // 먹거리 놀거리 버튼 초기화
    $(".middle_box .tag_checked").removeClass("tag_checked");
    count_middle_tag = 0;
    $("#small_select").attr("class", "tag_not_select");
    $("#middle_select").click();
    //소분류 전체 초기화
    $(".small_box .tag_checked").removeClass("tag_checked");
    count_small_tag = 0;
    $("#count_tag").html(count_small_tag);
    // 선택 checked 추가
    $(this).addClass("tag_checked");
    $("#box__play").removeClass("tag_checked");
  });
  $("#box__play").click(function () {
    // 대분류 놀거리 선택
    //console.log("대분류 놀거리");
    $(".middle_box .tag_box_3").css("visibility", "visible");
    $(".middle_box #m_tag_a").html("노래방");
    $(".middle_box #m_tag_b").html("영화관");
    $(".middle_box #m_tag_c").html("카페/놀거리");
    $(".middle_box #m_tag_d").html("당구장");
    $(".middle_box #m_tag_e").html("PC방");
    $(".middle_box #m_tag_f").html("스포츠/오락");
    $(".middle_box #m_tag_g").html("오락실");
    $(".middle_box #m_tag_h").html("찜질방");
    $(".middle_box #m_tag_i").html("놀이공원");
    // 먹거리 놀거리 버튼 초기화
    $(".middle_box .tag_checked").removeClass("tag_checked");
    count_middle_tag = 0;
    $("#small_select").attr("class", "tag_not_select");
    $("#middle_select").click();
    //소분류 전체 초기화
    $(".small_box .tag_checked").removeClass("tag_checked");
    count_small_tag = 0;
    $("#count_tag").html(count_small_tag);
    // 선택 checked 추가
    $(this).addClass("tag_checked");
    $("#box__food").removeClass("tag_checked");
  });
});
// m_s Select
$(document).ready(function () {
  $("#middle_select").click(function () {
    // 중분류 선택
    //console.log("중분류 선택중");
    $(this).addClass("tag_checked");
    $("#small_select").removeClass("tag_checked");
    $(".middle_box").css("display", "block");
    $(".small_box").css("display", "none");
  });
  $("#small_select").click(function () {
    //소분류 선택
    //console.log("소분류 선택중");
    if (count_middle_tag == 0) {
      alert("👻 중분류를 한개 선택하셔야 합니다.");
      return;
    } else {
      // middle 태그가 한개 선택되었을떼
      $(this).addClass("tag_checked");
      $("#middle_select").removeClass("tag_checked");
      $(".small_box").css("display", "block");
      $(".middle_box").css("display", "none");
    }
  });
});

// midlle_tag_click
$(document).ready(function () {
  $(".middle_box .tag_content").click(function () {
    if (count_middle_tag == 0 && $(this).hasClass("tag_checked") == false) {
      count_middle_tag += 1;
      $("#small_select").attr("class", "tag_select");
      $(this).addClass("tag_checked");
      let tag_val = $(this).text();

      switch (tag_val) {
        //Food
        case "한식":
          //console.log("중분류 :한식");
          $(".small_box #s_tag_a").html("국밥");
          $(".small_box #s_tag_b").html("죽");
          $(".small_box #s_tag_c").css("visibility", "visible").html("해물,생선요리");
          $(".small_box #s_tag_d").css("visibility", "visible").html("찌개,전골");
          $(".small_box #s_tag_e").css("visibility", "visible").html("면요리");
          $(".small_box #s_tag_f").css("visibility", "visible").html("닭요리");
          $(".small_box #s_tag_g").css("visibility", "visible").html("육류,고기요리");
          $(".small_box #s_tag_h").css("visibility", "visible").html("백반,가정식");
          $(".small_box #s_tag_i").css("visibility", "visible").html("기타");
          break;
        case "중식":
          //console.log("중분류 :중식");
          $(".small_box #s_tag_a").html("중식당");
          $(".small_box #s_tag_b").html("꼬치류");
          $(".small_box #s_tag_c").css("visibility", "visible").html("만두");
          $(".small_box #s_tag_d").css("visibility", "visible").html("튀김류");
          $(".small_box #s_tag_e").css("visibility", "visible").html("사천 요리");
          $(".small_box #s_tag_f").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "일식":
          //console.log("중분류 :일식"); //5
          $(".small_box #s_tag_a").html("일식당");
          $(".small_box #s_tag_b").html("구이,튀김");
          $(".small_box #s_tag_c").css("visibility", "visible").html("쌀요리");
          $(".small_box #s_tag_d").css("visibility", "visible").html("술집");
          $(".small_box #s_tag_e").css("visibility", "visible").html("면요리");
          $(".small_box #s_tag_f").css("visibility", "visible").html("생선요리");
          $(".small_box #s_tag_g").css("visibility", "visible").html("전골");
          $(".small_box #s_tag_h").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "양식":
          //console.log("중분류 :양식");
          $(".small_box #s_tag_a").html("브런치");
          $(".small_box #s_tag_b").html("이탈리아 음식");
          $(".small_box #s_tag_c").css("visibility", "visible").html("멕시코,남미음식");
          $(".small_box #s_tag_d").css("visibility", "visible").html("서양 음식");
          $(".small_box #s_tag_e").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "카페":
          //console.log("중분류 :카페");
          $(".small_box #s_tag_a").html("브런치");
          $(".small_box #s_tag_b").html("디저트 카페");
          $(".small_box #s_tag_c").css("visibility", "visible").html("베이커리 카페");
          $(".small_box #s_tag_d").css("visibility", "visible").html("스터디 카페");
          $(".small_box #s_tag_e").css("visibility", "visible").html("이색 카페");
          $(".small_box #s_tag_f").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "술집":
          //console.log("중분류 :술집 ");
          $(".small_box #s_tag_a").html("맥주 , 호프");
          $(".small_box #s_tag_b").html("전통 , 민속주점");
          $(".small_box #s_tag_c").css("visibility", "visible").html("포장마차");
          $(".small_box #s_tag_d").css("visibility", "visible").html("이자카야");
          $(".small_box #s_tag_e").css("visibility", "visible").html("바(BAR)");
          $(".small_box #s_tag_f").css("visibility", "visible").html("유흥 주점");
          $(".small_box #s_tag_g").css("visibility", "visible").html("요리 주점");
          $(".small_box #s_tag_h").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        //Play
        case "노래방":
          //console.log("중분류 :노래방 5");
          $(".small_box #s_tag_a").html("노래방"); // 스포츠,오락
          $(".small_box #s_tag_b").html("오락시설");
          $(".small_box #s_tag_c").css("visibility", "visible").html("영상,음향가전");
          $(".small_box #s_tag_d").css("visibility", "visible").html("단란주점");
          $(".small_box #s_tag_e").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "영화관":
          //console.log("중분류 :영화관");
          $(".small_box #s_tag_a").html("문화,예술");
          $(".small_box #s_tag_b").html("DVD방");
          $(".small_box #s_tag_c").css("visibility", "visible").html("장소대여");
          $(".small_box #s_tag_d").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "당구장":
          console.log("중분류 :당구장 ");
          $(".small_box #s_tag_a").html("당구장"); // 스포츠 오락
          $(".small_box #s_tag_b").html("당구용품");
          $(".small_box #s_tag_c").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "PC방":
          //console.log("중분류 :pc방 ");
          $(".small_box #s_tag_a").html("PC방"); // 스포츠오락
          $(".small_box #s_tag_b").html("장소대여");
          $(".small_box #s_tag_c").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "오락실":
          //console.log("중분류 :오락실");
          $(".small_box #s_tag_a").html("오락실"); // 스포츠오락
          $(".small_box #s_tag_b").html("노래방");
          $(".small_box #s_tag_c").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "놀이공원":
          //console.log("중분류 :놀이공원");
          $(".small_box #s_tag_a").html("테마파크");
          $(".small_box #s_tag_b").html("레저,테마");
          $(".small_box #s_tag_c").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "찜질방":
          //console.log("중분류 :찜질방");
          $(".small_box #s_tag_a").html("목욕탕,사우나");
          $(".small_box #s_tag_b").html("레저,테마");
          $(".small_box #s_tag_c").css("visibility", "visible").html("기타");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "카페/놀거리":
          //console.log("중분류 :카페");
          $(".small_box #s_tag_a").html("보드카페");
          $(".small_box #s_tag_b").html("방탈출");
          $(".small_box #s_tag_c").css("visibility", "visible").html("만화카페");
          $(".small_box #s_tag_d").css("visibility", "visible").html("애견카페");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
        case "스포츠/오락":
          //console.log("중분류 :스포츠, 오락");
          $(".small_box #s_tag_a").html("볼링");
          $(".small_box #s_tag_b").html("스크린야구");
          $(".small_box #s_tag_c").css("visibility", "hidden");
          $(".small_box #s_tag_d").css("visibility", "hidden");
          $(".small_box #s_tag_e").css("visibility", "hidden");
          $(".small_box #s_tag_f").css("visibility", "hidden");
          $(".small_box #s_tag_g").css("visibility", "hidden");
          $(".small_box #s_tag_h").css("visibility", "hidden");
          $(".small_box #s_tag_i").css("visibility", "hidden");
          break;
      }
    } else if (
      count_middle_tag == 1 &&
      $(this).hasClass("tag_checked") == true
    ) {
      count_middle_tag -= 1;
      $("#small_select").attr("class", "tag_not_select");
      $(this).removeClass("tag_checked");
      //소분류 전체 초기화
      $(".small_box .tag_checked").removeClass("tag_checked");
      count_small_tag = 0;
      $("#count_tag").html(count_small_tag);
    } else {
      //console.log("don't click ");
      return;
    }
  });
});
// small_tag_click
$(document).ready(function () {
  $(".small_box .tag_content").click(function () {
    if (count_small_tag < 3) {
      if ($(this).hasClass("tag_checked") === false) {
        // tag_checked 가 안들어가 있으면
        $(this).addClass("tag_checked");
        //추가
        count_small_tag += 1;
        //console.log("소분류 :", $(this).text(), count_small_tag);
      } else {
        count_small_tag -= 1;
        $(this).removeClass("tag_checked");
        //console.log("소분류 해제:", $(this).text(), count_small_tag);
      }
    } else {
      if ($(this).hasClass("tag_checked") === false) {
        alert("👻 3개 이상 입력하실 수 없습니다.");
      } else {
        count_small_tag -= 1;
        //console.log("소분류 해제:", $(this).text(), count_small_tag);
        $(this).removeClass("tag_checked");
      }
    }
    $("#count_tag").html(count_small_tag);
    if (count_middle_tag == 1 && count_small_tag > 0) {
      $(".form__confirm").addClass("confirm_okay");
    } else {
      $(".form__confirm").removeClass("confirm_okay");
    }
  });
});

//confirm
$(document).ready(() => {
  $(".form__confirm").click(() => {
    if (count_small_tag == 0) {
      alert("👻 소분류 태그를 1개이상 선택하셔야 합니다.");
    } else {
      if (confirm("👻 입력하신 정보로 추천을 불러오겠습니까?") == true) {
		// 랭킹 데이터 가져오기 전에 텍스트 클리어 함수
		clearBeforData();
		
		// 랭킹 데이터 가져오는 함수
        getRankingData();
        
        // wordcloud 함수
        //makeFoodCloud(); 
        //makePlayCloud();
        
        // pieChart 함수
        makePieChart("food");
        makePieChart("play");        
        /*console.log(
          "중분류:",
          $(".middle_box .tag_content.tag_checked").text()
        );
        console.log(
          "소분류: ",
          $(".small_box .tag_content.tag_checked").text()
        );*/
        $("#recommand_second").css("display", "block");
        $("#recommand_third").css("display", "block");
        $("#recommand_fourth").css("display", "block");
        $("html, body").animate(
          {
            scrollTop: 1000,
          },
          1000
        );
      } else {
        return;
      }
    }
  });
});
//clear
$(document).ready(function () {
  $(".form__clear").click(() => {
    if (confirm("👻 정보를 재입력 하시겠어요 ?") == true) {
      location.replace("/");
      // 세션 초기화 후 전화면으로 이동시킴
    } else {
      return;
    }
  });
});
$(function () {
  const swiper = new Swiper(".swiper-container", {
    slidesPerView: 3, // 동시에 보여줄 슬라이드 갯수
    spaceBetween: 15, // 슬라이드간 간격
    slidesPerGroup: 3, // 그룹으로 묶을 수, slidesPerView 와 같은 값을 지정하는게 좋음

    // 그룹수가 맞지 않을 경우 빈칸으로 메우기
    // 3개가 나와야 되는데 1개만 있다면 2개는 빈칸으로 채워서 3개를 만듬
    loopFillGroupWithBlank: true,

    loop: false, // 무한 반복

    pagination: {
      // 페이징
      el: ".swiper-pagination",
      clickable: true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
    },
    navigation: {
      // 네비게이션
      nextEl: ".swiper-button-next", // 다음 버튼 클래스명
      prevEl: ".swiper-button-prev", // 이번 버튼 클래스명
    },
    breakpoints: {
      1919: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1280: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      720: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  });
});
$(document).ready(function () {
  $(".food_button").click(function () {
    if (
      confirm(
        "👻" +
          $(".midPoint_value").text() +
          "의 먹거리로 재추천을 진행하겠습니까?"
      ) === true
    ) {
      //console.log("food로 재추천 진행");
      $(".form__confirm").removeClass("confirm_okay");
      $("#recommand_second").css("display", "none");
      $("#recommand_third").css("display", "none");
      $("#recommand_fourth").css("display", "none");
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        500
      );
      $("#box__food").click();
    } else {
      return;
    }
  });
  $(".play_button").click(function () {
    if (
      confirm(
        "👻" +
          $(".midPoint_value").text() +
          "의 놀거리로 재추천을 진행하겠습니까?"
      ) === true
    ) {
      //console.log("play로 재추천 진행");
      $(".form__confirm").removeClass("confirm_okay");
      $("#recommand_second").css("display", "none");
      $("#recommand_third").css("display", "none");
      $("#recommand_fourth").css("display", "none");
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        500
      );
      $("#box__play").click();
    } else {
      return;
    }
  });
});

// Scroll To Top
$(document).ready(function () {
  $(".scroll_top").click(() => {
    $("html,body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });
});
/*//word_cloud
//food
anychart.onDocumentReady(function () {
  var data = [
    { x: "food", value: 1111 },
    { x: "JAVA", value: 52 },
    { x: "C++", value: 45 },
    { x: "HTML", value: 61 },
    { x: "1", value: 14 },
    { x: "Python", value: 23 },
    { x: "소프트웨어", value: 54 },
    { x: "JAVA", value: 52 },
    { x: "C++", value: 45 },
    { x: "HTML", value: 61 },
  ];
  var chart = anychart.tagCloud(data);

  chart.selected().fill("#ff865d"); //클릭했을 때 글씨 색 지정
  chart.textSpacing(15); //글자간격
  //  chart.colorRange().enabled(true); //범위
  chart.angles([90, 0]); //각도
  chart.container("food_container");
  chart.draw();
});

//play
anychart.onDocumentReady(function () {
  var data = [
    { x: "play", value: 1111 },
    { x: "1", value: 14 },
    { x: "Python", value: 23 },
    { x: "소프트웨어", value: 54 },
    { x: "JAVA", value: 52 },
    { x: "C++", value: 45 },
    { x: "HTML", value: 61 },
    { x: "1", value: 14 },
    { x: "Python", value: 23 },
    { x: "소프트웨어", value: 54 },
    { x: "JAVA", value: 52 },
    { x: "C++", value: 45 },
    { x: "HTML", value: 61 },
    { x: "1", value: 14 },
    { x: "Python", value: 23 },
    { x: "소프트웨어", value: 54 },
    { x: "JAVA", value: 52 },
    { x: "C++", value: 45 },
    { x: "HTML", value: 61 },
  ];
  var chart = anychart.tagCloud(data);

  chart.selected().fill("#ff865d"); //클릭했을 때 글씨 색 지정
  chart.textSpacing(15); //글자간격
  //  chart.colorRange().enabled(true); //범위
  chart.angles([90, 0]); //각도
  chart.container("play_container");
  chart.draw();
});*/

// wordcloud food 부분 함수
function makeFoodCloud() {
	
	let station = $(".midPoint_value").text();
	let section = 1;	//	section 1는 food

	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = this.responseText;

			data = JSON.parse(data);

			var TestData = [];

			data.forEach(function(element) {
				TestData.push({ "x": element.category2, "value": element.score });
			});

			anychart.onDocumentReady(function() {

				$('#food_container').html("");

				var chart = anychart.tagCloud(TestData);
				chart.selected().fill("#ff865d"); //클릭했을 때 글씨 색 지정 
				chart.textSpacing(15); //글자간격
				//  chart.colorRange().enabled(true); //범위
				chart.angles([90, 0]); //각도
				chart.container("food_container"); // wordcloud 생성할 컨테이너        
				chart.draw();	// wordcloud 생성 명령어
			});
		}
	}
	xhttp.open("GET", "get-clouddata?station=" + station + "&section=" + section, true);
	xhttp.send();
}

// wordcloud play 부분 함수
function makePlayCloud() {
	
	let station = $(".midPoint_value").text();
	let section = 2;	//	section 2는 play

	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = this.responseText;

			data = JSON.parse(data);

			var TestData = [];

			data.forEach(function(element) {
				TestData.push({ "x": element.category2, "value": element.score });
			});

			anychart.onDocumentReady(function() {

				$('#play_container').html("");

				var chart = anychart.tagCloud(TestData);
				chart.selected().fill("#ff865d"); //클릭했을 때 글씨 색 지정 
				chart.textSpacing(15); //글자간격
				//  chart.colorRange().enabled(true); //범위
				chart.angles([90, 0]); //각도
				chart.container("play_container"); // wordcloud 생성할 컨테이너        
				chart.draw();	// wordcloud 생성 명령어
			});
		}
	}
	xhttp.open("GET", "get-clouddata?station=" + station + "&section=" + section, true);
	xhttp.send();
}

// 비동기 데이터 관련 함수
function getRankingData(){
	let chkMitemArr = [];
	let chkSitemArr = [];
	let station = $(".midPoint_value").text();
	
	for(let i = 0; i < m_boxes.length; i++){
		$(document).ready(function(){
			if($(`#${m_boxes[i]['class']}.tag_content.tag_checked`).text() != ""){
				chkMitemArr.push($(`#${m_boxes[i]['class']}.tag_content.tag_checked`).text());
			}	
		});
	}
		for(let i = 0; i < s_boxes.length; i++){
		$(document).ready(function(){
			if($(`#${s_boxes[i]['class']}.tag_content.tag_checked`).text() != ""){
				chkSitemArr.push($(`#${s_boxes[i]['class']}.tag_content.tag_checked`).text());
			}	
		});
	}
	
	//console.log(station);
	//console.log(chkMitemArr);
	//console.log(chkSitemArr.toString());
	let strSitem = "";
	
	for(let i = 0; i < chkSitemArr.length; i++) {
		if(i == (chkSitemArr.length - 1)){ strSitem += chkSitemArr[i]; }
		else { strSitem += chkSitemArr[i] + "|" }
	}
	//console.log(strSitem);
	
	$(document).ready(function(){
		const xhttp = new XMLHttpRequest(); 
		xhttp.onload = function() {
			let data = this.responseText;
			
			data = JSON.parse(data);
			//console.log(data);

			if(data.length != 0){	
				// 상위 랭킹 5위까지 가게 데이터 입력 함수
				setInformationTop5(data);
				// 나머지 가게 데이터 입력 함수
				setInformationSlider(data);
				// 구글 정적 지도 마커 표시 함수
				setStaticMap(data);
				
				return true;
			}
			else {				
				return false;
			}

		}
		xhttp.open("GET", "get-rankingdata?station="+station+"&middleLV="+chkMitemArr[0]+"&minorLV="+encodeURI(strSitem), true); 
		xhttp.send();
	})

}

function setInformationTop5(shopData) {
	let addHtml = "";
	let count = shopData.length;
	
	// 검색된 가게 숫자가 5개 미만일 경우
	if(count < 5){
		for(let i = 0; i < count; i++){	
		addHtml += "<img src='"+ shopData[i].thumbnail +"' class='card__thumnail' onerror='this.src=`./img/Top5Alt.png`'>";
		addHtml += "<div class='card__info'>";
		addHtml += 	    "<span id='info_title'>"+ shopData[i].name +"</span>";
		if(shopData[i].bizHour != null) { addHtml += "<span id='info_bizhour'>"+ shopData[i].bizHour +"</span>"; }
		else { addHtml += "<span id='info_bizhour'></span>"; }
		addHtml += 	        "<span id='info_category'>"+ shopData[i].category2 +"</span>";
		addHtml += 	    "<span id='info_address'>"+ shopData[i].address +"</span>";
		addHtml += 		"<input type='hidden' name='shopId' value='" + shopData[i].infoId +"'>"
		addHtml += 	"</div>";
		$(`#${recommand_card[i]['id']}`).html(addHtml);
		addHtml = "";
		}
	} else {	//	검색된 가게가 5개 이상일 경우
		for(let i = 0; i < 5; i++){	
		addHtml += "<img src='"+ shopData[i].thumbnail +"' class='card__thumnail' onerror='this.src=`./img/Top5Alt.png`'>";
		addHtml += "<div class='card__info'>";
		addHtml += 	    "<span id='info_title'>"+ shopData[i].name +"</span>";
		if(shopData[i].bizHour != null) { addHtml += "<span id='info_bizhour'>"+ shopData[i].bizHour +"</span>"; }
		else { addHtml += "<span id='info_bizhour'></span>"; }
		addHtml += 	        "<span id='info_category'>"+ shopData[i].category2 +"</span>";
		addHtml += 	    "<span id='info_address'>"+ shopData[i].address +"</span>";
		addHtml += 		"<input type='hidden' name='shopId' value='" + shopData[i].infoId +"'>"
		addHtml += 	"</div>";
		$(`#${recommand_card[i]['id']}`).html(addHtml);
		addHtml = "";
		}
	}
	
}

function setInformationSlider(shopData) {
	
	let dataLength = shopData.length;
	let addHtml = "";
	
	// 반올림 꼭 해야됨
	let count = Math.ceil((dataLength - 5) / 2);
	//console.log(count);
	for(let i = 0; i < count; i++) {
		btnCount1 = 2*i+6;
		btnCount2 = 2*i+7;
		arrCount1 = btnCount1 - 1;
		arrCount2 = btnCount2 - 1;
		if(btnCount1 <= dataLength){
			addHtml += '<div class="swiper-slide">';
			addHtml +=	'<div class="remain_group_'+ i +'">';
		    addHtml +=	'<div class="remainder_card" id="myBtn'+ btnCount1 +'" onclick="Action_Slide('+btnCount1+')">';
		    addHtml +=  	  '<img class= "remainder_thumnail"src="'+ shopData[arrCount1].thumbnail +'" onerror="this.src=`./img/OtherAlt.png`">';
		    addHtml +=   	  '<div class="remainder_info">';
		    addHtml +=       	 '<div class="remain_info_title">'+shopData[arrCount1].name+'</div>';
		    if(shopData[arrCount1].bizHour != null) { addHtml += '<div class="remain_info_bizhour">'+ shopData[arrCount1].bizHour +'</div>'; }
		    else { addHtml += '<div class="remain_info_bizhour"></div>'; }
		    addHtml +=        	 '<div class="remain_info_category">'+ shopData[arrCount1].category2 +'</div>';
		    if(shopData[arrCount1].menu != null) { addHtml += '<div class="remain_info_address">'+ shopData[arrCount1].menu +'</div>'; }
		    else { addHtml += '<div class="remain_info_address"></div>'; }
		    addHtml +=			 '<input type="hidden" name="shopId" value="' + shopData[arrCount1].infoId +'">'
		    addHtml +=   	  '</div>';
		    addHtml +=	'</div>';
		    if(btnCount2 <= dataLength){
				addHtml +=	'<div class="remainder_card" id="myBtn'+ btnCount2 +'" onclick="Action_Slide('+btnCount2+')">';
			    addHtml +=    	'<img class= "remainder_thumnail"src="'+ shopData[arrCount2].thumbnail +'" onerror="this.src=`./img/OtherAlt.png`">';
			    addHtml +=    	'<div class="remainder_info">';
			    addHtml +=      	 '<div class="remain_info_title">'+ shopData[arrCount2].name +'</div>';
			    if(shopData[arrCount2].bizHour != null) { addHtml += '<div class="remain_info_bizhour">'+ shopData[arrCount2].bizHour +'</div>'; }
		   		else { addHtml += '<div class="remain_info_bizhour"></div>'; }
			    addHtml +=       	 '<div class="remain_info_category">'+ shopData[arrCount2].category2 +'</div>';
			    if(shopData[arrCount2].menu != null) { addHtml += '<div class="remain_info_address">'+ shopData[arrCount2].menu +'</div>'; }
		   		else { addHtml += '<div class="remain_info_address"></div>'; }
			    addHtml +=			 '<input type="hidden" name="shopId" value="' + shopData[arrCount2].infoId +'">'
			    addHtml +=   	'</div>';
			    addHtml +=	'</div>';
				addHtml +=	'</div>';
			}
			else{
				// 빈값 넣기
			}
			addHtml += '</div>';
		}
	} 
	$('.swiper-wrapper').html(addHtml);
}

function setStaticMap(shopData) {
	
	let count = shopData.length;
	let centerLat = parseFloat(stationLat);
	let centerLng = parseFloat(stationLng);
	
	var map = new google.maps.Map(
		document.getElementById('staticMap'), {
		zoom: 15, center: { lat: centerLat, lng: centerLng } //<- 지하철 위치 들어가야하는 곳!
	})
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    // pin 마커 이미지 및 색상 추가
    var pinColor = "ff865d";
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
	new google.maps.Size(50, 50),
	new google.maps.Point(0, 0),
	new google.maps.Point(0, 0));
	
    for (i = 0; i < count; i++) {
        var myLatLng = new google.maps.LatLng(shopData[i].lat, shopData[i].lng);
        count = 5;
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
			icon: pinImage,
        });
        // 클릭했을 시 정보나타내는 기능
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(shopData[i].name);
                infowindow.open(map, marker);
            }
        })(marker, i));
        // 확대 시키는 기능
        if (marker) {
            marker.addListener('click', function() {
                map.setZoom(15);
                map.setCenter(this.getPosition());
            });
        }
    }
}

// 데이터 불러오기 전 잔류 데이터 소거 함수
function clearBeforData() {
	for(let i = 0; i < recommand_card.length; i++) {
		$(`#${recommand_card[i]['id']}`).html("");
	}
	$('.swiper-wrapper').html("");
}

function makePlayPieChart(categoryData) {
	//play pie chart
	var xValues_play = [];
	var yValues_play = [];
	

	for(let i = 0; i < categoryData.length; i++) {
		xValues_play.push(categoryData[i].category);
	}
	for(let i = 0; i < categoryData.length; i++) {
		yValues_play.push(categoryData[i].categoryCount);
	}
	//console.log(categoryData);
	//console.log(xValues_play);
	//console.log(yValues_play);
/*    var xValues_play = ["노래방", "영화관", "카페/놀거리", "당구장", "pc방","스포츠/오락","오락실","찜질방","놀이공원"];
    var yValues_play = [55, 49, 44, 24, 15,13,15,17,81];*/
    var barColors = [
    "#ff6565",
    "#657fff",
    "#ffa365",
    "#f5ff65",
    "#72ff65",
    "#9b65ff",
    "#4f47a7",
    "#47a7a7",
    "#f398ff",
    ];

    new Chart("myChart_play", {
      type: "doughnut",
      data: {
        labels: xValues_play,
        datasets: [{
          backgroundColor: barColors,
          data: yValues_play
        }]
      },
      options: {
        legend:{
          position:'right'
        }
      }
    });
}

function makeFoodPieChart(categoryData) {
	//food pie chart
	var xValues_food = [];
	var yValues_food = [];
	for(let i = 0; i < categoryData.length; i++) {
		xValues_food.push(categoryData[i].category);
	}
	for(let i = 0; i < categoryData.length; i++) {
		yValues_food.push(categoryData[i].categoryCount);
	}
	//console.log(categoryData);
	//console.log(xValues_food);
	//console.log(yValues_food);
/*    var xValues_food = ["한식", "중식", "일식", "양식", "카페","술집"];
    var yValues_food = [55, 49, 44, 24, 15,13];*/
    var barColors = [
    "#ff6565",
    "#657fff",
    "#ffa365",
    "#f5ff65",
    "#72ff65",
    "#9b65ff"
    ];

	new Chart("myChart_food", {
	  type: "doughnut",
	  data: {
	    labels: xValues_food,
	    datasets: [{
	      backgroundColor: barColors,
	      data: yValues_food
	    }]
	  },
	  options: {
	    legend: {
	      position:'right',
	      
	    }
	  }
	});
}

function makePieChart(select) {
	let station = $(".midPoint_value").text();
	let section;
	
	if(select == "food") {	section = 1; }
	else if(select == "play") { section = 2; }
	
	$(document).ready(function(){
		const xhttp = new XMLHttpRequest(); 
		xhttp.onload = function() {
			let data = this.responseText;
			
			data = JSON.parse(data);
			//console.log(data);

			if(data.length != 0){	
				if(section == 1) { makeFoodPieChart(data); }
				else if(section == 2) { makePlayPieChart(data); }
			}
			else {				
			}

		}
		xhttp.open("GET", "get-piedata?station="+station+"&section="+section, true); 
		xhttp.send();
	})
	
}