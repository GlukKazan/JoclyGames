package com.gluk.z2j.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.loader.IEnvironment;
import com.gluk.z2j.api.model.ILibrary;

public class Library extends XpeFactory implements ILibrary {
	
	private final static String DEFINE_TAG  = "define";
	private final static String GAME_TAG    = "game";
	private final static String VAR_TAG     = "variant";
	private final static String L_TAG       = "l";
	private final static String A_TAG       = "a";
	
	private final static String DEF_XP      = "/l/a[text() = 'default']";
	private final static String HEAD_XP     = "/l/a[1]";
	private final static String NAME_XP     = "/l/a[2]";
	private final static String TAIL_XP     = "/l/*[position() > 1]";
	private final static String MACRO_XP    = "/l/*[position() > 2]";
	private final static String NM_XP       = "l[a/text() = \'name\']";

	Map<String, Node> macro = new HashMap<String, Node>();
	List<Node> games = new ArrayList<Node>();
	
	public String getHead(Node doc) throws Exception {
		return getXpe(HEAD_XP).evaluate(doc);
	}
	
	private String getName(Node doc) throws Exception {
		return getXpe(NAME_XP).evaluate(doc);
	}
	
	public NodeIterator getTail(Node doc) throws Exception {
		return XPathAPI.selectNodeIterator(doc, TAIL_XP);
	}

	public void add(Node doc) throws Exception {
		String t = getHead(doc); 
		if (t.equals(DEFINE_TAG)) {
			macro.put(getName(doc), doc);
			return;
		}
		if (t.equals(GAME_TAG) || t.equals(VAR_TAG)) {
			games.add(doc);
		}
	}

	public Node getDefault() throws Exception {
		for (Node r: games) {
			NodeIterator nl = XPathAPI.selectNodeIterator(r, DEF_XP);
			if (nl.nextNode() !=  null) {
				return r;
			}
		}
		if (games.size() > 0) {
			return games.get(0);
		}
		throw new Exception("Game not found");
	}

	public Node getGame() throws Exception {
		for (Node r: games) {
			String h = getHead(r);
			if (h.equals(GAME_TAG)) {
				return r;
			}
		}
		throw new Exception("Game not found");
	}
	
	private String getSign(Node doc) throws Exception {
		Node n;
		StringBuffer sb = new StringBuffer();
		sb.append(getHead(doc));
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, NM_XP);
		if ((n = nl.nextNode())!= null) {
			sb.append("/");
			sb.append(getName(n));
		}
		return sb.toString();
	}
	
	private boolean isCorrectName(String name) {
		int i = 0;
		for (Character c: name.toCharArray()) {
			i++;
			if (((c >= '0') && (c <= '9')) || (c == '-')) {
				if (i == 1) continue;
			}
			if ((c >= 'a') && (c <= 'z')) continue;
			if ((c >= 'A') && (c <= 'Z')) continue;
			if (c == '_') continue;
			return false;
		}
		return true;
	}

	public void extract(Node doc, IDoc dest, IEnvironment env) throws Exception {
		Node n;
		NodeIterator nl;
		String h = getHead(doc);
		Node m = macro.get(h);
		if (m != null) {
			Environment e = new Environment(env);
			nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
			while ((n = nl.nextNode())!= null) {
				if (n.getLocalName().equals("l")) {
					throw new Exception("Syntax error");
				}
				String s = n.getTextContent();
				e.addValue(env.getValue(s));
			}
			extract(m, dest, e);
			return;
		}
		if (h.equals(DEFINE_TAG)) {
			nl = XPathAPI.selectNodeIterator(doc, MACRO_XP);
		} else {
			nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
			if (isCorrectName(h)) {
				dest.open(h);
			} else {
				dest.open(L_TAG);
				dest.open(A_TAG); dest.add(h); dest.close();
			}
		}
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName(); 
			if (t.equals("l")) {
				extract(n, dest, env);
			} else {
				String s = n.getTextContent();
				dest.add(env.getValue(s));
			}
		}
		if (!h.equals(DEFINE_TAG)) {
			dest.close();
		}
	}
	
	public void extract(IDoc dest, Node doc) throws Exception {
		Node n;
		Set<String> nodes = new HashSet<String>();
		String h = getHead(doc);
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
		while ((n = nl.nextNode())!= null) {
			String t = n.getLocalName(); 
			if (!t.equals("l")) {
				throw new Exception("Syntax error");
			}
			String sign = getSign(n);
			nodes.add(sign);
			extract(n, dest, null);
		}
		if (h.equals(VAR_TAG)) {
			Node game = getGame();
			nl = XPathAPI.selectNodeIterator(game, TAIL_XP);
			while ((n = nl.nextNode())!= null) {
				String t = n.getLocalName();
				if (!t.equals("l")) {
					throw new Exception("Syntax error");
				}
				String sign = getSign(n);
				if (!nodes.contains(sign)) {
					extract(n, dest, null);
				}
			}
		}
	}

	public void extract(IDoc dest) throws Exception {
		extract(dest, getDefault());
	}
}