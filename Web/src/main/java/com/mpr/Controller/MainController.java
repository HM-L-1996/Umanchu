package com.mpr.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.mpr.DB.CategoryVO;
import com.mpr.DB.IdInfoVO;
import com.mpr.DB.SubwaylocVO;
import com.mpr.service.DBService;
import com.mpr.service.MapService;

import lombok.AllArgsConstructor;

@Controller
@RestController
@AllArgsConstructor
public class MainController {
	private final DBService dbService;
	private final MapService mapService;
	
	// 메인 화면 반환
	@RequestMapping(value="/", method=RequestMethod.GET)
	public ModelAndView Main() {
		ModelAndView mav = new ModelAndView();
		mav.setViewName("MainPage.html");
		return mav;
	}
	
	// 구글 지오 코드 반환 함수
	@GetMapping("get-geocode")
	public double[][] getGeocode(String one, String two, String three, String four, String five, String six, String seven, String eight) throws IOException {
		List<String> locationList = new ArrayList<String>(); 
		if (one != "") { locationList.add(one); }
		if (two != "") { locationList.add(two); }
		if (three != "") { locationList.add(three); }
		if (four != "") { locationList.add(four); }
		if (five != "") { locationList.add(five); }
		if (six != "") { locationList.add(six); }
		if (seven != "") { locationList.add(seven); }
		if (eight != "") { locationList.add(eight); }
		
		double[][] dcodeArr = new double[locationList.size()][2];
		
		for(int i = 0; i < locationList.size(); i++) {		
			double[] dcode = mapService.getGeoPoint(locationList.get(i));
			dcodeArr[i] = dcode;
		}
		
		return dcodeArr;
	}
	
	// 중앙 지점 반환 함수
	@GetMapping("get-centroid")
	public double[] getMiddlePoint(String one, String two, String three, String four, String five, String six, String seven, String eight) {
		List<double[]> spotList = new ArrayList<double[]>(); 
		if (one != "") {
			String stringOne[] = one.split(",");
			double[] doubleOne = Arrays.stream(stringOne).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleOne);
		}
		if (two != "") {
			String stringTwo[] = two.split(",");
			double[] doubleTwo = Arrays.stream(stringTwo).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleTwo);
		}
		if (three != "") {
			String stringThree[] = three.split(",");
			double[] doubleThree = Arrays.stream(stringThree).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleThree);
		}
		if (four != "") {
			String stringFour[] = four.split(",");
			double[] doubleFour = Arrays.stream(stringFour).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleFour);
		}
		if (five != "") {
			String stringFive[] = five.split(",");
			double[] doubleFive = Arrays.stream(stringFive).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleFive);
		}
		if (six != "") {
			String Stringsix[] = six.split(",");
			double[] doublesix = Arrays.stream(Stringsix).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doublesix);
		}
		if (seven != "") {
			String stringSeven[] = seven.split(",");
			double[] doubleSeven = Arrays.stream(stringSeven).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleSeven);
		}
		if (eight != "") {
			String stringEight[] = eight.split(",");
			double[] doubleEight = Arrays.stream(stringEight).mapToDouble(Double::parseDouble).toArray();
			spotList.add(doubleEight);
		}
		
		double[][] points = spotList.stream().toArray(double[][]::new);
		
		return mapService.findCentroid(points);
	}
	// 중간지점 근처 역 찾는 함수
	@GetMapping("get-subway")
	public SubwaylocVO getSubwayStation(String Centroid, String Radius) throws IOException {	
		// 구글 Place API로 근처에 존재하는 역 배열로 가져옴
		String[] subwayList = mapService.getSubwayStation(Centroid, Radius);	
		
		// 근처 역 결과가 없었을 경우 500m씩 반경을 넓히며 재검사
		if (subwayList.length == 0) {
			System.out.println(Radius + " 반경 내에 역이 없습니다.");
			for(int i = 1; i < 4; i++) {
				int ntemp = (Integer.parseInt(Radius) + 500 * i);
				System.out.println(ntemp + " 반경 으로 검색 시작");
				subwayList = mapService.getSubwayStation(Centroid, Integer.toString(ntemp));
				
				if (subwayList.length != 0) { break; }
				else { System.out.println(ntemp + " 반경 내에 역이 없습니다."); }
			}
		}
		
		SubwaylocVO result = null;
		// 확인용 역 출력, 최종적으로 삭제 예정
		for (String temp : subwayList) {
			System.out.println(temp);
		}
		
		System.out.println("구글 Place API 종료");
			
		for(int i = 0; i < subwayList.length; i++) {
			try {
				List<SubwaylocVO> dbSubwayList = dbService.findSubway(subwayList[i]);
					
				System.out.println(dbSubwayList.toString()); 
				System.out.println("DB Like 조회 종료");
				int count = dbSubwayList.size();
				if(count != 0) {
					for(int j = 0; j < count; j++) {
						
						String strTemp = dbSubwayList.get(j).getStation();
						
						if(strTemp.contains(subwayList[i])) { 
							if(subwayList[i].equals("강남")) {
								if (strTemp.equals("강남역")) {
									result = dbSubwayList.get(j); 
									return result;
								}
							}
							else {
								result = dbSubwayList.get(j); 
								return result; }
							}
						else { System.out.println(strTemp + "이름을 가진 " + i + "번째 역은 존재 하지 않습니다."); }	
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				//예외 상황에 따른뷰 
			}
		}
		System.out.println(result);
		return result;
	}
	
	// 최종 만날 위치 찾는 함수
	@RequestMapping(value="get-meetpoint",  method=RequestMethod.POST)
	public ModelAndView getmeetpoint(HttpServletRequest request, String one, String two, String three, String four, String five, String six, String seven, String eight) throws IOException {
		// 1. 받은 주소를 지오코딩으로 위도 경도로 변환
		System.out.println("--지오 코딩 시작--");
		double[][] latlonArr = getGeocode(one, two, three, four, five, six, seven, eight);
		System.out.println("--지오 코딩 끝--");
		
		// 2. 위도 경도 기반으로 중간지점 찾기
		System.out.println("--중간지점 찾기 시작--");
		double[] midPoint = mapService.findCentroid(latlonArr);
		System.out.println("중간지점 좌표 : " + midPoint[0] + "," + midPoint[1]);
		System.out.println("--중간지점 찾기 끝--");
		
		// 3. 중간 지점 근처 역 찾기
		System.out.println("--중간지점 근처 역 찾기 시작--");
		String strMidPoint = midPoint[0] + "," + midPoint[1];
		String Radius = "1000";
		SubwaylocVO meetPointInfo = getSubwayStation(strMidPoint, Radius);
		String meetPoint = meetPointInfo.getStation();
		Double meetPointLat = meetPointInfo.getLat();
		Double meetPointLng = meetPointInfo.getLng();
		System.out.println("--중간지점 근처 역 : " + meetPoint + "--");
		System.out.println("--중간지점 근처 역 찾기 끝--");
		
		System.out.println(meetPoint);
		
		// 세션값 추가 [사용자 위도 경도]
		HttpSession session = request.getSession();
		session.setAttribute("latlngArr", latlonArr);
		
		// view 리턴
		ModelAndView mav = new ModelAndView();
		mav.setViewName("Recommand.html");
		mav.addObject("station", meetPoint);
		mav.addObject("stationLat", meetPointLat);
		mav.addObject("stationLng", meetPointLng);
		return mav;
	}
	
	///////////////////////////////////////////
	/////	DB 관련 컨트롤러
	///////////////////////////////////////////
	
	// 추천 DB 호출(middleLV는 쓸지 안쓸지 몰라서 일단 가져옴)
	@GetMapping("get-rankingdata")
	public List<IdInfoVO> getRankingData(String station, String middleLV, String minorLV) {
		
		return dbService.findRankingData(station, middleLV, minorLV);
	}
	
	@GetMapping("DBTest")
	public List<IdInfoVO> getAllData(String station) {
		return  dbService.findAllData(station);
	}
	// 가게 세부 정보 호출
	@GetMapping("get-shopdata")
	public IdInfoVO getShopData(String station, String shopId) {	
		return dbService.findShopInfo(station, shopId);
	}
	// 워드 클라우드 DB 호출 함수
	@GetMapping("get-clouddata")
	public List<IdInfoVO> getSectionData(String station, String section) {		
		return dbService.findSectionInfo(station, section);
	}
	// Pie DB 호출 함수
	@GetMapping("get-piedata")
	public List<CategoryVO> getCategoryCount(String station, String section) {
		return dbService.findCategoryCount(station, section);
	}
}
