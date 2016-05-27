package com.gluk.z2j.loader;

import com.gluk.z2j.api.loader.IParser;
import com.gluk.z2j.api.loader.IScaner;

public class Scaner implements IScaner {
	
	private final static char CR_CHAR      = (char)0x0D;
	private final static char LF_CHAR      = (char)0x0A;
	private final static char TAB_CHAR     = (char)0x09;

	private IParser parser;
	
	private StringBuffer token  = new StringBuffer();
	private boolean isCommented = false;
	private boolean   isLiteral = false;
	private boolean   isEscaped = false;
	
	public Scaner(IParser parser) {
		this.parser = parser;
	}
	
	public void setDirectory(String dir) {
		parser.setDirectory(dir);
	}
	
	private void flush() throws Exception {
		if (token.length() > 0) {
			parser.add(token.toString());
			token.setLength(0);
		}
	}

	public void scan(char c) throws Exception {
		if (isCommented) {
			switch (c) {
				case CR_CHAR:
				case LF_CHAR:
					isCommented = false;
			}
			return;
		}
		if (isLiteral) {
			if (!isEscaped && (c == '\"')) {
				flush();
				isLiteral = false;
			} else {
				token.append(c);
			}
			return;
		}
		switch (c) {
			case '\\':
				if (isEscaped) {
					token.append(c);
				} else {
					isEscaped = true;
					return;
				}
				break;
			case  ' ': 
			case  CR_CHAR:
			case  LF_CHAR:
			case TAB_CHAR:
				flush();
				break;
			case  ';':
				flush();
				isCommented = true;
				break;
			case '\"':
				flush();
				isLiteral = true;
				break;
			case  '(':
				flush();
				parser.open();
				break;
			case  ')':
				flush();
				parser.close();
				break;
			default: 
				token.append(c);
		}
		isEscaped = false;
	}

	public void open() throws Exception {
		parser.open();
	}

	public void close() throws Exception {
		parser.close(true);
	}
}
