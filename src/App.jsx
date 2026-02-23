import { ScheduleProvider } from './context/ScheduleContext'
import ScheduleApp from './components/ScheduleApp'

function App() {
  return (
    <ScheduleProvider>
      <ScheduleApp />
    </ScheduleProvider>
  )
}

export default App
