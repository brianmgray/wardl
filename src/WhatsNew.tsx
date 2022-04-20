import { useEffect, useState } from "react";
// import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import { DateTime } from "luxon";

import { Constants } from "./constants";


interface WhatsNewProps {
    contentLoadedCallback: (contentUpdated: DateTime) => void
}

/**
 * WhatsNew is a React component that renders public/whats-new.md as HTML
 * @returns 
 */
export function WhatsNew(props: WhatsNewProps) {
  let {contentLoadedCallback} = props;
  const [content, setContent] = useState("");

  useEffect(() => {
    const loaded = DateTime.now().setZone('Etc/GMT');
    fetch(Constants.CONTENT_WHATS_NEW)
      .then(response => response.text())
      .then(text => setContent(text))
      .then(() => contentLoadedCallback(loaded));
      // need to pass an empty array for dependencies so this method is only called on load
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="New-container">
      <ReactMarkdown children={content} />
    </div>
  );
  
}