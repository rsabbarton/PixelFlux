var colourPalletContent = "" +
    "<div class='flux-colourpickercontainer'>" +
    "<input type='color' class='flux-colourpicker' id='PRIMARYCOLOURPICKER' value='#ff0000'>" +
    "<div class='flux-label'>Primary</div> <div class='flux-clickable flux-inline' id='ADDPRIMARYCOLOUR' onclick='pixelFlux.objectClicked(\"ADDPRIMARYCOLOUR\")'> + </div>" +
    "</div>" +
    "<div class='flux-colourpickercontainer'>" +
    "<input type='color' class='flux-colourpicker' id='SECONDARYCOLOURPICKER' value='#00ff00'>" +
    "<div class='flux-label'>Secondary</div> <div class='flux-clickable flux-inline' id='ADDSECONDARYCOLOUR' onclick='pixelFlux.objectClicked(\"ADDSECONDARYCOLOUR\")'> + </div>" +
    "</div>" +
    "<div class='flux-slidercontainer'><input type='range' min='1' max='255' value='255' class='flux-slider' id='COLOUROPACITY'></div><div class='flux-label flux-opacitylabel'>Opacity</div>" +
    "<div id='COLOURPALLETSTORE'></div>" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" +
    "" 
    




const builtInWindowArrangements = {
  CLASSIC: [
    {
        "id": "WORKSPACE",
        "top": "32px",
        "left": "146px",
        "width": "600px",
        "height": "600px"
    },
    {
        "id": "COLOURPALLET",
        "top": "296px",
        "left": "749px",
        "width": "180px",
        "height": "284px"
    },
    {
        "id": "TOOLBAR",
        "top": "32px",
        "left": "1px",
        "width": "142px",
        "height": "600px"
    },
    {
        "id": "PREVIEW",
        "top": "32px",
        "left": "932px",
        "width": "180px",
        "height": "200px"
    },
    {
        "id": "ANIMATIONPREVIEW",
        "top": "32px",
        "left": "1115px",
        "width": "180px",
        "height": "200px"
    },
    {
    "id": "FRAMES",
    "top": "235px",
    "left": "1115px",
    "width": "181px",
    "height": "397px"    
    },
    {
    "id": "ANIMATIONTOOLS",
    "top": "585px",
    "left": "749px",
    "width": "180px",
    "height": "42px"
    },
    {
        "id": "TOOLOPTIONS",
        "top": "32px",
        "left": "749px",
        "width": "180px",
        "height": "260px"
    },
    {
        "id": "LAYERS",
        "top": "235px",
        "left": "932px",
        "width": "180px",
        "height": "396px"
    },
    {
        "id": "DEBUG",
        "top": "636px",
        "left": "4px",
        "width": "500px",
        "height": "120px"
    },
    {
        "id": "OPENGALLERY",
        "top": "200px",
        "left": "200px",
        "width": "800px",
        "height": "600px"
    }
  ],
  "WIDE": [
    {
        "id": "WORKSPACE",
        "top": "131px",
        "left": "5px",
        "width": "925px",
        "height": "537px"
    },
    {
        "id": "COLOURPALLET",
        "top": "533px",
        "left": "932px",
        "width": "180px",
        "height": "267px"
    },
    {
        "id": "TOOLBAR",
        "top": "33px",
        "left": "2px",
        "width": "1113px",
        "height": "96px"
    },
    {
        "id": "PREVIEW",
        "top": "131px",
        "left": "933px",
        "width": "180px",
        "height": "200px"
    },
    {
        "id": "ANIMATIONPREVIEW",
        "top": "32px",
        "left": "1115px",
        "width": "180px",
        "height": "200px"
    },
    {
        "id": "TOOLOPTIONS",
        "top": "333px",
        "left": "932px",
        "width": "181px",
        "height": "197px"
    },
    {
        "id": "DEBUG",
        "top": "671px",
        "left": "5px",
        "width": "510px",
        "height": "116px"
    },
    {
        "id": "OPENGALLERY",
        "top": "200px",
        "left": "200px",
        "width": "800px",
        "height": "600px"
    }
  ],
  TILECREATOR: [{"id":"WORKSPACE","top":"32px","left":"146px","width":"600px","height":"600px"},{"id":"COLOURPALLET","top":"296px","left":"749px","width":"180px","height":"284px"},{"id":"TOOLBAR","top":"32px","left":"1px","width":"142px","height":"600px"},{"id":"PREVIEW","top":"32px","left":"932px","width":"400px","height":"394px"},{"id":"ANIMATIONPREVIEW","top":"430px","left":"932px","width":"175px","height":"185px"},{"id":"ANIMATIONTOOLS","top":"585px","left":"749px","width":"180px","height":"42px"},{"id":"TOOLOPTIONS","top":"635px","left":"508px","width":"188px","height":"121px"},{"id":"LAYERS","top":"32px","left":"748px","width":"181px","height":"262px"},{"id":"FRAMES","top":"430px","left":"1112px","width":"171px","height":"319px"},{"id":"DEBUG","top":"636px","left":"4px","width":"500px","height":"120px"},{"id":"OPENGALLERY","top":"200px","left":"200px","width":"800px","height":"600px"}
  ]
}



const builtInColourPallets = {
  DEFAULT: [
    "rgb(248, 238, 229)","rgb(235, 157, 134)","rgb(255, 0, 0)","rgb(118, 35, 2)","rgb(71, 34, 3)","rgb(192, 226, 151)","rgb(43, 255, 0)","rgb(50, 88, 2)","rgb(41, 46, 3)","rgb(169, 180, 224)","rgb(0, 8, 255)","rgb(18, 36, 71)","rgb(233, 172, 245)","rgb(255, 0, 247)","rgb(102, 32, 89)","rgb(54, 35, 39)","rgb(248, 196, 184)","rgb(255, 123, 0)","rgb(249, 228, 197)","rgb(251, 217, 131)","rgb(255, 221, 0)","rgb(87, 85, 3)"
  ],
  WOODLANDJOURNEY: [
    "rgb(31, 36, 10)",
    "rgb(57, 87, 28)",
    "rgb(165, 140, 39)",
    "rgb(239, 172, 40)",
    "rgb(239, 216, 161)",
    "rgb(171, 92, 28)",
    "rgb(24, 63, 57)",
    "rgb(239, 105, 47)",
    "rgb(239, 183, 117)",
    "rgb(165, 98, 67)",
    "rgb(119, 52, 33)",
    "rgb(114, 65, 19)",
    "rgb(42, 29, 13)",
    "rgb(57, 42, 28)",
    "rgb(104, 76, 60)",
    "rgb(146, 126, 106)",
    "rgb(39, 100, 104)",
    "rgb(239, 58, 12)",
    "rgb(69, 35, 13)",
    "rgb(60, 159, 156)",
    "rgb(155, 26, 10)",
    "rgb(54, 23, 12)",
    "rgb(85, 15, 10)",
    "rgb(48, 15, 10)"
  ],
  PASTELDREAMS: [
    "rgb(171, 255, 221)","rgb(147, 219, 189)","rgb(146, 218, 188)","rgb(130, 194, 193)","rgb(114, 169, 182)","rgb(114, 170, 182)","rgb(91, 132, 154)","rgb(243, 208, 164)","rgb(242, 181, 145)","rgb(227, 170, 154)","rgb(208, 157, 157)","rgb(209, 157, 160)","rgb(184, 136, 158)","rgb(183, 136, 158)","rgb(86, 173, 140)","rgb(71, 137, 136)","rgb(255, 155, 145)","rgb(255, 107, 118)","rgb(255, 104, 116)","rgb(232, 94, 119)","rgb(196, 81, 126)","rgb(247, 157, 142)","rgb(225, 70, 213)","rgb(190, 58, 215)","rgb(187, 58, 217)","rgb(168, 54, 212)","rgb(134, 41, 208)","rgb(130, 41, 209)","rgb(255, 253, 134)","rgb(211, 211, 150)","rgb(208, 207, 160)","rgb(177, 178, 163)","rgb(149, 150, 172)","rgb(169, 194, 187)","rgb(150, 150, 171)","rgb(108, 118, 179)","rgb(80, 88, 159)","rgb(79, 86, 161)","rgb(250, 190, 9)","rgb(251, 172, 11)","rgb(237, 153, 27)","rgb(235, 151, 28)","rgb(199, 124, 62)","rgb(167, 103, 61)","rgb(255, 143, 55)","rgb(255, 125, 42)","rgb(255, 91, 20)","rgb(224, 77, 58)","rgb(192, 65, 78)"
  ],
  HIGHCONTRAST: [
    "rgb(185, 34, 0)","rgb(175, 69, 81)","rgb(197, 155, 250)","rgb(155, 110, 205)","rgb(171, 123, 81)","rgb(133, 88, 249)","rgb(148, 119, 163)","rgb(2, 1, 2)","rgb(52, 34, 14)","rgb(185, 125, 0)","rgb(87, 52, 196)","rgb(140, 231, 255)","rgb(159, 161, 156)","rgb(162, 161, 200)","rgb(148, 30, 0)","rgb(200, 133, 44)","rgb(120, 73, 136)","rgb(235, 191, 147)","rgb(201, 157, 136)","rgb(222, 180, 210)","rgb(70, 56, 123)","rgb(140, 98, 41)","rgb(228, 223, 229)","rgb(229, 213, 184)","rgb(234, 195, 97)","rgb(127, 92, 0)","rgb(27, 21, 53)","rgb(162, 167, 247)","rgb(98, 83, 62)","rgb(128, 106, 98)","rgb(17, 92, 6)","rgb(92, 58, 0)","rgb(136, 42, 36)","rgb(14, 76, 63)","rgb(194, 169, 72)","rgb(192, 192, 192)","rgb(182, 0, 0)","rgb(60, 94, 24)","rgb(220, 70, 57)","rgb(173, 67, 0)","rgb(164, 155, 109)","rgb(227, 181, 249)","rgb(130, 129, 244)","rgb(191, 126, 192)","rgb(58, 120, 253)","rgb(90, 46, 40)","rgb(30, 10, 89)","rgb(46, 164, 249)","rgb(23, 93, 245)","rgb(6, 34, 15)","rgb(95, 55, 231)","rgb(69, 40, 156)","rgb(165, 117, 123)","rgb(121, 137, 116)","rgb(166, 16, 45)","rgb(136, 78, 215)","rgb(98, 117, 84)","rgb(146, 189, 107)","rgb(243, 159, 1)","rgb(234, 186, 65)","rgb(219, 0, 52)","rgb(242, 155, 109)","rgb(201, 199, 149)","rgb(0, 164, 214)","rgb(91, 48, 75)","rgb(169, 119, 244)","rgb(92, 11, 8)","rgb(255, 115, 83)","rgb(238, 94, 118)","rgb(0, 185, 251)","rgb(24, 56, 105)","rgb(74, 112, 214)","rgb(208, 122, 101)","rgb(104, 98, 218)","rgb(34, 15, 146)","rgb(103, 0, 83)","rgb(165, 0, 149)","rgb(220, 0, 196)","rgb(59, 40, 57)","rgb(74, 96, 175)","rgb(130, 0, 2)","rgb(34, 11, 201)","rgb(15, 129, 0)","rgb(30, 105, 132)","rgb(203, 100, 39)","rgb(0, 171, 0)","rgb(139, 153, 0)","rgb(241, 153, 56)","rgb(239, 27, 0)","rgb(50, 125, 51)","rgb(74, 157, 180)","rgb(255, 222, 153)","rgb(170, 136, 34)","rgb(61, 87, 56)"
  ],
  CYBERPUNKNEON: ["rgb(0, 0, 0)","rgb(101, 167, 222)","rgb(102, 89, 81)","rgb(104, 210, 227)","rgb(108, 134, 195)","rgb(109, 105, 111)","rgb(11, 87, 145)","rgb(133, 165, 225)","rgb(140, 112, 196)","rgb(143, 102, 165)","rgb(152, 72, 169)","rgb(153, 22, 114)","rgb(159, 150, 191)","rgb(178, 106, 211)","rgb(197, 64, 195)","rgb(220, 120, 231)","rgb(24, 66, 108)","rgb(244, 159, 243)","rgb(27, 26, 52)","rgb(41, 107, 164)","rgb(42, 112, 195)","rgb(47, 75, 156)","rgb(55, 74, 126)","rgb(59, 37, 46)","rgb(64, 2, 55)","rgb(64, 60, 96)","rgb(71, 158, 209)","rgb(78, 128, 199)","rgb(81, 100, 162)","rgb(95, 57, 38)","rgb(97, 29, 106)","rgb(97, 73, 129)"
  ],
  DRAGONFIRE: ["rgb(100, 80, 98)","rgb(109, 73, 55)","rgb(117, 7, 0)","rgb(135, 106, 115)","rgb(142, 60, 25)","rgb(144, 99, 23)","rgb(145, 98, 55)","rgb(147, 29, 7)","rgb(164, 126, 146)","rgb(175, 68, 42)","rgb(175, 76, 3)","rgb(178, 132, 99)","rgb(178, 46, 12)","rgb(180, 102, 40)","rgb(20, 0, 2)","rgb(210, 162, 47)","rgb(225, 143, 93)","rgb(230, 141, 17)","rgb(236, 196, 78)","rgb(236, 90, 34)","rgb(236, 96, 3)","rgb(238, 186, 108)","rgb(245, 182, 45)","rgb(251, 238, 67)","rgb(253, 240, 117)","rgb(48, 35, 53)","rgb(53, 22, 22)","rgb(79, 60, 66)","rgb(83, 9, 8)","rgb(93, 40, 26)"
  ]
}



