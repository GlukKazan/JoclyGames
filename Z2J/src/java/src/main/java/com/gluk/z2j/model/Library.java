package com.gluk.z2j.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.z2j.api.loader.IDoc;
import com.gluk.z2j.api.loader.IEnvironment;
import com.gluk.z2j.api.model.ILibrary;

public class Library implements ILibrary {
	
	private final static String GAME_TAG    = "game";
	
	private final static String L_XP        = "l";
	private final static String ALL_XP      = "*";
	private final static String TAIL_XP     = "*[position() > 1]";
	private final static String BODY_XP     = "*[position() > 2]";
	private final static String TYPE_XP     = "a[1]";
	private final static String MACRO_XP    = "a[2]";
	private final static String DEF_XP      = "l/a[text() = 'default']";
	private final static String NAME_XP     = "l[a[1] = 'name']/a[2]";
	private final static String DEFINE_XP   = "/l/l[a[1]/text() = 'define']";
	private final static String GAME_XP     = "/l/l[a[1]/text() = 'game']";
	private final static String VAR_XP      = "/l/l[a[1]/text() = 'variant']";
	
	private Document root;
	private Map<String, Node> macro = new HashMap<String, Node>();
	
	public Library(Document root) throws Exception {
		this.root = root;
		parse();
	}
	
	private String getValue(Node doc, String xp) throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, xp);
		if ((n = nl.nextNode())!= null) {
			if (n.getNodeType() == Node.TEXT_NODE) {
				return n.getNodeValue();
			} else {
				return n.getTextContent();
			}
		}
		return "";
	}
	
	private void parse() throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(root, DEFINE_XP);
		while ((n = nl.nextNode())!= null) {
			String name = getValue(n, MACRO_XP);
			if (!name.isEmpty()) {
				macro.put(name, n);
			}
		}
	}
	
	public Node getGame() throws Exception {
		Node res = null;
		NodeIterator nl = XPathAPI.selectNodeIterator(root, GAME_XP);
		res = nl.nextNode();
		if (res == null) {
			throw new Exception("Game not found");
		}
		return res;
	}

	public Node getDefault() throws Exception {
		Node res = getGame();
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(root, VAR_XP);
		while ((n = nl.nextNode())!= null) {
			NodeIterator dl = XPathAPI.selectNodeIterator(n, DEF_XP);
			if (dl.nextNode() != null) {
				res = n;
			}
		}
		return res;
	}

	private boolean isCorrectName(String name) {
		int i = 0;
		for (Character c: name.toCharArray()) {
			i++;
			if (((c >= '0') && (c <= '9')) || (c == '-')) {
				if (i > 1) continue;
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
		String type = getValue(doc, TYPE_XP);
		Node m = macro.get(type);
		if (m != null) {
			Environment e = new Environment(env);
			NodeIterator nl = XPathAPI.selectNodeIterator(doc, TAIL_XP);
			while ((n = nl.nextNode())!= null) {
				if (n.getLocalName().equals(L_XP)) {
					throw new Exception("Syntax error");
				}
				String value = n.getTextContent();
				if (env != null) {
					value = env.getValue(value);
				}
				e.addValue(value);
			}
			nl = XPathAPI.selectNodeIterator(m, BODY_XP);
			while ((n = nl.nextNode())!= null) {
				extract(n, dest, e);
			}
		} else {
			String t = doc.getLocalName();
			if (t.equals(L_XP)) {
				String xp;
				if (isCorrectName(type)) {
					dest.open(type);
					xp = TAIL_XP;
				} else {
					dest.open(t);
					xp = ALL_XP;
				}
				NodeIterator nl = XPathAPI.selectNodeIterator(doc, xp);
				while ((n = nl.nextNode())!= null) {
					extract(n, dest, env);
				}
				dest.close();
			} else {
				String value = doc.getTextContent();
				if (env != null) {
					value = env.getValue(value);
				}
				if (isCorrectName(value)) {
					dest.open(value);
					dest.close();
				} else {
					dest.open(t);
					dest.add(value);
					dest.close();
				}
			}
		}
	}
	
	public void extract(IDoc dest, Node doc) throws Exception {
		Node n;
		NodeIterator nl = XPathAPI.selectNodeIterator(doc, L_XP);
		Set<String> nodes = new HashSet<String>();
		while ((n = nl.nextNode())!= null) {
			StringBuffer sb = new StringBuffer();
			sb.append(getValue(n, TYPE_XP));
			sb.append("@");
			sb.append(getValue(n, NAME_XP));
			nodes.add(sb.toString());
			extract(n, dest, null);
		}
		Node game = getGame();
		if (doc != game) {
			nl = XPathAPI.selectNodeIterator(game, L_XP);
			while ((n = nl.nextNode())!= null) {
				StringBuffer sb = new StringBuffer();
				sb.append(getValue(n, TYPE_XP));
				sb.append("@");
				sb.append(getValue(n, NAME_XP));
				if (!nodes.contains(sb.toString())) {
					extract(n, dest, null);
				}
			}
		}
	}

	public void extract(IDoc dest) throws Exception {
		dest.open(GAME_TAG);
		extract(dest, getDefault());
		dest.close();
	}
}
