import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f7fafc',
      100: '#edf2f7',
      500: '#718096',
      900: '#171923',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#1e1e1e',
        color: 'white',
      },
    },
  },
})

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
) 