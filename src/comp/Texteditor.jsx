import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export const Texteditor = (props) => {
  useEffect(() => {
    // Function to handle the keydown event
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        props.closeEditor();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [props]);

  const [editorData, setEditorData] = useState({ title: props.note.title, content: props.note.content });
  const [isSaved, setIsSaved] = useState(true);

  const debouncedHandleEdit = useCallback(
    debounce((uid, title, content) => {
      props.handleEdit(uid, title, content);
    }, 500),
    [props]
  );

  const handleTitleForm = (event) => {
    const { value } = event.target;
    setEditorData((prev) => ({ ...prev, title: value }));
    setIsSaved(false);
    debouncedHandleEdit(props.note.id, value, editorData.content);
  };

  const handleContentForm = (event) => {
    const { value } = event.target;
    setEditorData((prev) => ({ ...prev, content: value }));
    setIsSaved(false);
    debouncedHandleEdit(props.note.id, editorData.title, value);
  };

  return (
    <div className="center">
      <div className='textEditorMainCont'>
        <img src="https://raw.githubusercontent.com/Flare-0/noteable/main/public/plusicon.svg" onClick={props.closeEditor} className='closeEditor' />

        <form action="">
          <input type="text" onChange={handleTitleForm} className='editorInputTitle' value={editorData.title} placeholder='Title' />
          <textarea type="text" onChange={handleContentForm} className='editorInputContent' value={editorData.content} placeholder='Write a note'> </textarea>
        </form>

      </div>
    </div>
  );
};
