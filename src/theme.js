import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#f0e4ff",
      100: "#cbb2ff",
      200: "#a480ff",
      300: "#7c4dff",
      400: "#541bff",
      500: "#3b01e6",
      600: "#2e00b4",
      700: "#210082",
      800: "#140051",
      900: "#070021",
    },
    skill: {
      arcane: {
        base: "#c18cff",
        dark: "#2f2044",
      },
      willpower: {
        base: "#ff2e2e",
        dark: "#3a1010",
      },
      spirit: {
        base: "#8fe8ff",
        dark: "#1e3a44",
      },
      presence: {
        base: "#ffec88",
        dark: "#5e5023",
      },
      strength: {
        base: "#66ffff",
        dark: "#1a4f4f",
      },
      dexterity: {
        base: "#ff6b6b",
        dark: "#4d1e1e",
      },
      constitution: {
        base: "#5f8dff",
        dark: "#1a2a66",
      },
      intelligence: {
        base: "#5cf87b",
        dark: "#1d4c29",
      },
      wisdom: {
        base: "#ffd94a",
        dark: "#665b23",
      },
      charisma: {
        base: "#ffb566",
        dark: "#4c2f1a",
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: "gray.900",
        color: "white",
        backgroundImage:
          props.colorMode === "dark"
            ? "radial-gradient(circle at center, rgba(20, 0, 81, 0.15) 0%, rgba(7, 0, 33, 0.15) 100%)"
            : "none",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        gaming: {
          bg: "brand.500",
          color: "white",
          borderRadius: "md",
          transition: "all 0.2s",
          _hover: {
            bg: "brand.400",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
          _active: {
            bg: "brand.600",
            transform: "translateY(0)",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          bg: "blackAlpha.700",
          backdropFilter: "blur(8px)",
        },
        dialog: {
          bg: "gray.800",
          borderRadius: "xl",
          borderWidth: "1px",
          borderColor: "brand.500",
          boxShadow: "0 0 20px rgba(124, 77, 255, 0.2)",
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "gray.800",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: "whiteAlpha.200",
          transition: "all 0.2s",
          _hover: {
            borderColor: "brand.500",
            boxShadow: "0 0 15px rgba(124, 77, 255, 0.1)",
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: "whiteAlpha.100",
        },
        filledTrack: {
          transition: "all 0.4s",
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "md",
        px: 2,
        py: 1,
      },
      variants: {
        skill: {
          bg: "brand.500",
          color: "white",
          borderWidth: "1px",
          borderColor: "brand.400",
          boxShadow: "0 0 10px rgba(124, 77, 255, 0.2)",
        },
      },
    },
  },
});

export default theme;
