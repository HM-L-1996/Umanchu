package com.mpr.DB;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data					
@AllArgsConstructor		
@NoArgsConstructor						
public class SubwaylocVO {
	private Long stationId;	// station_id
	private String station;	// station_name
	private Double lat;		// lat
	private Double lng;		// lng
}
