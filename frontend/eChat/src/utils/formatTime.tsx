export const formatTime = (timeString: string): string => {
    
    const inputDate = new Date(timeString);
    const now = new Date();

    if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date string provided");
    }

    // Calculate the difference in days
    const timeDiff = now.getTime() - inputDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    if (daysDiff === 0) {
        // If the time is today
        return new Intl.DateTimeFormat('en-US', options).format(inputDate);
    } else if (daysDiff === 1) {
        // If the time is yesterday
        return `Yesterday ${new Intl.DateTimeFormat('en-US', options).format(inputDate)}`;
    } else {
        // If the time is more than one day ago
        return `${daysDiff} days ago`;
    }
}

