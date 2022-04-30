package com.mpr.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;


@AllArgsConstructor
@Service
public class MapService {
	
	// 구글 길찾기[구글 Direction API 사용]
	public String getDirectionGoogle(String Start, String End) throws IOException {
		String result = "";
		String mode = "transit";
		String departureTime = "now";
		String apiKey = "APIKEY";
		
		String googleUrl = "https://maps.googleapis.com/maps/api/directions/json?"
							+"origin="+Start
							+"&destination="+End
							+"&mode="+mode
							+"&departure_time="+departureTime
							+"&key="+apiKey;
		
		String inputLine = null;
        StringBuffer outResult = new StringBuffer();
		
		try {
            URL url = new URL(googleUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);
//	            conn.connect();
            
//	            OutputStream os = conn.getOutputStream();
//	            os.write("json".getBytes("UTF-8"));
//	            os.flush();
            
            // 리턴 결과 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            while ((inputLine = in.readLine()) != null) {
                outResult.append(inputLine);
            }
            
            conn.disconnect();
            System.out.println("[getDirectionGoogle] REST API End");
            
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
		
		return outResult.toString();
	}
	
	// 구글 지오코딩 함수 [구글 geocoding API, json-simple 라이브러리 사용]
	public double[] getGeoPoint(String location) throws IOException {
		double[] result = null;
		String language = "ko";
		String apikey = "APIKEY";
		String address = URLEncoder.encode(location, "UTF-8");
		
		String googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?"
							+"address="+address
							+"&language="+language
							+"&key="+apikey;
		
		String inputLine = null;
        StringBuffer outResult = new StringBuffer();
		
		try {
            URL url = new URL(googleUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);

            
            // 리턴 결과 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            while ((inputLine = in.readLine()) != null) {
                outResult.append(inputLine);
            }
            

	        // JSON Data로 변환
            JSONParser jsonParse = new JSONParser();
            
            // JSONParse에 Json 형태의 String 데이터를 넣어 파싱한 후 JSONObject로 변환
            JSONObject jsonObj = (JSONObject)jsonParse.parse(outResult.toString());
            
	        // JSONObject에서 result 항목을 가져와서 JSONArray에 저장
            JSONArray apiResults = (JSONArray)jsonObj.get("results");
            
            result = new double[2];
            
            for(int i = 0; i < apiResults.size(); i++) {
            	JSONObject geocodeObject = (JSONObject)apiResults.get(i);
            	System.out.println(geocodeObject.get("geometry"));
            	JSONObject locationObj = (JSONObject) geocodeObject.get("geometry");
            	JSONObject geocode = (JSONObject)locationObj.get("location");
            	System.out.println(geocode.get("lat"));
            	System.out.println(geocode.get("lng"));
            	
            	result[0] = Double.parseDouble(geocode.get("lat").toString());
            	result[1] = Double.parseDouble(geocode.get("lng").toString());
            }

            conn.disconnect();
            System.out.println("getGeoPoint REST API End");
            
        } catch (NullPointerException e) {
            e.printStackTrace();
        } catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
	
	// 중앙지점 찾는 함수
	public double[] findCentroid(double v[][])
    {
        double []ans = new double[2];
         
        int n = v.length;
        double signedArea = 0;
        
        if(n == 2) {
        	double x0 = v[0][0], y0 = v[0][1];
        	double x1 = v[1][0], y1 = v[1][1];
        	
        	double avgx = (x0+x1) / n;
        	double avgy = (y0+y1) / n;
        	ans[0] = avgx;
        	ans[1] = avgy;
        }
        else {
        	// For all vertices
            for (int i = 0; i < n; i++)
            {
                 
                double x0 = v[i][0], y0 = v[i][1];
                double x1 = v[(i + 1) % n][0], y1 = v[(i + 1) % n][1];
                                     
                // Calculate value of A
                // using shoelace formula
                double A = (x0 * y1) - (x1 * y0);
                signedArea += A;
                 
                // Calculating coordinates of
                // centroid of polygon
                ans[0] += (x0 + x1) * A;
                ans[1] += (y0 + y1) * A;
            }
         
            signedArea *= 0.5;
            ans[0] = (ans[0]) / (6 * signedArea);
            ans[1]= (ans[1]) / (6 * signedArea);
        }
        
        return ans;
    }

	
	// 중간 지점 근처 역 찾기 [구글 place API, json-simple 라이브러리 사용]
	public String[] getSubwayStation(String Centroid, String Radius) throws IOException {
		String[] result = null;
		String type = "subway_station";
		String language = "ko";
		String apiKey = "APIKEY";
		
		String googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
							+"location="+Centroid
							+"&radius="+Radius
							+"&type="+type
							+"&language="+language
							+"&key="+apiKey;
		
		String inputLine = null;
        StringBuffer outResult = new StringBuffer();
		
		try {
            URL url = new URL(googleUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10000);
            conn.setConnectTimeout(15000);
            conn.setRequestMethod("GET");
            conn.setDoInput(true);
       
            // 리턴 결과 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            while ((inputLine = in.readLine()) != null) {
                outResult.append(inputLine);
            }

            // JSON Data로 변환
            JSONParser jsonParse = new JSONParser();
            
            // JSONParse에 Json 형태의 String 데이터를 넣어 파싱한 후 JSONObject로 변환
            JSONObject jsonObj = (JSONObject)jsonParse.parse(outResult.toString());
            
            // JSONObject에서 result 항목을 가져와서 JSONArray에 저장
            JSONArray subwayInfo = (JSONArray)jsonObj.get("results");
            
            result = new String[subwayInfo.size()];
            
            for(int i = 0; i < subwayInfo.size(); i++) {
            	JSONObject subwayObject = (JSONObject)subwayInfo.get(i);
            	System.out.println(subwayObject.get("geometry"));
            	System.out.println(subwayObject.get("name"));
            	result[i] = subwayObject.get("name").toString();
            }
            
            conn.disconnect();
            System.out.println("getSubwayStation REST API End");
            
        } catch (NullPointerException e) {
            e.printStackTrace();
        } catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
}
