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
    "thumbnail": "turkish-thumb3d.png",
    "rules": "rules-turkish-draughts.html",
    "description": "description.html",
    "credits": "credits-turkish-draughts.html",
    "js": [
      "zrf-model.js",
      "<xsl:value-of select="name"/>.js"
    ],
    "gameOptions": {
      "preventRepeat": true,
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
    "name": "turkish-draughts",
    "title": "Turkish Draughts",
    "strings": [],
    "excludeFromAds": false,
    "defaultLevel": 1,
    "path": "sites/all/modules/checkers",
    "fullPath": "http://embed.jocly.net/sites/all/modules/checkers",
    "$$hashKey": "object:114"
  },
  "view": {
    "js": [
      "checkers-xd-view.js",
      "turkish-xd-view.js"
    ],
    "visuals": {
      "600x600": [
        "res/visuals/turkish-draughts-600x600-3d.jpg",
        "res/visuals/turkish-draughts-600x600-2d.jpg"
      ]
    },
    "xdView": true,
    "css": [
      "checkersbase.css",
      "turkish.css"
    ],
    "title-en": "Turkish Draughts View",
    "module": "checkers",
    "preferredRatio": 1,
    "skins": [
      {
        "name": "turkish3d",
        "title": "3D Classic",
        "3d": true,
        "camera": {
          "radius": 14,
          "elevationAngle": 45,
          "limitCamMoves": true
        },
        "world": {
          "lightIntensity": 0.8,
          "color": 0,
          "fog": false,
          "lightPosition": {
            "x": -10,
            "y": 18,
            "z": 0
          },
          "ambientLightColor": 0
        },
        "preload": [
          "image|/res/images/wood-chipboard-5.jpg",
          "smoothedfilegeo|0|/res/xd-view/meshes/ring-target.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turkish.js",
          "smoothedfilegeo|0|/res/xd-view/meshes/turkish-queen.js"
        ]
      },
      {
        "name": "green",
        "title": "Green"
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
        "name": "classical",
        "title": "Classic"
      }
    ],
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
    "switchable": true,
    "animateSelfMoves": false,
    "useNotation": true,
    "useShowMoves": true,
    "defaultOptions": {
      "sounds": true,
      "notation": false,
      "moves": true
    },
    "title": "Turkish Draughts View",
    "model": [
      "turkish-draughts"
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
