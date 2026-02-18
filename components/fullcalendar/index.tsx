import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import styles from './index.module.scss'


const CustomFullCalendar = ({events, handleDatesSet, handleSelect}) => {
  
  
  return (
    <>
      <div className={styles.wrapper}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          unselectAuto={false}
          select={({ start, end, view }) => {
            handleSelect(start)
          }}
          viewHeight={'auto'}
          height={'auto'}
          contentHeight={'auto'}
          fixedWeekCount={false}
          headerToolbar={{
            start: 'prev',
            center: 'title',
            end: 'next',
          }}
          aspectRatio={1.75}
          viewClassNames={styles.view}
          dayHeaderClassNames={styles.dayHeader}
          dayCellClassNames={styles.dayCell}
          events={events}
          datesSet={handleDatesSet}
          // eventSources={[
          //   {
          //     events: [
          //       {
          //         title: '1',
          //         date: '2023-06-23',
          //         className: 'fc-custom-event-counter'
          //       },
          //       {
          //         title: '2',
          //         date: '2023-06-21',
          //         className: 'fc-custom-event-counter'
          //       },
          //       {
          //         title: '4',
          //         date: '2023-07-15',
          //         className: 'fc-custom-event-counter'
          //       },
          //       {
          //         title: '1',
          //         date: '2023-07-18',
          //         className: 'fc-custom-event-counter'
          //       }
          //     ]
          //   }
          // ]}
        />
      </div>
    </>
  )
}

export default CustomFullCalendar

