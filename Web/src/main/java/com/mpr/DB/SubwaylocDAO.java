package com.mpr.DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class SubwaylocDAO {
	public ArrayList<SubwaylocVO> getAllList (String tableName) throws Exception {
		ArrayList<SubwaylocVO> subwayList = null;
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			sql = "select * from " + tableName;
		
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			subwayList = new ArrayList<SubwaylocVO>();
			while (rs.next()) {
				SubwaylocVO subwayInfo = new SubwaylocVO(
					rs.getLong(1),
					rs.getString(2),
					rs.getDouble(3),
					rs.getDouble(4)
				);
				subwayList.add(subwayInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
			// 여기 throw e 처럼 던져줘야 하는 경우도 있음
			throw e;
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return subwayList;
	}
	
	// Like로 역 검색 함수
	public List<SubwaylocVO> findByStationLike(String Station) throws Exception {
		ArrayList<SubwaylocVO> subwayList = null;
		String sql = "";
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			sql = "select * from station_info where station_name like ?";
			
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, Station+"%");
			rs = pstmt.executeQuery();
			
			subwayList = new ArrayList<SubwaylocVO>();
			while (rs.next()) {
				SubwaylocVO subwayInfo = new SubwaylocVO(
					rs.getLong(1),
					rs.getString(2),
					rs.getDouble(3),
					rs.getDouble(4)
				);
				subwayList.add(subwayInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return subwayList;
	}
}
