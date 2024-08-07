import React from 'react';

export default function Notecard(props) {
  const handleDelete = () => {
    let userResponse = window.confirm("Do you want to proceed?");

    if (userResponse) {
      props.onDelete();
    }
  }

  return (
    <div className='notecardCont'>
      <p className='notecardTitle'>{props.title.length > 8 ? props.title.slice(0, 8) + '...' : props.title}</p>

      <p className='notecardContentTxt'>
        {props.content.length > 180 ? props.content.slice(0, 180) + '...' : props.content}
      </p>

      <div className="rightBottom">
        <div onClick={props.onclick} className="detBtn">
          <img src='https://raw.githubusercontent.com/Flare-0/noteable/main/public/pencil.svg' alt="Edit" />
        </div>
        <div onClick={handleDelete} className="detBtn">
          <img src='https://raw.githubusercontent.com/Flare-0/noteable/main/public/trashcan.svg' alt="Delete" />
        </div>
      </div>
    </div>
  );
}
