package com.gluk.z2j.loader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Result;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;
import org.xml.sax.helpers.AttributesImpl;

import com.gluk.z2j.api.loader.IParser;
import com.gluk.z2j.api.loader.IScaner;
import com.gluk.z2j.api.model.ILibrary;

public class Parser implements IParser {
	
	private final static String INCLUDE_CMD = "include";
	
	private final static String LIST_TAG = "l";
	private final static String ATOM_TAG = "a";
	
	private ILibrary lib = null;
	private String dir = "";
	
	private int deep = 0;
    private TransformerHandler handler = null;
    private Document doc = null;
    
    public Parser(ILibrary lib) {
    	this.lib = lib;
    }

    public Parser(TransformerHandler handler) {
    	this.handler = handler;
    }

	public void setDirectory(String dir) {
		this.dir = dir;
	}
	
	public void add(String s) throws Exception {
		handler.startElement("", ATOM_TAG, ATOM_TAG, new AttributesImpl());
		handler.characters(s.toCharArray(), 0, s.length());
		handler.endElement("", ATOM_TAG, ATOM_TAG);
	}

	public void open() throws Exception {
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
		handler.startElement("", LIST_TAG, LIST_TAG, new AttributesImpl());
		deep++;
	}

	public void close() throws Exception {
		if ((handler == null) || (deep <= 0)) {
			throw new Exception("Internal error");
		}
		handler.endElement("", LIST_TAG, LIST_TAG);
		deep--;
		if (deep == 0) {
			handler.endDocument();
			if (doc != null) {
				if (lib.getHead(doc).equals(INCLUDE_CMD)) {
					NodeIterator nl = lib.getTail(doc);
					Node n;
					while ((n = nl.nextNode())!= null) {
						include(n.getTextContent());
					}
				} else {
					lib.add(doc);
				}
			}
			handler = null;
			doc = null;
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
		Loader  loader = new Loader(scaner);
		loader.load(dir, s);
	}
}

