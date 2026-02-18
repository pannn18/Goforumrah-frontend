import React, {useEffect, useRef} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import styles from './index.module.scss'
import { CalendarOptions } from '@fullcalendar/core'

const OpenAndCloseRoomCalendar = (props: CalendarOptions & any) => {
  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    if (calendarRef.current) {
      // Get today's date
      const today = new Date()

      // set date to today date 
      calendarRef.current.getApi().select(today)
    }
  }, [])

  return (
    <>
      <div className={`${styles.wrapper} ${styles.openAndCloseRoom}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          unselectAuto={false}
          viewHeight={'auto'}
          height={'auto'}
          contentHeight={'auto'}
          fixedWeekCount={false}
          headerToolbar={{
            start: 'title',
            center: '',
            end: 'prev next',
          }}
          aspectRatio={1.75}
          viewClassNames={styles.view}
          dayHeaderClassNames={styles.dayHeader}
          dayCellClassNames={styles.dayCell}

          {...props}
        />
      </div>
    </>
  )
}

export default OpenAndCloseRoomCalendar

