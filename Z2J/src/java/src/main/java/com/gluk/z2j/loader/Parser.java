package com.gluk.z2j.loader;

import java.util.Stack;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Result;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;

import org.w3c.dom.Document;
import org.xml.sax.helpers.AttributesImpl;

import com.gluk.z2j.api.loader.IParser;
import com.gluk.z2j.api.loader.IScaner;

public class Parser implements IParser {
	
	private final static String  Z2J_VERSION = "1";

	private final static String GAME_CMD    = "game";
	private final static String INCLUDE_CMD = "include";
	private final static String VERSION_CMD = "version";
	
	private final static String Z2J_VER     = "z2j";
	private final static String ZRF_VER     = "zrf";
	
	private final static String L_TAG = "z2j-l";
	private final static String A_TAG = "z2j-a";
	
	private String dir = "";
	
	private int deep = 0;
    private TransformerHandler handler = null;
    private Document doc = null;
    private boolean isVersionScope = false;
    private String zrfVersion = "";
    
    private boolean isOpened = false;
    private Stack<Integer> includeDeeps = new Stack<Integer>();
    
    public Parser() {}
    
    public Parser(TransformerHandler handler) {
    	this.handler = handler;
    }

	public void setDirectory(String dir) {
		this.dir = dir;
	}
	
	private boolean isIncludeScope() {
		if (includeDeeps.isEmpty()) {
			return false;
		}
		return includeDeeps.peek() == deep;
	}
	
	public void add(String s) throws Exception {
		boolean f = true;
		if (isOpened) {
			isOpened = false;
			if (s.equals(INCLUDE_CMD)) {
				includeDeeps.push(deep);
				return;
			} else {
				handler.startElement("", L_TAG, L_TAG, new AttributesImpl());
				deep++;
				if (s.equals(VERSION_CMD)) {
					isVersionScope = true;
					f = false;
				}
			}
		}
		if (f && isVersionScope) {
			zrfVersion = s;
			isVersionScope = false;
			return;
		}
		if (isIncludeScope()) {
			include(s);
			return;
		}
		handler.startElement("", A_TAG, A_TAG, new AttributesImpl());
		handler.characters(s.toCharArray(), 0, s.length());
		handler.endElement("", A_TAG, A_TAG);
		if (s.equals(GAME_CMD)) {
			saveOption(Z2J_VER, Z2J_VERSION);
			if (!zrfVersion.isEmpty()) {
				saveOption(ZRF_VER, zrfVersion);
			}
		}
	}

	public void open() throws Exception {
		if (isOpened) {
			handler.startElement("", L_TAG, L_TAG, new AttributesImpl());
			deep++;
		}
		if (deep == 0) {
			if (handler == null) {
				TransformerFactory tf = TransformerFactory.newInstance();
				if (tf.getFeature(SAXSource.FEATURE) && tf.getFeature(DOMResult.FEATURE)) {
					SAXTransformerFactory stf = (SAXTransformerFactory)tf;
					handler = stf.newTransformerHandler();
					DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
					doc = df.newDocumentBuilder().newDocument();
					Result out = new DOMResult(doc);
					handler.setResult(out);
				} else {
					throw new Exception("Feature unsupported");
				}
				handler.startDocument();
			}
		}
		isOpened = true;
	}

	public void close() throws Exception {
		if (isOpened) {
			throw new Exception("Syntax error");
		}
		if (isIncludeScope()) {
			includeDeeps.pop();
			return;
		}
		if ((handler == null) || (deep <= 0)) {
			throw new Exception("Internal error");
		}
		handler.endElement("", L_TAG, L_TAG);
		deep--;
		if (deep == 0) {
			handler.endDocument();
			handler = null;
		}
	}
	
	public void close(boolean isForced) throws Exception {
		if (isForced) {
			while (deep > 1) {
				deep--;
				handler.endElement("", L_TAG, L_TAG);
			}
		}
		close();
	}
	
	private void saveOption(String name, String value) throws Exception {
		String option = "option";
		handler.startElement("", L_TAG, L_TAG, new AttributesImpl());
		handler.startElement("", A_TAG, A_TAG, new AttributesImpl());
		handler.characters(option.toCharArray(), 0, option.length());
		handler.endElement("", A_TAG, A_TAG);
		handler.startElement("", A_TAG, A_TAG, new AttributesImpl());
		handler.characters(name.toCharArray(), 0, name.length());
		handler.endElement("", A_TAG, A_TAG);
		handler.startElement("", A_TAG, A_TAG, new AttributesImpl());
		handler.characters(value.toCharArray(), 0, value.length());
		handler.endElement("", A_TAG, A_TAG);
		handler.endElement("", L_TAG, L_TAG);
	}
	
	private void include(String s) throws Exception {
		IScaner scaner = new Scaner(this);
		Loader  loader = new Loader(scaner, false);
		loader.load(dir, s);
	}

	public Document getDoc() throws Exception {
		if (doc == null) {
			throw new Exception("Internal error");
		}
		return doc;
	}
}

