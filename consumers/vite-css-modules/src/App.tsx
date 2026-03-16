import { Separator } from './components/separator/Separator'
import styles from './App.module.css'

export default function App() {
  return (
    <main className={styles.appShell}>
      <h1>Arachne Consumer</h1>
      <Separator />
      <p className={styles.eyebrow}>Vite + CSS Modules fixture.</p>
    </main>
  )
}
