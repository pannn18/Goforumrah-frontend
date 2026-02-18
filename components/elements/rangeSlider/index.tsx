import React from 'react'
import { SliderProps } from 'react-compound-slider/dist/types/Slider';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./components";

const sliderStyle = {
  position: 'relative' as 'relative',
  width: '100%',
  height: '20px'
}

const RangeSlider = (props: SliderProps) => {
  const domain: number[] = Array.from(props.domain)

  return (
    <>
      <Slider {...({ ...props, rootStyle: sliderStyle })}>
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </>
  )
}

export default RangeSlider