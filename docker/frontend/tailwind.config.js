/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /bg-.+/,
      variants: ["active", "hover"],
    },
    {
      pattern: /border-.+/,
      variants: ["active", "hover"],
    },
    {
      pattern: /outline-.+/,
      variants: ["active", "hover"],
    },
    {
      pattern: /text-.+/,
      variants: ["active", "hover"],
    },
    {
      pattern: /fill-.+/,
      variants: [
        "active",
        "hover",
        "[&_svg]",
        "[&_svg]:active",
        "[&_svg]:hover",
      ],
    },
    {
      pattern: /col-start-.+/,
    },
  ],
  theme: {
    extend: {},
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "8px",
      lg: "16px",
      full: "9999px",
    },
    colors: {
      transparent: "transparent",
      black: "#000000",
      white: "#FFFFFF",
      /* Theme color purple */
      purpleHeart: {
        50: '#f3f2ff',
        100: '#ebe8ff',
        200: '#d9d3ff',
        300: '#beb0ff',
        400: '#9e83ff',
        500: '#8052ff',
        600: '#702ef9',
        700: '#611ce5',
        800: '#5919d2',
        900: '#44159d',
        950: '#280a6b',
      },
      /* red */
      amaranth: {
        50: "#FFF0F2",
        100: "#FFE1E6",
        200: "#FFC8D2",
        300: "#FF9BAE",
        400: "#FF6385",
        500: "#FF2C5F",
        600: "#F6084B",
        700: "#E40046",
        800: "#AE033D",
        900: "#94073B",
        950: "#53001B",
      },
      /* yellow */
      goldenDream: {
        50: "#FCFBEA",
        100: "#F8F7C9",
        200: "#F1EB97",
        300: "#E9DB5B",
        400: "#E1C72C",
        500: "#D2B020",
        600: "#B58B19",
        700: "#906618",
        800: "#78511B",
        900: "#67441C",
        950: "#3C240C",
      },
      /* blue */
      pacificBlue: {
        50: "#EBFFFF",
        100: "#CDFCFF",
        200: "#A1F6FF",
        300: "#60EEFF",
        400: "#18DBF8",
        500: "#00BEDE",
        600: "#009EC3",
        700: "#087896",
        800: "#10607A",
        900: "#125067",
        950: "#053447",
      },
      /* green */
      limeade: {
        50: "#FBFFE5",
        100: "#F3FFC7",
        200: "#E7FF95",
        300: "#D4FE58",
        400: "#BFF526",
        500: "#A0DC06",
        600: "#71A100",
        700: "#5D8506",
        800: "#4B690B",
        900: "#3E580F",
        950: "#203201",
      },
      /* purple */
      plum: {
        50: "#FDF5FE",
        100: "#FCEAFD",
        200: "#F8D4FA",
        300: "#F4B3F3",
        400: "#ED85EC",
        500: "#DF56DD",
        600: "#C336BE",
        700: "#A12A9A",
        800: "#882581",
        900: "#6D2267",
        950: "#470B41",
      },
      /* Test */
      antiqueBrass: {
        50: "#FBF7F5",
        100: "#F7EDE9",
        200: "#F2DED6",
        300: "#E8C6B9",
        400: "#D8A591",
        500: "#C7866D",
        600: "#B16C51",
        700: "#945841",
        800: "#7B4B39",
        900: "#684234",
        950: "#372118",
      },
      /* Theme success */
      bilbao: {
        50: "#F3FAF3",
        100: "#E2F6E2",
        200: "#C7EBC8",
        300: "#9BDA9D",
        400: "#67C16A",
        500: "#42A545",
        600: "#2E7D31",
        700: "#2A6B2C",
        800: "#265528",
        900: "#204723",
        950: "#0D260F",
      },
      /* Theme danger */
      cinnabar: {
        50: "#FEF2F2",
        100: "#FFE2E1",
        200: "#FFC9C8",
        300: "#FFA4A2",
        400: "#FD6E6C",
        500: "#F5413E",
        600: "#E53835",
        700: "#BE1A17",
        800: "#9D1917",
        900: "#821C1A",
        950: "#470908",
      },
      /* Theme warning */
      lightningYellow: {
        50: "#FFFBEB",
        100: "#FEF3C7",
        200: "#FDE58A",
        300: "#FCD24D",
        400: "#FBC02D",
        500: "#F59C0B",
        600: "#D97506",
        700: "#B45209",
        800: "#923F0E",
        900: "#78340F",
        950: "#451A03",
      },
      /* Theme text */
      outerSpace: {
        50: "#F3F8F8",
        100: "#E1EAEC",
        200: "#C6D8DB",
        300: "#9EBCC2",
        400: "#6F97A1",
        500: "#547C86",
        600: "#486872",
        700: "#3F565F",
        800: "#394A51",
        900: "#334046",
        950: "#263238",
      },
      /* Theme sub text (light) */
      fuscousGray: {
        50: "#F6F6F6",
        100: "#E7E7E7",
        200: "#D1D1D1",
        300: "#B0B0B0",
        400: "#888888",
        500: "#6D6D6D",
        600: "#5D5D5D",
        700: "#4D4D4D",
        800: "#454545",
        900: "#3D3D3D",
        950: "#262626",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
