package com.mpr.DB;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data					
@AllArgsConstructor		
@NoArgsConstructor		
public class IdInfoVO {
	private int tagIndex;
	private long tagId;
	private String category1;
	private String category2;
	private double score;
	private int section;
	private int infoIdIndex;
	private long infoId;
	private String name;
	private String tel;
	private String address;
	private String bizHour;
	private String context;
	private String menu;
	private int reviewcount;
	private String microreview;
	private String thumbnail;
	private double lat;
	private double lng;
	private int ranking;
}
