import React from 'react';
import Markdown from 'react-markdown'
export default function Notecard(props) {
  return (
    <div onClick={props.onclick} className='notecardCont'>

      <p className='notecardTitle'>{props.title.length > 8 ? props.title.slice(0, 8) + '...' : props.title}</p>

        <Markdown className='notecardContentTxt' >
        {props.content.length > 180 ? props.content.slice(0, 180) + '...' : props.content}
        </Markdown>
    

      <div className="rightBottom">
        <div onDoubleClick={props.onDelete} className="detBtn">
          <img src='/public/trashcan.svg' alt="Delete" />
        </div>
      </div>

    </div>
  );
}
