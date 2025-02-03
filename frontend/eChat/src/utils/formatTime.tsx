export const formatTime = (timeString: string): string | undefined => {
    
    const inputDate = new Date(timeString);
    const now = new Date();

    if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date string provided");
    }
    try {
        
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
        } else if (daysDiff > 1 && daysDiff < 7) {
        
            return `${daysDiff} days ago`;

        } else if (daysDiff >= 7 && daysDiff < 30) {
            return `${Math.floor(daysDiff / 7)} week${Math.floor(daysDiff / 7) > 1 ? "s":""} ago`;

        } else if (daysDiff >= 30 && daysDiff < 365) {
            return `${Math.floor(daysDiff / 30)} month${Math.floor(daysDiff / 30) > 1 ? "s":""} ago`;

        } else {
            return `${Math.floor(daysDiff / 365)} years ago`;
        }
    } catch (error:any) {
        console.error(`Error formating time: ${error}`)
    }
}

