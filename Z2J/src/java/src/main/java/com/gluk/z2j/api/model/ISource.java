package com.gluk.z2j.api.model;

import com.gluk.z2j.api.loader.IDoc;

public interface ISource {
	void extract(IDoc dest) throws Exception;
}
