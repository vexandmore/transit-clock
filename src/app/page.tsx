import styles from './clock.module.css'
import ClockDisplay from './clock'
import Options from './options'
import Footer from './footer'
import './globals.css';

//import TransitDisplay from './transit'

export default function Home() {  
  return (
    <main className={styles.main}>
      <Options/>
      <ClockDisplay/>
      <Footer/>
    </main>
  )
}
