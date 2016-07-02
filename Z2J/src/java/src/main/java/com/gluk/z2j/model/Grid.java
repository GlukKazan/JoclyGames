package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.model.IBoard;
import com.gluk.z2j.api.model.IGrid;

public class Grid extends AbstractDoc implements IGrid {
	
	private final static String DIM_XP = "/grid/dimensions/z2j-l/z2j-a";
	private final static String DIR_XP = "/grid/directions/*";
	private final static String ALL_XP = "z2j-a";

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
	
	private void extractPositions(int ix, Stack<String> stack) throws Exception {
		int sz = stack.size();
		if (ix < 0) {
			StringBuffer sb = new StringBuffer();
			for (int i = stack.size() - 1; i >= 0; i--) {
				sb.append(stack.get(i));
			}
			board.addPos(sb.toString());
			return;
		}
		List<String> d = dims.get(ix);
		if (d.isEmpty()) {
			throw new Exception("Dimension [" + Integer.toString(ix) + "] is empty");
		}
		for (String s: d) {
			while (stack.size() > sz) {
				stack.pop();
			}
			stack.add(s);
			extractPositions(ix - 1, stack);
		}
	}
	
	private void extractLinks(int ix, String name, List<Integer> deltas, StringBuffer startPosition, StringBuffer endPosition) throws Exception {
		int stSz = startPosition.length();
		int enSz = endPosition.length();
		if (ix >= dims.size()) {
			if ((board.getPosition(startPosition.toString()) >= 0) && (board.getPosition(endPosition.toString()) >= 0) ) {
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
	
	private void getDims() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, DIM_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			addDimension(n.getTextContent());
		}
	}
	
	private void getDirs() throws Exception {
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, DIR_XP);
		Node n;
		while ((n = nl.nextNode())!= null) {
			String name = n.getLocalName();
			List<Integer> deltas = new ArrayList<Integer>();
			NodeIterator ml = XPathAPI.selectNodeIterator(n, ALL_XP);
			Node m;
			while ((m = ml.nextNode())!= null) {
				String s = m.getTextContent();
				deltas.add(Integer.parseInt(s));
			}
			addDirection(name, deltas);
		}
	}

	public void extract() throws Exception {
		getDims();
		getDirs();
		extractPositions(dims.size() - 1, new Stack<String>());
		for (String dir: dirs.keySet()) {
			List<Integer> deltas = dirs.get(dir);
			extractLinks(0, dir, deltas, new StringBuffer(), new StringBuffer());
		}
	}
}
