package com.mpr.DB;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBconn {
	public static Connection getConnection() throws ClassNotFoundException, SQLException {
		String jdbcDriver = "com.mysql.cj.jdbc.Driver";
		String jdbcUrl = "jdbc:mysql://주소:3306/데이터베이스?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true";
		String dbUser = "ID";
		String dbPwd = "PASS";
		Class.forName(jdbcDriver);
		return DriverManager.getConnection(jdbcUrl,dbUser,dbPwd);
	}
}
