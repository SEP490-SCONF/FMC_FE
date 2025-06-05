import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css/animate.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'jquery-ui-dist/jquery-ui.min.css'
import 'magnific-popup/dist/magnific-popup.css'
import 'odometer/themes/odometer-theme-default.css'
import 'select2/dist/css/select2.min.css'
import 'splitting/dist/splitting.css'
import 'swiper/css';


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
