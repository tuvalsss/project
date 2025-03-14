import { extendTheme } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const theme = extendTheme({
  styles: {
    global: {
      html: {
        fontSize: "16px",
      },
      body: {
        fontSize: "0.875rem",
        margin: 0,
        padding: 0,
      },
      ".main-link": {
        color: "ui.main",
        fontWeight: "bold",
      },
    },
  },
  colors: {
    ui: {
      main: "#009688",
    },
  },
  components: {
    Button: buttonRecipe,
  },
})
