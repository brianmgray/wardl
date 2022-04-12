import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'

import { Constants } from "./constants";

/**
 * WhatsNew is a React component that renders public/whats-new.md as HTML
 * @returns 
 */
export function WhatsNew() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(Constants.CONTENT_WHATS_NEW)
      .then((response) => response.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div className="App-new">
      <ReactMarkdown children={content} />
    </div>
  );
  
}