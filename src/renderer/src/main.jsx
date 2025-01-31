import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'

import 'rsuite/dist/rsuite.min.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from '../../Services/Redux/store'
import { HashRouter } from 'react-router-dom'
import { ActiveTabContextProvider } from './Context/ActiveTabContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ActiveTabContextProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ActiveTabContextProvider>
  </Provider>
)
