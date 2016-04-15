package com.gluk.z2j.api;

import java.util.List;

public interface IGrid {
	void addDimension(String dir) throws Exception;
	void addDirection(String name, List<Integer> deltas) throws Exception;
}
