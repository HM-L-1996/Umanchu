package com.mpr.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mpr.DB.CategoryDAO;
import com.mpr.DB.CategoryVO;
import com.mpr.DB.IdInfoDAO;
import com.mpr.DB.IdInfoVO;
import com.mpr.DB.SubwaylocDAO;
import com.mpr.DB.SubwaylocVO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class DBService {
	
	private SubwaylocDAO subwayLocDao;
	private IdInfoDAO idInfoDao;
	private CategoryDAO categoryDao;
	
	// 역 이름으로 같은 이름의 역이 있는지 확인 후 해당 역 정보 넘기는 함수
	public List<SubwaylocVO> findSubway(String station) throws Exception {
		try {
			List<SubwaylocVO> stations =  subwayLocDao.findByStationLike(station);
			if(stations.size() != 0) {
				return stations;
			}else {
				throw new Exception("해당 하는 역이 존재하지 않습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("다음 역을 검색합니다.");
		}
		
	}
	
	public List<IdInfoVO> findRankingData(String station, String mSelected, String selected) {
		return idInfoDao.findShopRanking(station, mSelected, selected);
	}
	
	public List<IdInfoVO> findAllData(String station) {
		return idInfoDao.getAllList(station);
	}
	
	public IdInfoVO findShopInfo(String station, String shopId) {
		return idInfoDao.findShopInfo(station, shopId);
	}
	
	public List<IdInfoVO> findSectionInfo(String station, String section) {
		return idInfoDao.findSectionInfo(station, section);
	}
	
	public List<CategoryVO> findCategoryCount(String station, String section) {
		return categoryDao.findCategoryCount(station, section);
	}
}
