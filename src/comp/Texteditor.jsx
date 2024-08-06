import React, { useEffect, useState } from 'react'

export const Texteditor = (props) => {

  useEffect(() => {
    // Function to handle the keydown event
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        props.closeEditor()
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const [editorData, setEditorData] = useState({ title: props.note.title, content: props.note.content })
  const [isSaved,setIsSaved] = useState(true)
  const handleTitleForm = (event) => {
    const { value } = event.target;
    setEditorData((prev) => ({ ...prev, title: value }));
    setIsSaved(false)
  };

  const handleContentForm = (event) => {
    const { value } = event.target;
    setEditorData((prev) => ({ ...prev, content: value }));
    setIsSaved(false)
  };

  return (
    <div className="center">
      <div className='textEditorMainCont'>
        <img src="/public/plusicon.svg" onClick={props.closeEditor} className='closeEditor' />

        <form action="">
          <input type="text" onChange={handleTitleForm} className='editorInputTitle' value={editorData.title} placeholder='Title' />
          <textarea type="text" className='editorInputContent' value={editorData.content} placeholder='Write a note'> </textarea>
        </form>

      </div>
    </div>
  )
}
