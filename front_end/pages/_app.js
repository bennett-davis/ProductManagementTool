import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import CustomNav from '../components/CustomNav';


function MyApp({ Component, pageProps }) {
  return ( 
    <>
      <CustomNav/>
      <Component {...pageProps} />
    </>
  )
  
            
        
}

export default MyApp
