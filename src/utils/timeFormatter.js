export const checkTimePassed = (createdAt) => {
    if (createdAt) {
      const now = new Date();
      const createdTime = new Date(createdAt);

      const diffinSeconds = Math.floor((now - createdTime) / 1000);
      if (diffinSeconds < 60) {
        return `${diffinSeconds} seconds ago`;
      } else {
        const diffinMinutes = Math.floor(diffinSeconds / 60);
        if (diffinMinutes < 60) {
          return `${diffinMinutes} minutes ago`;
        } else {
          const diffinHours = Math.floor(diffinMinutes / 60);
          if (diffinHours < 24) {
            return `${diffinHours} hours ago`;
          } else {
            const diffinDays = Math.floor(diffinHours / 24);
            if (diffinDays < 7) {
              return `${diffinDays} days ago`;
            } else {
              const diffinWeeks = Math.floor(diffinDays / 7);
              if (diffinWeeks < 4) {
                return `${diffinWeeks} weeks ago`;
              } else {
                const diffinMonths = Math.floor(diffinDays / 30);
                if (diffinMonths < 12) {
                  return `${diffinMonths} months ago`;
                } else {
                  const diffinYears = Math.floor(diffinMonths / 12);
                  if (diffinYears) return `${diffinYears} years ago`;
                }
              }
            }
          }
        }
      }
    }else{
        return `unknown time`
    }
  };