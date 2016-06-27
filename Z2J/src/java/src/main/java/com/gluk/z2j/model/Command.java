package com.gluk.z2j.model;

public class Command {
	
	private int    code;
	private int   param;
	private String name;
	
	public Command(int code, int param, String name) {
		this.code  = code;
		this.param = param; 
		this.name  = name;
	}
	
	public Integer getCode() {
		return code;
	}
	
	public Integer getParam() {
		return param;
	}
	
	public String getName() {
		return name;
	}
	
	public boolean isEqual(Command c) {
		return (code == c.code) && (param == c.param);
	}
	
	public void setParam(int param) {
		this.param = param;
	}
}
