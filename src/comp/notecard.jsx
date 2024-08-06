import React from 'react';

export default function Notecard(props) {
  return (
    <div onClick={props.onclick} className='notecardCont'>

      <p className='notecardTitle'>{props.title}</p>
      <p className='notecardContentTxt'>
        {props.content.length > 180 ? props.content.slice(0, 180) + '...' : props.content}
      </p>

      <div className="rightBottom">
        <div onDoubleClick={props.onDelete} className="detBtn">
          <img src='/public/trashcan.svg' alt="Delete" />
        </div>
      </div>

    </div>
  );
}
