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

import com.gluk.z2j.api.ILibrary;
import com.gluk.z2j.api.IParser;
import com.gluk.z2j.api.IScaner;

public class Parser implements IParser {
	
	private final static String INCLUDE_CMD = "include";
	
	private final static String LIST_TAG = "l";
	private final static String ATOM_TAG = "a";
	
	private ILibrary lib;
	
	private int deep = 0;
    private TransformerHandler handler = null;
    private Document doc = null;
    
    public Parser(ILibrary lib) {
    	this.lib = lib;
    }

	public void add(String s) throws Exception {
		handler.startElement("", ATOM_TAG, ATOM_TAG, new AttributesImpl());
		handler.characters(s.toCharArray(), 0, s.length());
		handler.endElement("", ATOM_TAG, ATOM_TAG);
	}

	public void open() throws Exception {
		if (deep == 0) {
			TransformerFactory tf = TransformerFactory.newInstance();
			if (tf.getFeature(SAXSource.FEATURE) && tf.getFeature(DOMResult.FEATURE)) {
				SAXTransformerFactory stf = (SAXTransformerFactory)tf;
				handler = stf.newTransformerHandler();
				DocumentBuilderFactory df = DocumentBuilderFactory.newInstance();
				doc = df.newDocumentBuilder().newDocument();
				Result out = new DOMResult(doc);
				handler.setResult(out);
				handler.startDocument();
			} else {
				throw new Exception("Feature unsupported");
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
			if (lib.getHead(doc).equals(INCLUDE_CMD)) {
				NodeIterator nl = lib.getTail(doc);
				Node n;
				while ((n = nl.nextNode())!= null) {
					include(n.getTextContent());
				}
			} else {
				lib.add(doc);
			}
			handler = null;
			doc = null;
		}
	}
	
	private void include(String s) throws Exception {
		IScaner scaner = new Scaner(this);
		Loader  loader = new Loader(scaner);
		loader.load(s);
	}
}

