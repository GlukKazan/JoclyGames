package com.gluk.z2j.model;

import java.util.Collection;
import java.util.List;

public class Move {
	
	private int mode;
	private int template;
	private List<Integer> params;
	private boolean isDrop;
	
	public Move(int template, List<Integer> params, int mode, boolean isDrop) {
		this.template = template;
		this.params   = params;
		this.mode     = mode;
		this.isDrop   = isDrop; 
	}
	
	public boolean isDrop() {
		return isDrop;
	}

	public Integer getMode() {
		return mode;
	}

	public Integer getTemplate() {
		return template;
	}
	
	public Collection<Integer> getParams() {
		return params;
	}
}
