package com.gluk.z2j.api.model;

public interface IMoveTemplate {
	int getOffset();
	void addCommand(int code, int param, String name, String desc);
	void addCommand(int code, String desc);
	void fixup(int offset, int param) throws Exception;
}
