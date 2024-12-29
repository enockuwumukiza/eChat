import { useState, useEffect } from 'react';

const InternetStatus = () => {
  const [isConnectedToInternet, setIsConnectedToInternet] = useState<boolean>(navigator.onLine);
  const [showBackOnlineMessage, setShowBackOnlineMessage] = useState<boolean>(false);

  useEffect(() => {
    const handleConnectedToInternet = () => {
      setIsConnectedToInternet(true);
      setShowBackOnlineMessage(true);

      // Hide the "You're back online" message after 5 seconds
      setTimeout(() => {
        setShowBackOnlineMessage(false);
      }, 5000);
    };

    const handleDisconnectedFromInternet = () => {
      setIsConnectedToInternet(false);
    };

    window.addEventListener('online', handleConnectedToInternet);
    window.addEventListener('offline', handleDisconnectedFromInternet);

    return () => {
      window.removeEventListener('online', handleConnectedToInternet);
      window.removeEventListener('offline', handleDisconnectedFromInternet);
    };
  }, []);

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 z-50">
      {!isConnectedToInternet && (
        <div className="font-extrabold text-3xl text-red-600">
          You are disconnected
        </div>
      )}
      {isConnectedToInternet && showBackOnlineMessage && (
        <div className="font-extrabold text-3xl text-green-600">
          You're back online!
        </div>
      )}
    </div>
  );
};

export default InternetStatus;
