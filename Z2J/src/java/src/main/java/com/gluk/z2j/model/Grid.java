package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gluk.z2j.api.model.IBoard;
import com.gluk.z2j.api.model.IGrid;

public class Grid extends AbstractDoc implements IGrid {
	
	private List<List<String>> dims = new ArrayList<List<String>>();
	private Map<String, List<Integer>> dirs = new HashMap<String, List<Integer>>();
	
	private IBoard board;
	
	public Grid(IBoard board) {
		this.board = board;
	}

	private void addRange(String dim, int start, int end, boolean isNumeric, List<String> r) throws Exception {
		while (true) {
			StringBuffer sb = new StringBuffer();
			if (isNumeric) {
				sb.append(Integer.toString(start));
			} else {
				sb.append((char)(byte)start);
			}
			if (r.contains(sb.toString())) {
				throw new Exception("Invalid dimension [" + dim + "]");
			}
			r.add(sb.toString());
			if (start == end) break;
			if (start > end) {
				start--;
			} else {
				start++;
			}
		}
	}

	public void addDimension(String dim) throws Exception {
		StringBuffer sb = new StringBuffer();
		List<String> r = new ArrayList<String>();
		int start = 0;
		int current = -1;
		boolean isNumeric = false;
		for (Character c: dim.toCharArray()) {
			if (c.equals('-')) {
				if (isNumeric) {
					start = current;
				} else {
					if (sb.length() == 0) {
						throw new Exception("Invalid dimension [" + dim + "]");
					}
					start = (int)sb.toString().charAt(0);
				}
				current = -1;
				continue;
			}
			if (Character.isDigit(c)) {
				if (current > 0) {
					current *= 10;
				} else {
					current = 0;
				}
				current += (int)c - (int)'0'; 
				isNumeric = true;
				continue;
			}
			if (Character.isLetter(c) && (start > 0)) {
				current = (int)c;
			}
			if ((start > 0)&&(current >= 0)) {
				addRange(dim, start, current, isNumeric, r);
				isNumeric = false;
				start = 0;
				current = -1;
				sb.setLength(0);
				continue;
			}
			if (Character.isLetter(c)) {
				if (isNumeric) {
					throw new Exception("Invalid dimension [" + dim + "]");
				}
				if (start > 0) {
					addRange(dim, start, (int)c, false, r);
					start = 0;
					continue;
				}
				sb.append(c);
				continue;
			}
			if (sb.length() > 0) {
				if (isNumeric || r.contains(sb.toString())) {
					throw new Exception("Invalid dimension [" + dim + "]");
				}
				r.add(sb.toString());
				sb.setLength(0);
			}
			if (current >= 0) {
				if (!isNumeric || r.contains(Integer.toString(current))) {
					throw new Exception("Invalid dimension [" + dim + "]");
				}
				r.add(Integer.toString(current));
				current = -1;
			}
		}
		if ((start > 0)&&(current >= 0)) {
			if (!isNumeric) {
				throw new Exception("Invalid dimension [" + dim + "]");
			}
			addRange(dim, start, current, isNumeric, r);
			isNumeric = false;
			start = 0;
			current = -1;
		}
		if (sb.length() > 0) {
			if (isNumeric || r.contains(sb.toString())) {
				throw new Exception("Invalid dimension [" + dim + "]");
			}
			r.add(sb.toString());
			sb.setLength(0);
		}
		if (current >= 0) {
			if (!isNumeric || r.contains(Integer.toString(current))) {
				throw new Exception("Invalid dimension [" + dim + "]");
			}
			r.add(Integer.toString(current));
			current = 0;
			isNumeric = false;
		}
		dims.add(r);
	}

	public void addDirection(String name, List<Integer> deltas) throws Exception {
		if (dirs.containsKey(name)) {
			throw new Exception("Direction [" + name + "] already defined");
		}
		dirs.put(name, deltas);
	}
	
	private void extractPositions(int ix, StringBuffer sb) throws Exception {
		int sz = sb.length();
		if (ix >= dims.size()) {
			board.addPos(sb.toString());
			return;
		}
		List<String> d = dims.get(ix);
		if (d.isEmpty()) {
			throw new Exception("Dimension [" + Integer.toString(ix) + "] is empty");
		}
		for (String s: d) {
			sb.setLength(sz);
			sb.append(s);
			extractPositions(ix + 1, sb);
		}
	}
	
	private void extractLinks(int ix, String name, List<Integer> deltas, StringBuffer startPosition, StringBuffer endPosition) throws Exception {
		int stSz = startPosition.length();
		int enSz = endPosition.length();
		if (ix >= dims.size()) {
			if (board.isDefined(startPosition.toString()) && board.isDefined(endPosition.toString())) {
				board.addLink(name, startPosition.toString(), endPosition.toString());
			}
			return;
		}
		List<String> d = dims.get(ix);
		for (int i = 0; i < d.size(); i++) {
			startPosition.setLength(stSz);
			startPosition.append(d.get(i));
			endPosition.setLength(enSz);
			if (ix < deltas.size()) {
				int j = i + deltas.get(ix);
				if (j < 0) continue;
				if (j >= d.size()) continue;
				endPosition.append(d.get(j));
			} else {
				endPosition.append(d.get(0));
			}
			extractLinks(ix + 1, name, deltas, startPosition, endPosition);
		}
		
	}

	private void extract() throws Exception {
		extractPositions(0, new StringBuffer());
		for (String dir: dirs.keySet()) {
			List<Integer> deltas = dirs.get(dir);
			extractLinks(0, dir, deltas, new StringBuffer(), new StringBuffer());
		}
	}
}
