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
	
	private final static String INCLUDE_CMD = "include";
	
	private final static String LIST_TAG = "l";
	private final static String ATOM_TAG = "a";
	
	private String dir = "";
	
	private int deep = 0;
    private TransformerHandler handler = null;
    private Document doc = null;
    
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
		if (isOpened) {
			isOpened = false;
			if (s.equals(INCLUDE_CMD)) {
				includeDeeps.push(deep);
				return;
			} else {
				handler.startElement("", LIST_TAG, LIST_TAG, new AttributesImpl());
				deep++;
			}
		}
		if (isIncludeScope()) {
			include(s);
			return;
		}
		handler.startElement("", ATOM_TAG, ATOM_TAG, new AttributesImpl());
		handler.characters(s.toCharArray(), 0, s.length());
		handler.endElement("", ATOM_TAG, ATOM_TAG);
	}

	public void open() throws Exception {
		if (isOpened) {
			handler.startElement("", LIST_TAG, LIST_TAG, new AttributesImpl());
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
		handler.endElement("", LIST_TAG, LIST_TAG);
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
				handler.endElement("", LIST_TAG, LIST_TAG);
			}
		}
		close();
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

