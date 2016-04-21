package com.gluk.z2j.model;

public class Command {
	
	public int code;
	public int param;
	
	public Command(int code, int param) {
		this.code  = code;
		this.param = param; 
	}
	
	public boolean isEqual(Command c) {
		return (code == c.code) && (param == c.param);
	}
}
