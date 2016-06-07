<?xml version="1.0"?> 

<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="1.0">

  <xsl:output method="text" encoding="utf-8"/>

  <xsl:template match="/game">{
  "model": {
    "plazza": "true",
    "title-en": "<xsl:value-of select="title"/>",
    "module": "checkers",
    "maxLevel": 20,
    "summary": "<xsl:value-of select="description"/>",
    "thumbnail": "draughts-thumb3d.png",
    "rules": "rules-draughts.html",
    "description": "description.html",
    "credits": "credits.html",
    "js": [
      "zrf-model.js",
      "<xsl:value-of select="name"/>.js"
    ],
    "gameOptions": {
      "preventRepeat": true,
      "width": 5,
      "height": 10,
      "initial": {
        <xsl:call-template name="apply-setup"/>
      },
      "uctTransposition": "state"
    },
    "levels": [
      {
        "label": "Fast",
        "ai": "uct",
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "c": 0.5,
        "maxDuration": 1,
        "isDefault": true
      },
      {
        "label": "Beginner",
        "ai": "uct",
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "c": 0.5,
        "maxDuration": 0.5,
        "maxNodes": 100,
        "maxLoops": 200
      },
      {
        "label": "Easy",
        "ai": "uct",
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "c": 0.5,
        "maxDuration": 1,
        "maxNodes": 2500,
        "maxLoops": 500
      },
      {
        "label": "Medium",
        "ai": "uct",
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "c": 0.5,
        "maxDuration": 2,
        "maxNodes": 5500,
        "maxLoops": 500
      },
      {
        "label": "Hard",
        "ai": "uct",
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "c": 0.5,
        "maxDuration": 5,
        "maxNodes": 2000,
        "maxLoops": 3500
      },
      {
        "label": "Expert",
        "ai": "uct",
        "c": 0.8,
        "playoutDepth": 0,
        "minVisitsExpand": 1,
        "ignoreLeaf": false,
        "uncertaintyFactor": 5,
        "propagateMultiVisits": false,
        "maxDuration": 60,
        "maxNodes": 15000,
        "maxLoops": 8000
      }
    ],
    "name": "draughts",
    "title": "International Draughts",
    "strings": [],
    "excludeFromAds": false,
    "defaultLevel": 1,
    "path": "sites/all/modules/checkers",
    "fullPath": "http://embed.jocly.net/sites/all/modules/checkers",
    "$$hashKey": "object:67"
  },
  "view": {
    "js": [
      "checkers-xd-view.js",
      "draughts10-xd-view.js"
    ],
    "xdView": true,
    "css": [
      "checkersbase.css",
      "draughts.css"
    ],
    "title-en": "Draughts View",
    "skins": [
      {
        "name": "classic3d",
        "title": "3D Classic",
        "3d": true,
        "camera": {
          "radius": 24,
          "elevationAngle": 65,
          "limitCamMoves": true,
          "distMax": 30,
          "fov": 35
        },
        "world": {
          "lightIntensity": 1.1,
          "skyLightIntensity": 1.2,
          "lightPosition": {
            "x": -15,
            "y": 15,
            "z": 0
          },
          "lightShadowDarkness": 0.45,
          "ambientLightColor": 8947848,
          "color": 4686804,
          "fog": false
        },
        "preload": [
          "image|/res/images/wood-chipboard-5.jpg",
          "image|/res/xd-view/meshes/piecetop-bump.jpg",
          "image|/res/xd-view/meshes/piecediff.jpg",
          "image|/res/xd-view/meshes/piecetop-queen-mask.png",
          "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/piece-v2.js"
        ]
      },
      {
        "name": "turtles3d",
        "title": "3D Turtles",
        "3d": true,
        "camera": {
          "radius": 14,
          "elevationAngle": 45,
          "limitCamMoves": true,
          "distMax": 40
        },
        "world": {
          "lightIntensity": 1,
          "skyLightIntensity": 1,
          "fog": true,
          "color": 3645658,
          "lightPosition": {
            "x": -5,
            "y": 18,
            "z": 5
          },
          "lightShadowDarkness": 0.55,
          "ambientLightColor": 4473924
        },
        "preload": [
          "image|/res/images/wood-chipboard-5.jpg",
          "image|/res/xd-view/meshes/turtle.png",
          "image|/res/xd-view/meshes/star.png",
          "image|/res/xd-view/meshes/rock.jpg",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-legs-smoothed.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-head-smoothed.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-tail-smoothed.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-hotel.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-house.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/rainbowflat.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/rocksmoothed.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turtle-fences.js"
        ]
      },
      {
        "name": "classical",
        "title": "Classic"
      },
      {
        "name": "wood0",
        "title": "Wood"
      },
      {
        "name": "marble0",
        "title": "Marble"
      },
      {
        "name": "green",
        "title": "Green"
      }
    ],
    "module": "checkers",
    "preferredRatio": 1,
    "switchable": true,
    "animateSelfMoves": false,
    "useNotation": true,
    "useShowMoves": true,
    "useAutoComplete": true,
    "defaultOptions": {
      "sounds": true,
      "notation": false,
      "moves": true,
      "autocomplete": true
    },
    "sounds": {
      "move1": "move1",
      "move2": "move2",
      "move3": "move3",
      "move4": "move4",
      "tac1": "tac1",
      "tac2": "tac1",
      "tac3": "tac1",
      "promo": "promo",
      "usermove": null
    },
    "visuals": {
      "600x600": [
        "res/visuals/draughts-600x600-3d.jpg",
        "res/visuals/draughts-600x600-2d.jpg"
      ]
    },
    "title": "Draughts View",
    "model": [
      "draughts"
    ],
    "path": "sites/all/modules/checkers",
    "fullPath": "http://embed.jocly.net/sites/all/modules/checkers"
  }
}
</xsl:template>

<xsl:template name="apply-setup">
  <xsl:for-each select="board-setup/*">
        <xsl:choose>
            <xsl:when test="position() > 1">,
        </xsl:when>
        </xsl:choose>"<xsl:value-of select="name()"/>": {
            <xsl:call-template name="apply-setup-piece"/>
        }</xsl:for-each>
</xsl:template>

<xsl:template name="apply-setup-piece">
  <xsl:for-each select="*">
        <xsl:choose>
            <xsl:when test="position() > 1">,
        </xsl:when>
        </xsl:choose>"<xsl:value-of select="name()"/>": [<xsl:call-template name="apply-setup-pos"/>]</xsl:for-each>
</xsl:template>

<xsl:template name="apply-setup-pos">
  <xsl:for-each select="*">
        <xsl:choose>
            <xsl:when test="position() > 1">, </xsl:when>
        </xsl:choose>"<xsl:value-of select="text()"/>"</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
