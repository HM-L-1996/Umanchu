package com.mpr.DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

@Component
public class IdInfoDAO {
	public ArrayList<IdInfoVO> getAllList (String tableName) {
		ArrayList<IdInfoVO> storeList = null;
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String tagTable = tableName + "_tag";
		String infoTable = tableName + "_id_info";
		
		try {
			sql = "select * from " + tagTable + "," + infoTable + " where (" + tagTable + ".id = " + infoTable + ".id)";
		
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			storeList = new ArrayList<IdInfoVO>();
			while (rs.next()) {
				IdInfoVO storeInfo = new IdInfoVO(
					rs.getInt(1),		// tag_Index
					rs.getLong(2),		// tag_id
					rs.getString(3),	// category1
					rs.getString(4),	// category2
					rs.getDouble(5),	// score
					rs.getInt(6),		// section
					rs.getInt(7),		// info_Index
					rs.getLong(8),		// info_id
					rs.getString(9),	// name
					rs.getString(10),	// tel
					rs.getString(11),	// addr
					rs.getString(12),	// bizhour
					rs.getString(13),	// context
					rs.getString(14),	// menu
					rs.getInt(15),		// reviewcount
					rs.getString(16),	// microreview
					rs.getString(17),	// thumbnail
					rs.getDouble(18),	// lat
					rs.getDouble(19),	// lng
					rs.getInt(20)		// ranking
				);
				storeList.add(storeInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return storeList;
	}
	
	public ArrayList<IdInfoVO> findShopRanking (String tableName, String mSelected, String selected) {
		ArrayList<IdInfoVO> storeList = null;
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String tagTable = tableName + "_tag";
		String infoTable = tableName + "_id_info";
		String[] selectedArr = selected.split("\\|");
		
		// 특수문자가 들어간 경우 특숨누자 인식을 위해 추가
		if (mSelected.contains("/")) {
			mSelected.replace("/", "\\/");
		}
		
		try {
			if(selectedArr.length == 1) { sql = "select * from " + tagTable + "," + infoTable +" where (" + tagTable + ".id = " + infoTable + ".id) and (" + tagTable + ".category1 = ?) and " + tagTable + ".category2 in(?) order by score DESC limit 35"; }
			else if(selectedArr.length == 2) { sql = "select * from " + tagTable + "," + infoTable +" where (" + tagTable + ".id = " + infoTable + ".id) and (" + tagTable + ".category1 = ?) and " + tagTable + ".category2 in(?,?) order by score DESC limit 35"; }
			else if(selectedArr.length == 3) { sql = "select * from " + tagTable + "," + infoTable +" where (" + tagTable + ".id = " + infoTable + ".id) and (" + tagTable + ".category1 = ?) and " + tagTable + ".category2 in(?,?,?) order by score DESC limit 35"; }
			
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			if(selectedArr.length == 1) { 
				pstmt.setString(1, mSelected); 
				pstmt.setString(2, selectedArr[0]); 
			}
			else if(selectedArr.length == 2) {  
				pstmt.setString(1, mSelected);
				pstmt.setString(2, selectedArr[0]);
				pstmt.setString(3, selectedArr[1]);
			}
			else if(selectedArr.length == 3) {  
				pstmt.setString(1, mSelected);
				pstmt.setString(2, selectedArr[0]);
				pstmt.setString(3, selectedArr[1]);
				pstmt.setString(4, selectedArr[2]);
			}
			rs = pstmt.executeQuery();
			storeList = new ArrayList<IdInfoVO>();
			while (rs.next()) {
				IdInfoVO storeInfo = new IdInfoVO(
					rs.getInt(1),		// tag_Index
					rs.getLong(2),		// tag_id
					rs.getString(3),	// category1
					rs.getString(4),	// category2
					rs.getDouble(5),	// score
					rs.getInt(6),		// section
					rs.getInt(7),		// info_Index
					rs.getLong(8),		// info_id
					rs.getString(9),	// name
					rs.getString(10),	// tel
					rs.getString(11),	// addr
					rs.getString(12),	// bizhour
					rs.getString(13),	// context
					rs.getString(14),	// menu
					rs.getInt(15),		// reviewcount
					rs.getString(16),	// microreview
					rs.getString(17),	// thumbnail
					rs.getDouble(18),	// lat
					rs.getDouble(19),	// lng
					rs.getInt(20)		// ranking
				);
				storeList.add(storeInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return storeList;
	}
	
	// 가게 세부 정보 호출 함수
	public IdInfoVO findShopInfo (String tableName, String shopId) {
		IdInfoVO storeInfo = new IdInfoVO();
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String tagTable = tableName + "_tag";
		String infoTable = tableName + "_id_info";
		Long lshopId = Long.parseLong(shopId);
		
		try {
			sql = "select * from " + tagTable + "," + infoTable +" where (" + tagTable + ".id = " + infoTable + ".id) and (" + infoTable + ".id = ?)";
			
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			
			pstmt.setLong(1, lshopId); 

			rs = pstmt.executeQuery();
			if (rs.next()) {
				storeInfo.setTagIndex(rs.getInt(1));		// tag_Index
				storeInfo.setTagId(rs.getLong(2));			// tag_id
				storeInfo.setCategory1(rs.getString(3));	// category1
				storeInfo.setCategory2(rs.getString(4));	// category2
				storeInfo.setScore(rs.getDouble(5));		// score
				storeInfo.setSection(rs.getInt(6));			// section
				storeInfo.setInfoIdIndex(rs.getInt(7));		// info_Index
				storeInfo.setInfoId(rs.getLong(8));			// info_id
				storeInfo.setName(rs.getString(9));			// name
				storeInfo.setTel(rs.getString(10));			// tel
				storeInfo.setAddress(rs.getString(11));		// addr
				storeInfo.setBizHour(rs.getString(12));		// bizhour
				storeInfo.setContext(rs.getString(13));		// context
				storeInfo.setMenu(rs.getString(14));		// menu
				storeInfo.setReviewcount(rs.getInt(15));	// reviewcount
				storeInfo.setMicroreview(rs.getString(16));	// microreview
				storeInfo.setThumbnail(rs.getString(17));	// thumbnail
				storeInfo.setLat(rs.getDouble(18));			// lat
				storeInfo.setLng(rs.getDouble(19));			// lng
				storeInfo.setRanking(rs.getInt(20));		// ranking
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return storeInfo;
	}
	
	// Section 정보 데이터 불러오는 함수
	public ArrayList<IdInfoVO> findSectionInfo (String tableName, String section) {
		ArrayList<IdInfoVO> storeList = null;
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String tagTable = tableName + "_tag";
		String infoTable = tableName + "_id_info";
		int nSection = Integer.parseInt(section);
		
		try {
			sql = "select * from " + tagTable + "," + infoTable + " where (" + tagTable + ".id = " + infoTable + ".id) and (" + tagTable + ".section = ?) order by " + tagTable + ".score DESC";
		
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, nSection);
			rs = pstmt.executeQuery();
			storeList = new ArrayList<IdInfoVO>();
			while (rs.next()) {
				IdInfoVO storeInfo = new IdInfoVO(
					rs.getInt(1),		// tag_Index
					rs.getLong(2),		// tag_id
					rs.getString(3),	// category1
					rs.getString(4),	// category2
					rs.getDouble(5),	// score
					rs.getInt(6),		// section
					rs.getInt(7),		// info_Index
					rs.getLong(8),		// info_id
					rs.getString(9),	// name
					rs.getString(10),	// tel
					rs.getString(11),	// addr
					rs.getString(12),	// bizhour
					rs.getString(13),	// context
					rs.getString(14),	// menu
					rs.getInt(15),		// reviewcount
					rs.getString(16),	// microreview
					rs.getString(17),	// thumbnail
					rs.getDouble(18),	// lat
					rs.getDouble(19),	// lng
					rs.getInt(20)		// ranking
				);
				storeList.add(storeInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return storeList;
	}
}
