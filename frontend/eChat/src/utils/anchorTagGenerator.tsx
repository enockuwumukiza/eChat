import React from 'react';


// Enhanced regex to detect a URL or domain-like structure
const isLink = (message: string): boolean => {
  const urlPattern = /^(https?:\/\/|www\.)[^\s]+$/i;  // Matches 'http://', 'https://', or 'www.'
  const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;  // Matches domains like 'example.com'
  
  return urlPattern.test(message) || domainPattern.test(message);
};

const generateAnchorTag = (message: string): React.ReactNode => {

  if (isLink(message)) {
    let link = message;
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      if (link.startsWith('www.')) {
        link = 'http://' + link; 
      } else {
        link = 'http://' + link;  
      }
    }

    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 visited:text-purple-600 text-[20px] underline block w-[150px] truncate"
      >
        {message}
      </a>

    );
  }

  // Return message as is if it's not a link
  return message;
};

export default generateAnchorTag;
