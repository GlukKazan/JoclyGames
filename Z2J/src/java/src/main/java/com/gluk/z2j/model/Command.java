package com.gluk.z2j.model;

public class Command {
	
	private int    code;
	private int   param;
	private String name;
	private String desc;
	
	public Command(int code, int param, String name, String desc) {
		this.code  = code;
		this.param = param; 
		this.name  = name;
		this.desc  = desc;
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
	
	public String getDesc() {
		return desc;
	}
	
	public boolean isEqual(Command c) {
		return (code == c.code) && (param == c.param);
	}
	
	public void setParam(int param) {
		this.param = param;
	}
}
