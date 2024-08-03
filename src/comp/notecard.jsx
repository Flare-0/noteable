import React from 'react'

export default function Notecard(props) {
  return (
    <div className='notecardCont'> 
    
    <p className='notecardTitle'>{props.title}</p>
    <p className='notecardContentTxt' >{props.content}</p>
    
    </div>
  )
}
