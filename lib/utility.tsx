import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types/types";
import qs from "query-string";

export const getTimestamp = (createdAt: Date): string => {
    const now = new Date();
    const timeDifference = now.getTime() - createdAt.getTime();
  
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;
  
    if (timeDifference < minute) {
      const seconds = Math.floor(timeDifference / 1000);
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (timeDifference < week) {
      const days = Math.floor(timeDifference / day);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (timeDifference < month) {
      const weeks = Math.floor(timeDifference / week);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (timeDifference < year) {
      const months = Math.floor(timeDifference / month);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(timeDifference / year);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
};
  
export const formatAndDivideNumber = (number: number): string => {
    if (number >= 1000000) {
      const millions = (number / 1000000).toFixed(1);
      return `${millions}M`;
    } else if (number >= 1000) {
      const thousands = (number / 1000).toFixed(1);
      return `${thousands}K`;
    } else {
      return `${number}`;
    }
};

export function formatDate(date:Date):string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

interface props{
  params:string;
  key:string;
  value:string|null;
}
export function formUrlQuery({params,key,value}:props):string{
  const currentQuery=qs.parse(params);
  currentQuery[key]=value;

  return qs.stringifyUrl(
    {
      url:window.location.pathname,
      query:currentQuery
    },
    {
      skipNull:true
    }
  )
}

interface RemoveQueryProps{
  params:string;
  keys:string[];
}
export function removeUrlQuery({params,keys}:RemoveQueryProps):string {
  const currentQuery=qs.parse(params);

  keys.forEach(key=>{
    delete currentQuery[key]
  });

  return qs.stringifyUrl(
    {
      url:window.location.pathname,
      query:currentQuery
    },
    {
      skipNull:true
    }
  )

}


interface BadgeParmas{
  criteria:{
    type:keyof typeof BADGE_CRITERIA;
    count:number
  }[];
}
export function assignBadges(params:BadgeParmas){
  const badgeCounts:BadgeCounts={
    BRONZE:0,
    SILVER:0,
    GOLD:0
  };
  const {criteria}=params;

  criteria.forEach((item)=>{
    const {type,count}=item;
    const badgeLevel:any=BADGE_CRITERIA[type];
    
    Object.keys(badgeLevel).forEach((level)=>{
      if(count>=badgeLevel[level]){
        badgeCounts[level as keyof BadgeCounts]+=1;
      }
    });
  });

  return badgeCounts;
}