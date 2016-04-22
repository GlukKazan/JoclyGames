package com.gluk.z2j.model;

public class Command {
	
	public int code;
	public int param;
	public String name;
	
	public Command(int code, int param, String name) {
		this.code  = code;
		this.param = param; 
		this.name  = name;
	}
	
	public boolean isEqual(Command c) {
		return (code == c.code) && (param == c.param);
	}
}
