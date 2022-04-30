package com.mpr.DB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

@Component
public class CategoryDAO {
	public ArrayList<CategoryVO> findCategoryCount (String tableName, String section) {
		ArrayList<CategoryVO> categoryList = null;
		String sql = null;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String tagTable = tableName + "_tag";
		String infoTable = tableName + "_id_info";
		
		try {
			sql = "select category1, COUNT(*) from " + tagTable + " where (`section` = " + section + ") group by category1";
		
			conn = DBconn.getConnection();
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			categoryList = new ArrayList<CategoryVO>();
			while (rs.next()) {
				CategoryVO categoryInfo = new CategoryVO(
					rs.getString(1),	// category
					rs.getInt(2)		// categoryCount
				);
				categoryList.add(categoryInfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DBUtil.close(conn, pstmt, rs);
		}
		return categoryList;
	}
}
