package com.gluk.z2j.api.model;

import com.gluk.z2j.api.form.IForm;

public interface IPiece {
	void addMove(IForm form, String mode, boolean isDrop) throws Exception;
}
