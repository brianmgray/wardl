import { useEffect, useState } from "react";

import { DateTime } from "luxon";
import {
  nextWardl,
  conditionalDebug
} from "./util";

interface CountdownProps {
  seedDate: DateTime
}

const COUNTDOWN_INTERVAL:number = 1000;

/**
 * Countdown component renders a countdown to the next Wardl
 * @param props Countdown 
 * @returns 
 */
export function Countdown(props: CountdownProps) {
  const [nextWardlCounter, setNextWardlCounter] = useState(""); // the clock for the next Wardl

  useEffect(() => {
    let interval = setInterval(() => {
      setNextWardlCounter(nextWardl());
    }, COUNTDOWN_INTERVAL);
    return () => clearInterval(interval);
  }, [props.seedDate, nextWardlCounter]);

  return (
    <h3>Next&nbsp;Wardl:&nbsp;{nextWardlCounter}</h3>
  );
}
