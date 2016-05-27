package com.gluk.z2j.loader;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

import com.gluk.z2j.api.loader.ILoader;
import com.gluk.z2j.api.loader.IScaner;

public class Loader implements ILoader {
	
	private final static char CR_CHAR = (char)0x0D;

	private IScaner scaner;
	
	public Loader(IScaner scaner) {
		this.scaner = scaner;
	}
	
	public void load(String dir, String name) throws Exception {
        BufferedReader reader = null;
        try {
        	StringBuffer sb = new StringBuffer();
        	sb.append(dir);
        	sb.append("/");
        	sb.append(name);
            reader = new BufferedReader(
                        new InputStreamReader(
                            new FileInputStream(sb.toString()), Charset.forName("WINDOWS-1251")));
            String line;
            scaner.open();
            while ((line = reader.readLine()) != null) {
            	for (Character c: line.toCharArray()) {
            		scaner.scan(c);
            	}
            	scaner.scan(CR_CHAR);
            }
            scaner.close();
        } catch (IOException e) {
            throw new Exception(e.toString(), e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    throw new Exception(e.toString(), e);
                }
            }
        }
	}
}
