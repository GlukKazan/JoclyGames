package com.gluk.z2j.app;
import java.io.File;

import org.apache.log4j.Logger;

import com.gluk.z2j.api.loader.ILoader;
import com.gluk.z2j.api.loader.IParser;
import com.gluk.z2j.api.loader.IScaner;
import com.gluk.z2j.api.model.ILibrary;
import com.gluk.z2j.loader.Loader;
import com.gluk.z2j.loader.Parser;
import com.gluk.z2j.loader.Scaner;
import com.gluk.z2j.model.Game;
import com.gluk.z2j.model.Library;

public class App {
	
    private static final Logger LOGGER = Logger.getLogger(App.class);

    private static void exec(String dir, String name) {
		int ix = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
		if (ix >= 0) {
			if ((ix == 0) || (name.charAt(0) == '/') || (name.charAt(0) == '\\') || (name.charAt(1) == ':')) {
				dir = name.substring(0, ix);
			}
			name = name.substring(ix + 1);
		}
		ILibrary   lib = new Library();
		IParser parser = new Parser(lib);
		IScaner scaner = new Scaner(parser);
		ILoader loader = new Loader(scaner);
		try {
			loader.load(dir, name);
			Game game = new Game();
			lib.extract(game);
			Serializer out = new Serializer(dir, name);
			game.extract(out);
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
		}
	}

	public static void main(String[] args) {
		String dir = new File(".").getAbsolutePath();
		for (String name: args) {
			exec(dir, name);
		}
	}
}