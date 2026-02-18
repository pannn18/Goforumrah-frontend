import Default from '@/components/layout'
import { useDispatch, useSelector } from '@/store/store';
import { getFlightState, setDeparture } from '@/store/slices/flightSlice';

import React, { memo } from 'react'

/**
 * Just redux usage example
 */
const Test = () => {
  const dispatch = useDispatch();
  const { departure } = useSelector(getFlightState);

  const onClick = () => {
    dispatch(setDeparture({ ...departure, to: 'test' }));
  };

  return (
    <>
      <Default>
        <main>
          <div>
            Departure From {departure.from}
          </div>
          <div>
            Departure To {departure.to}
          </div>

          <button onClick={onClick}>test</button>
        </main>
      </Default>
    </>
  )
}

export default memo(Test)
