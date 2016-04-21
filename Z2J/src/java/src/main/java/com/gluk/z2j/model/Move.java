package com.gluk.z2j.model;

import java.util.List;

public class Move {
	
	public int mode;
	public int template;
	public List<Integer> params;
	
	public Move(int template, List<Integer> params, int mode) {
		this.template = template;
		this.params = params;
		this.mode = mode;
	}
}
