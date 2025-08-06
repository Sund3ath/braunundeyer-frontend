import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SocialShare = ({ project }) => {
  const [copied, setCopied] = useState(false);
  
  const currentUrl = window.location.href;
  const shareText = `Check out this amazing project: ${project.title}`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:text-blue-700'
    },
    {
      name: 'Pinterest',
      icon: 'Instagram',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(shareText)}`,
      color: 'hover:text-red-600'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-surface rounded border border-border p-6">
      <h3 className="text-lg font-heading font-medium text-primary mb-4">
        Share This Project
      </h3>
      
      <div className="flex flex-wrap items-center gap-3">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link.url)}
            className={`flex items-center space-x-2 px-4 py-2 bg-background rounded border border-border text-text-secondary transition-colors duration-200 ${link.color} hover:border-current`}
            aria-label={`Share on ${link.name}`}
          >
            <Icon name={link.icon} size={16} />
            <span className="text-sm font-body font-medium">{link.name}</span>
          </button>
        ))}
        
        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-2 px-4 py-2 bg-background rounded border border-border text-text-secondary hover:text-accent hover:border-accent transition-colors duration-200"
          aria-label="Copy link"
        >
          <Icon name={copied ? "Check" : "Copy"} size={16} />
          <span className="text-sm font-body font-medium">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;