package com.gluk.z2j.api.model;

public interface IMoveTemplate {
	int getOffset();
	void addCommand(int code, int param);
	void fixup(int offset, int param);
}
