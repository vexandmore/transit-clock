import Image from 'next/image'
import styles from './page.module.css'
import ClockDisplay from './clock'

export default function Home() {
  return (
    <main className={styles.main}>
      <ClockDisplay/>
    </main>
  )
}
