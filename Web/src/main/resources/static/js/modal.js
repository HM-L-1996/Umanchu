let m_btn = [
  { class: "btn_1" },
  { class: "btn_2" },
  { class: "btn_3" },
  { class: "btn_4" },
  { class: "btn_5" },
  { class: "btn_6" },
  { class: "btn_7" },
  { class: "btn_8" },
];

    function Action_Slide(index){      
        var modal = document.getElementById('myModal');
  
        // Get the button that opens the modal
        var btn = document.getElementById(`myBtn${index}`);
        
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];                                          
        
        // When the user clicks on the button, open the modal 
        btn.onclick = function() {
            //BackGround Body Tag Overflow hidden because auto is not pretty
            document.getElementsByTagName("body")[0].style.overflow="hidden";          
            modal.style.display = "block";
            
            //console.log(btn);
            
            // 카드 클릭시 가게 상세 정보 표시 함수
            let lshopId = btn.querySelector('input').value;
            
            getShopInfoModal(lshopId);
        }
        
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            document.getElementsByTagName("body")[0].style.overflow="auto";
        }
        
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                document.getElementsByTagName("body")[0].style.overflow="auto";
            }
        }
      }
      
// 가게 세부 내용 표시 함수
function getShopInfoModal(shopId) {
	$(document).ready(function(){
		let station = $(".midPoint_value").text();
		let startLatLng = userLatLanArr;
		//console.log(startLatLng);
		const xhttp = new XMLHttpRequest(); 
		xhttp.onload = function() {
			let data = this.responseText;
			
			data = JSON.parse(data);
			//console.log(data);
			
			// 데이터가 있을때 표기
			if(data.length != 0){	
				// 가게 데이터 입력
				setShopInfo(data);
				// 첫 길찾기 데이터 입력
				getDirection(startLatLng[0]);
			}
			else {				
			}
		}
		xhttp.open("GET", "get-shopdata?station="+station+"&shopId="+shopId, true); 
		xhttp.send();
	})
	
}
  
// 가게 정보 입력 함수
function setShopInfo(shopData) {
	let addHtml = "";
	let btnCount = userLatLanArr.length;
	
	// 버튼 생성
	for(let i = 0; i < btnCount; i++){
		if(i == 0) { addHtml += '<div class="m_btn btn_1 m_btn_checked' +'" id="btn_'+ (i + 1) +'" onclick="selectUserDirection('+ (i + 1) +')">' + (i + 1) + '</div>'; }
		else { addHtml += '<div class="m_btn btn_'+ (i + 1) +'" id="btn_'+ (i + 1) +'" onclick="selectUserDirection('+ (i + 1) +')">' + (i + 1) + '</div>'; }
	}
	$('.modalContainer').html(addHtml);
	addHtml = "";
	
	// 가게 세부 정보 생성
	addHtml += '<div class="info-thumnail">';
	addHtml += "<img src='"+ shopData.thumbnail +"' class='modal_thumnail' onerror='this.src=`./img/Top5Alt.png`'>";
	addHtml += '</div>';
	addHtml += '<div class="info-title">';
	addHtml +=   '가게이름 : ';
	addHtml +=   '<span id="shop-title">'+ shopData.name +'</span>';
	addHtml += '</div>';
	addHtml += '<div class="info-address">';
	addHtml +=  '주소 : ';
	addHtml +=   '<span id="shop-address">' + shopData.address + '</span>';
	addHtml += '</div>';
	addHtml += '<div class="info-number">';
	addHtml +=   '전화번호 : ';
	addHtml +=   '<span id="shop-number">' + shopData.tel + '</span>';
	addHtml += '</div>';
	addHtml += '<div class="info-bizHour">';
	addHtml +=   '운영시간 : ';
	if(shopData.bizHour != null) { addHtml +=   '<span id="shop-bizHour">' + shopData.bizHour + '</span>'; }
	else { addHtml +=   '<span id="shop-bizHour"></span>'; }
	addHtml += '</div>';
	addHtml += '<div class="info-menu">';
	addHtml +=   '메뉴 : ';
	if(shopData.menu != null) { addHtml +=  '<span id="shop-menu">' + shopData.menu + '</span>'; }
	else { addHtml +=  '<span id="shop-menu"></span>'; }
	addHtml += 	"<input type='hidden' class='shopLat' value='" + shopData.lat +"'>"
	addHtml += 	"<input type='hidden' class='shopLng' value='" + shopData.lng +"'>"
	$('.infobox').html(addHtml);
	addHtml = "";
}

// 길찾기 실행 함수
function getDirection(start) {
	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer();
	const map = new google.maps.Map(document.getElementById("DirectionMap"), {
    zoom: 13,
    center: { lat: 37.555561, lng: 126.971832 },	//	임시값
  	});
  	let strStart = start[0] + "," + start[1];
  	let strEnd = $('.shopLat').val() + "," +$('.shopLng').val();
  	//console.log(strStart);
  	//console.log(strEnd);

  	calculateAndDisplayRoute(directionsService, directionsRenderer, strStart, strEnd);
  	directionsRenderer.setMap(map);
}
// 길찾기 내부 함수
function calculateAndDisplayRoute(directionsService, directionsRenderer, start, end) {
  directionsService
    .route({
      origin: {
        //query: document.getElementById("start").value, 
        query: start,
      },
      destination: {
        //query: document.getElementById("end").value,
        query: end,
      },
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.TRANSIT,
    })
    .then((response) => {
      //console.log(response);
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
}

function selectUserDirection(index) {
//	let btnUser = document.getElementById(`btn_${index}`);
$(document).ready(function () {
  $(".m_btn").click(function () {
    for (let i = 0; i < m_btn.length; i++) {
      $(`.${m_btn[i]["class"]}`).removeClass("m_btn_checked");
    }
    $(this).addClass("m_btn_checked");
    
	let startLatLng = userLatLanArr;
	getDirection(startLatLng[index - 1]);
  });
});
/*	btnUser.onclick = function() {
			let startLatLng = userLatLanArr;
			getDirection(startLatLng[index - 1]);
        }*/
}

$(document).ready(function () {
  $(".m_btn").click(function () {
    for (let i = 0; i < m_btn.length; i++) {
      $(`.${m_btn[i]["class"]}`).removeClass("m_btn_checked");
    }
    $(this).addClass("m_btn_checked");
  });
});
