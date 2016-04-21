package com.gluk.z2j.api.model;

public interface IMoveTemplate {
	int getOffset();
	void addCommand(int code, int param);
	void addCommand(int code);
	void fixup(int offset, int param) throws Exception;
}
