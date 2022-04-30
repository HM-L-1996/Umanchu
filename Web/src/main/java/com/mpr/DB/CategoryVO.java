package com.mpr.DB;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor		
@NoArgsConstructor
public class CategoryVO {
	private String category;
	private int categoryCount;
}
