package com.gluk.z2j.api.form;


public interface IMoveParser {
	IForm createForm(String tag, boolean isTop) throws Exception;
	void setMode(String mode);
	boolean isNavigation(String name);
}
