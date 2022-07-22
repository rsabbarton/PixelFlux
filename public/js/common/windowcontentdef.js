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
  ]
}



const builtInColourPallets = {
  DEFAULT: [
    "rgb(248, 238, 229)",
    "rgb(243, 218, 204)",
    "rgb(235, 157, 134)",
    "rgb(255, 0, 0)",
    "rgb(118, 35, 2)",
    "rgb(71, 34, 3)",
    "rgb(246, 243, 232)",
    "rgb(235, 237, 213)",
    "rgb(192, 226, 151)",
    "rgb(43, 255, 0)",
    "rgb(50, 88, 2)",
    "rgb(41, 46, 3)",
    "rgb(242, 242, 240)",
    "rgb(225, 229, 233)",
    "rgb(169, 180, 224)",
    "rgb(0, 8, 255)",
    "rgb(18, 36, 71)",
    "rgb(20, 32, 26)",
    "rgb(246, 241, 247)",
    "rgb(242, 227, 247)",
    "rgb(233, 172, 245)",
    "rgb(255, 0, 247)",
    "rgb(102, 32, 89)",
    "rgb(54, 35, 39)",
    "rgb(249, 242, 245)",
    "rgb(249, 230, 233)",
    "rgb(248, 196, 184)",
    "rgb(255, 123, 0)",
    "rgb(87, 61, 3)",
    "rgb(44, 42, 4)",
    "rgb(249, 235, 221)",
    "rgb(249, 228, 197)",
    "rgb(251, 217, 131)",
    "rgb(255, 221, 0)",
    "rgb(87, 85, 3)",
    "rgb(44, 51, 4)"
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
  ]
}



